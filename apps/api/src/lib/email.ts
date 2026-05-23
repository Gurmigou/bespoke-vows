import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM ?? 'Beloved <noreply@beloved-invite.com>';

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY missing');
  return new Resend(key);
}

async function send(payload: { to: string; subject: string; html: string }): Promise<void> {
  const { data, error } = await getClient().emails.send({
    from: FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
  if (error) {
    console.error('[email] resend error:', error);
    throw new Error(`resend_failed: ${error.name ?? 'unknown'} - ${error.message ?? ''}`);
  }
  console.log('[email] sent', { to: payload.to, subject: payload.subject, id: data?.id });
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  await send({
    to,
    subject: 'Відновлення пароля — Beloved',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
        <h2 style="margin-top: 0;">Відновлення пароля</h2>
        <p>Ви отримали цей лист, оскільки запросили скидання пароля для вашого акаунту Beloved.</p>
        <p>Натисніть кнопку нижче, щоб встановити новий пароль. Посилання дійсне <strong>60 хвилин</strong>.</p>
        <a href="${resetLink}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #c8a97e; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Змінити пароль
        </a>
        <p style="font-size: 13px; color: #666;">Якщо ви не надсилали цей запит — просто ігноруйте лист.</p>
      </div>
    `,
  });
}

export async function sendPurchaseConfirmationEmail(to: string): Promise<void> {
  await send({
    to,
    subject: 'Оплата підтверджена — Beloved',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
        <h2 style="margin-top: 0;">Дякуємо за покупку! 🎉</h2>
        <p>Ваш доступ до Beloved активовано на <strong>1 рік</strong>.</p>
        <p>Тепер ви можете ділитися своїм запрошенням з гостями — воно буде доступне протягом усього цього часу.</p>
        <a href="${process.env.WEB_ORIGIN ?? 'https://beloved-invite.com'}/account" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #c8a97e; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Перейти до акаунту
        </a>
        <p style="font-size: 13px; color: #666;">З любов'ю, команда Beloved 💌</p>
      </div>
    `,
  });
}
