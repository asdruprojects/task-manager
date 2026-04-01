import { webcrypto } from 'node:crypto';

/** @nestjs/typeorm usa `crypto.randomUUID()` global; en Node 18 no existe hasta cargar esto. */
if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    enumerable: true,
    configurable: true,
    writable: true,
  });
}
