import { env } from '../config/env.js';
import type { IPaymentResult, OrderDocument } from '../models/Order.js';
import { HttpError } from './httpError.js';

/** With a client secret configured, the server captures and verifies PayPal payments itself. */
export const isPaypalServerCaptureEnabled = (): boolean => Boolean(env().PAYPAL_CLIENT_SECRET);

interface PaypalOrder {
  id: string;
  status?: string;
  purchase_units?: Array<{ reference_id?: string; amount?: { currency_code?: string; value?: string } }>;
  payer?: { email_address?: string };
  update_time?: string;
}

const getAccessToken = async (): Promise<string> => {
  const { PAYPAL_API_BASE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = env();
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new HttpError(502, 'Could not reach PayPal');
  return ((await res.json()) as { access_token: string }).access_token;
};

const paypalFetch = async (path: string, token: string, init: RequestInit = {}): Promise<PaypalOrder> => {
  const res = await fetch(`${env().PAYPAL_API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new HttpError(400, 'PayPal payment could not be processed');
  return (await res.json()) as PaypalOrder;
};

/** The PayPal order must be for this order (reference id) and for exactly its total in USD. */
const assertMatchesOrder = (paypalOrder: PaypalOrder, order: OrderDocument) => {
  const unit = paypalOrder.purchase_units?.[0];
  if (
    unit?.reference_id !== order.id ||
    unit.amount?.currency_code !== 'USD' ||
    Number(unit.amount.value) !== order.totalPrice
  ) {
    throw new HttpError(400, 'PayPal payment does not match this order');
  }
};

/**
 * Captures an approved PayPal order server-side, after checking it belongs to `order`.
 * Callers must check the order is still payable (and in stock) first, since money moves here.
 */
export const capturePaypalOrder = async (paypalOrderId: string, order: OrderDocument): Promise<IPaymentResult> => {
  const token = await getAccessToken();
  const path = `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`;
  const approved = await paypalFetch(path, token);
  assertMatchesOrder(approved, order);
  if (approved.status !== 'APPROVED') {
    throw new HttpError(400, 'PayPal payment has not been approved');
  }

  const captured = await paypalFetch(`${path}/capture`, token, { method: 'POST' });
  if (captured.status !== 'COMPLETED') {
    throw new HttpError(402, 'PayPal could not complete the payment');
  }
  return {
    id: captured.id,
    status: captured.status,
    updateTime: captured.update_time,
    email: captured.payer?.email_address,
  };
};
