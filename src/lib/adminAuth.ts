export const ADMIN_SESSION_COOKIE_NAME = "neon_moon_admin_session";

const SESSION_VERSION = 1;
const ADMIN_ROLE = "admin";
const ONE_DAY_SECONDS = 60 * 60 * 24;
const LOCAL_SESSION_SECONDS = ONE_DAY_SECONDS * 7;
const PRODUCTION_SESSION_SECONDS = ONE_DAY_SECONDS;

type AdminSessionPayload = {
  version: typeof SESSION_VERSION;
  role: typeof ADMIN_ROLE;
  issuedAt: number;
  expiresAt: number;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? null;
}

export function getExpectedAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_UPLOAD_PASSWORD ?? null;
}

export function getAdminSessionMaxAgeSeconds() {
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_SESSION_SECONDS
    : LOCAL_SESSION_SECONDS;
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}

export function isValidAdminPassword(password: unknown) {
  const expectedPassword = getExpectedAdminPassword();

  return (
    typeof password === "string" &&
    typeof expectedPassword === "string" &&
    timingSafeEqual(password, expectedPassword)
  );
}

export function getSafeAdminRedirectPath(nextPath: unknown) {
  if (typeof nextPath !== "string") {
    return "/admin";
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/admin";
  }

  const pathname = nextPath.split(/[?#]/, 1)[0] ?? "/";

  if (pathname === "/admin/login") {
    return "/admin";
  }

  if (isProtectedAdminPath(pathname)) {
    return nextPath;
  }

  return "/admin";
}

export function isProtectedAdminPath(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/blog/new" ||
    pathname === "/blog/admin" ||
    pathname.startsWith("/blog/admin/") ||
    pathname === "/media/admin" ||
    pathname.startsWith("/media/admin/") ||
    pathname === "/photos/admin" ||
    pathname.startsWith("/photos/admin/") ||
    pathname === "/photos/upload"
  );
}

export async function createAdminSessionCookieValue() {
  const secret = getAdminSessionSecret();

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    version: SESSION_VERSION,
    role: ADMIN_ROLE,
    issuedAt,
    expiresAt: issuedAt + getAdminSessionMaxAgeSeconds(),
  };
  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const signature = await signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionCookie(cookieValue: string | undefined) {
  if (!cookieValue) {
    return false;
  }

  const secret = getAdminSessionSecret();

  if (!secret) {
    return false;
  }

  const [encodedPayload, signature, extra] = cookieValue.split(".");

  if (!encodedPayload || !signature || extra !== undefined) {
    return false;
  }

  const expectedSignature = await signValue(encodedPayload, secret);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return false;
  }

  const payload = decodeAdminSessionPayload(encodedPayload);

  if (!payload) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  return payload.expiresAt > now;
}

function decodeAdminSessionPayload(
  encodedPayload: string,
): AdminSessionPayload | null {
  try {
    const json = base64UrlDecodeString(encodedPayload);
    const payload = JSON.parse(json) as unknown;

    if (!isAdminSessionPayload(payload)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function isAdminSessionPayload(payload: unknown): payload is AdminSessionPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return (
    candidate.version === SESSION_VERSION &&
    candidate.role === ADMIN_ROLE &&
    typeof candidate.issuedAt === "number" &&
    typeof candidate.expiresAt === "number" &&
    Number.isFinite(candidate.issuedAt) &&
    Number.isFinite(candidate.expiresAt)
  );
}

async function signValue(value: string, secret: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    textEncoder.encode(value),
  );

  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function base64UrlEncodeString(value: string) {
  return base64UrlEncodeBytes(textEncoder.encode(value));
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecodeString(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binary = atob(paddedBase64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return textDecoder.decode(bytes);
}

function timingSafeEqual(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let result = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    result |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return result === 0;
}
