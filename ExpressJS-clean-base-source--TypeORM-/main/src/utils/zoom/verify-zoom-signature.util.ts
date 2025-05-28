import crypto from 'crypto';
import { Request } from 'express';

export function verifyZoomSignature(req: Request, rawBody: string): boolean {
  const secretToken = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
  const signature = req.headers['x-zm-signature'];
  const timestamp = req.headers['x-zm-request-timestamp'];

  if (!secretToken || typeof signature !== 'string' || typeof timestamp !== 'string') {
    return false;
  }

  const message = `v0:${timestamp}:${rawBody}`;
  const hash = crypto.createHmac('sha256', secretToken).update(message).digest('base64');

  const expectedSignature = `v0=${hash}`;
  return signature === expectedSignature;
}
