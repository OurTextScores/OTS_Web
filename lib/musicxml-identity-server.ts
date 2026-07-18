import { createHash } from 'node:crypto';

import { canonicalizeMusicXmlIdentity, MUSICXML_IDENTITY_VERSION } from './musicxml-identity';

export function computeMusicXmlIdentityHashServer(xml: string): string {
  const canonical = canonicalizeMusicXmlIdentity(xml);
  const hex = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return `${MUSICXML_IDENTITY_VERSION}:${hex}`;
}
