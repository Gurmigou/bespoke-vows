import { useEffect, useRef, useState, useCallback } from 'react';
import { invitations, sendBeaconUpdate } from '@/lib/api';
import type { InvitationData } from '@bespoke-vows/shared';

const DEBOUNCE_MS = 2000;
const ANON_KEY = 'bv:draft:anon';
const draftKey = (id: string | null) => (id ? `bv:draft:${id}` : ANON_KEY);

interface StoredDraft {
  templateId?: string;
  config: Partial<InvitationData>;
  updatedAt: string;
}

function readLocal(id: string | null): StoredDraft | null {
  try {
    const raw = localStorage.getItem(draftKey(id));
    return raw ? (JSON.parse(raw) as StoredDraft) : null;
  } catch {
    return null;
  }
}

function writeLocal(id: string | null, draft: StoredDraft) {
  try {
    localStorage.setItem(draftKey(id), JSON.stringify(draft));
  } catch {
    // Quota exceeded (e.g. large base64 images) — skip persisting rather than crash.
  }
}

function clearLocal(id: string | null) {
  localStorage.removeItem(draftKey(id));
}

export interface UseInvitationDraftArgs {
  invitationId: string | null;
  templateId?: string;
  initial: InvitationData;
  serverUpdatedAt?: string | null;
}

export function useInvitationDraft({ invitationId, templateId, initial, serverUpdatedAt }: UseInvitationDraftArgs) {
  const [data, setData] = useState<InvitationData>(initial);
  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const initialRef = useRef(initial);
  initialRef.current = initial;

  // Restore anon draft on mount (no id case)
  useEffect(() => {
    if (invitationId) return;
    const local = readLocal(null);
    if (!local) return;
    setData((prev) => ({ ...prev, ...local.config }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When server config first arrives, reset data to it (then apply any newer local draft on top)
  const serverReadyRef = useRef(false);
  useEffect(() => {
    if (!serverUpdatedAt || serverReadyRef.current) return;
    serverReadyRef.current = true;
    const current = initialRef.current;
    const local = readLocal(invitationId);
    if (local && invitationId && new Date(local.updatedAt) > new Date(serverUpdatedAt)) {
      const merged = { ...current, ...local.config };
      setData(merged);
      dirtyRef.current = true;
      void invitations.update(invitationId, { config: merged }).catch(() => {});
    } else {
      setData(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUpdatedAt]);

  const flush = useCallback(async () => {
    if (!dirtyRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (invitationId) {
      try {
        await invitations.update(invitationId, { config: dataRef.current });
        dirtyRef.current = false;
      } catch {
        // keep dirty; retry on next change/flush
      }
    }
  }, [invitationId]);

  const update = useCallback(
    (next: InvitationData | ((prev: InvitationData) => InvitationData)) => {
      const computed =
        typeof next === 'function'
          ? (next as (p: InvitationData) => InvitationData)(dataRef.current)
          : next;
      setData(computed);
      writeLocal(invitationId, {
        templateId,
        config: computed,
        updatedAt: new Date().toISOString(),
      });
      dirtyRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (invitationId) {
        timerRef.current = setTimeout(() => {
          void flush();
        }, DEBOUNCE_MS);
      }
    },
    [invitationId, templateId, flush]
  );

  // Beacon flush on tab close / hide
  useEffect(() => {
    if (!invitationId) return;
    const onHide = () => {
      if (dirtyRef.current) {
        sendBeaconUpdate(invitationId, dataRef.current);
        dirtyRef.current = false;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') onHide();
    };
    window.addEventListener('pagehide', onHide);
    window.addEventListener('beforeunload', onHide);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('beforeunload', onHide);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [invitationId]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const clearDraft = useCallback(() => clearLocal(invitationId), [invitationId]);

  return { data, setData: update, flush, clearDraft };
}
