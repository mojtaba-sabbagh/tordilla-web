// lib/forms-webhook.ts

/**
 * Mirrors contact-form submissions into the Tordilla Forms app
 * (form 1041906 — «پیامهای وبسایت»), on top of saving them to our own database.
 *
 * The endpoint takes a flat JSON object whose keys must be exactly the form's
 * field keys: name, telephone, email, subject, message. Unknown keys are
 * rejected with 422, and serial-number/formula fields are computed server-side,
 * so nothing else may be sent. A successful call answers 201 with
 * { ok: true, entryId, workflowStarted }.
 *
 * Authentication is a bearer token of the shape <KEY_ID>.<SECRET>. The same URL
 * answers GET with the expected field list and records nothing, which is the
 * way to test credentials. Note that the endpoint also enforces an IP allow
 * list, so it only accepts calls from the production host.
 */

const WEBHOOK_TIMEOUT_MS = 8_000;
const WEBHOOK_ATTEMPTS = 2;

/** Keys here are the form's field keys — renaming one breaks delivery with 422. */
export type FormsWebhookPayload = {
  name: string;
  telephone: string;
  email?: string;
  subject: string;
  message: string;
};

export type FormsWebhookResult =
  | { status: 'delivered'; entryId?: unknown; workflowStarted?: unknown }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string };

/**
 * Delivery is best effort: the message is already in our database by the time
 * this runs, so a webhook failure is logged and reported back, never thrown.
 */
export async function sendToFormsWebhook(payload: FormsWebhookPayload): Promise<FormsWebhookResult> {
  const url = process.env.FORMS_WEBHOOK_URL;
  const token = process.env.FORMS_WEBHOOK_TOKEN;

  if (!url || !token) {
    // Logged rather than passed over quietly: a deployment whose environment
    // never picked up these two variables looks exactly like one where nothing
    // was submitted, and the messages simply stop arriving with no trace.
    const reason = 'FORMS_WEBHOOK_URL or FORMS_WEBHOOK_TOKEN is not set';
    console.warn('Forms webhook not configured, message saved locally only:', reason);
    return { status: 'skipped', reason };
  }

  let lastReason = 'unknown error';

  for (let attempt = 1; attempt <= WEBHOOK_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      const body = await response.json().catch(() => null);

      if (response.ok) {
        return {
          status: 'delivered',
          entryId: body?.entryId,
          workflowStarted: body?.workflowStarted,
        };
      }

      lastReason = `HTTP ${response.status}${body ? ` ${JSON.stringify(body)}` : ''}`;

      // 4xx means the request itself is wrong (bad credentials, unknown field,
      // failed validation). Retrying sends the identical body, so don't.
      if (response.status < 500) break;
    } catch (error) {
      lastReason = error instanceof Error ? error.message : String(error);
    }
  }

  console.error('Forms webhook delivery failed:', lastReason);
  return { status: 'failed', reason: lastReason };
}
