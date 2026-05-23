import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Bespoke Vows <noreply@beloved-invite.com>';

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Відновлення пароля — Bespoke Vows',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
        <h2 style="margin-top: 0;">Відновлення пароля</h2>
        <p>Ви отримали цей лист, оскільки запросили скидання пароля для вашого акаунту Bespoke Vows.</p>
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
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Оплата підтверджена — Bespoke Vows',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
        <h2 style="margin-top: 0;">Дякуємо за покупку! 🎉</h2>
        <p>Ваш доступ до Bespoke Vows активовано на <strong>1 рік</strong>.</p>
        <p>Тепер ви можете ділитися своїм запрошенням з гостями — воно буде доступне протягом усього цього часу.</p>
        <a href="${process.env.WEB_ORIGIN ?? 'https://beloved-invite.com'}/account" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #c8a97e; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Перейти до акаунту
        </a>
        <p style="font-size: 13px; color: #666;">З любов'ю, команда Bespoke Vows 💌</p>
      </div>
    `,
  });
}
