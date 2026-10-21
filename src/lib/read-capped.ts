// The longest valid form is a 5,000-character message plus short fields. Written in
// Amharic, that is 3 bytes a character, so about 16 KB; 32 KB leaves room for it.
export const MAX_BODY_BYTES = 32 * 1024;

/**
 * Reads the body as text, giving up as soon as it passes `limit` bytes, so an
 * oversized post is never buffered whole. Returns null when it is too large.
 * Content-Length is checked first but not trusted: it can be absent or wrong.
 */
export async function readCapped(request: Request, limit: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > limit) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
