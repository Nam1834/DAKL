import crypto from 'crypto';
import { Request } from 'express';

export function verifyZoomSignature(req: Request): boolean {
  const secretToken = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
  const signature = req.headers['x-zm-signature'];
  const timestamp = req.headers['x-zm-request-timestamp'];

  if (!secretToken || typeof signature !== 'string' || typeof timestamp !== 'string') {
    return false;
  }

  // KHÔNG dùng rawBody, mà stringify lại object
  const message = `v0:${timestamp}:${JSON.stringify(req.body)}`;
  const hash = crypto.createHmac('sha256', secretToken).update(message).digest('hex');
  const expectedSignature = `v0=${hash}`;

  console.log('Expected signature:', expectedSignature);
  console.log('Signature from Zoom:', signature);

  return signature === expectedSignature;
}
