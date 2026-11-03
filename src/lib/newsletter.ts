import { Resend } from 'resend';

let resendClient: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.NEWSLETTER_FROM_EMAIL || 'THEREALCISO <newsletter@therealciso.in>',
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (resendClient) {
      const response = await resendClient.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (response.error) {
        console.error('Resend error:', response.error);
        return { success: false, error: response.error.message };
      }

      return { success: true, id: response.data?.id };
    } else {
      // In development or when API key is not yet set, log email gracefully
      console.log('----------------------------------------------------');
      console.log(`[RESEND SIMULATION] To: ${to}`);
      console.log(`[RESEND SIMULATION] Subject: ${subject}`);
      console.log(`[RESEND SIMULATION] Content snippet: ${html.slice(0, 150)}...`);
      console.log('----------------------------------------------------');
      return { success: true, id: `mock_${Date.now()}` };
    }
  } catch (error) {
    const err = error as Error;
    console.error('Failed to send email:', err.message);
    return { success: false, error: err.message };
  }
}

