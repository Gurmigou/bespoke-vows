import type {
  User,
  Template,
  Invitation,
  Payment,
  RegisterBody,
  LoginBody,
  CreateInvitationBody,
  UpdateInvitationBody,
  HideInvitationBody,
  PreviewTokenResponse,
  PublicInvitationView,
  InvitationData,
} from '@bespoke-vows/shared';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(data?.error ?? `HTTP ${res.status}`, res.status, data?.error);
  }
  return data as T;
}

export const auth = {
  register: (body: RegisterBody) => request<User>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: LoginBody) => request<User>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request<{ ok: true }>('/auth/logout', { method: 'POST' }),
  me: () => request<User>('/auth/me'),
  deleteAccount: () => request<{ ok: true }>('/auth/account', { method: 'DELETE' }),
};

export const templates = {
  list: () => request<Template[]>('/templates'),
  bySlug: (slug: string) => request<Template>(`/templates/${slug}`),
};

export const invitations = {
  list: () => request<Invitation[]>('/invitations'),
  get: (id: string) => request<Invitation>(`/invitations/${id}`),
  create: (body: CreateInvitationBody) => request<Invitation>('/invitations', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: UpdateInvitationBody) => request<Invitation>(`/invitations/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  reset: (id: string) => request<Invitation>(`/invitations/${id}/reset`, { method: 'POST' }),
  delete: (id: string) => request<{ ok: true }>(`/invitations/${id}`, { method: 'DELETE' }),
  hide: (id: string, body: HideInvitationBody) => request<Invitation>(`/invitations/${id}/hide`, { method: 'POST', body: JSON.stringify(body) }),
  publish: (id: string) => request<Invitation>(`/invitations/${id}/publish`, { method: 'POST' }),
  pay: (id: string, body: { amount?: number; currency?: string } = {}) => request<Invitation>(`/invitations/${id}/pay`, { method: 'POST', body: JSON.stringify(body) }),
  previewToken: (id: string) => request<PreviewTokenResponse>(`/invitations/${id}/preview-token`, { method: 'POST' }),
};

export const payments = {
  list: () => request<Payment[]>('/payments'),
};

export const publicApi = {
  preview: (token: string) => request<PublicInvitationView>(`/preview/${token}`),
  guest: (id: string) => request<PublicInvitationView>(`/i/${id}`, { cache: 'no-store' }),
};

export const upload = {
  image: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_URL}/upload`, { method: 'POST', credentials: 'include', body: form });
    const data = await res.json();
    if (!res.ok) throw new ApiError(data?.error ?? `HTTP ${res.status}`, res.status, data?.error);
    return data;
  },
};

export function sendBeaconUpdate(id: string, config: Partial<InvitationData>): boolean {
  if (typeof navigator === 'undefined' || !('sendBeacon' in navigator)) return false;
  const blob = new Blob([JSON.stringify({ config })], { type: 'application/json' });
  return navigator.sendBeacon(`${API_URL}/invitations/${id}/sync`, blob);
}

export const API_BASE_URL = API_URL;
