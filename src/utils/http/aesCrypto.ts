export interface EncryptedPayload {
  encrypted: true
  iv: string
  data: string
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function normalizeBase64(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  return base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function base64ToBytes(value: string) {
  const binary = atob(normalizeBase64(value))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1)
    bytes[i] = binary.charCodeAt(i)
  return bytes
}

function hexToBytes(value: string) {
  const bytes = new Uint8Array(value.length / 2)
  for (let i = 0; i < value.length; i += 2)
    bytes[i / 2] = Number.parseInt(value.slice(i, i + 2), 16)
  return bytes
}

function isAesKeyLength(length: number) {
  return length === 16 || length === 24 || length === 32
}

function parseEncryptKey(encryptKey: string) {
  const key = encryptKey.trim()
  if (/^[\da-f]+$/i.test(key) && key.length % 2 === 0) {
    const bytes = hexToBytes(key)
    if (isAesKeyLength(bytes.byteLength))
      return bytes
  }

  try {
    const bytes = base64ToBytes(key)
    if (isAesKeyLength(bytes.byteLength))
      return bytes
  }
  catch {
    // Not a Base64 key; fall back to using the original string bytes.
  }

  const bytes = textEncoder.encode(key)
  if (!isAesKeyLength(bytes.byteLength))
    throw new Error('Invalid AES key length. encryptKey must be 16/24/32 bytes, Base64, or hex.')
  return bytes
}

async function importAesKey(encryptKey: string) {
  return crypto.subtle.importKey(
    'raw',
    parseEncryptKey(encryptKey),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  )
}

export function isEncryptedPayload(value: unknown): value is EncryptedPayload {
  return !!value
    && typeof value === 'object'
    && (value as EncryptedPayload).encrypted === true
    && typeof (value as EncryptedPayload).iv === 'string'
    && typeof (value as EncryptedPayload).data === 'string'
}

export async function aesGcmEncryptJson(value: unknown, encryptKey: string): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await importAesKey(encryptKey)
  const plaintext = textEncoder.encode(JSON.stringify(value ?? {}))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)

  return {
    encrypted: true,
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(encrypted)),
  }
}

export async function aesGcmDecryptJson<T = any>(payload: EncryptedPayload, encryptKey: string): Promise<T> {
  const key = await importAesKey(encryptKey)
  // console.log('encryptKey', encryptKey);
  // console.log('key', key);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(payload.iv) },
    key,
    base64ToBytes(payload.data),
  )
  // console.log('decrypted', decrypted);
  const text = textDecoder.decode(decrypted)
  // console.log('text', text);
  return JSON.parse(text) as T
}
