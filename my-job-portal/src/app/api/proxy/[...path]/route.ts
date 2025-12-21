import { NextResponse } from "next/server";

function safeJsonParse(s: string | null) {
  try {
    return s ? JSON.parse(s) : null;
  } catch {
    return s;
  }
}

async function forward(req: Request, params: { path: string[] }) {
  console.log(`[proxy] ${req.method} /api/proxy/${(params.path||[]).join("/")}`)
  // Allowlist (optional): comma separated top-level paths like "auth,jobs"
  const allowlist = (process.env.PROXY_ALLOWLIST || "").split(",").map(s => s.trim()).filter(Boolean);
  if (allowlist.length > 0) {
    const top = params.path?.[0];
    if (!top || !allowlist.includes(top)) {
      return NextResponse.json({ message: "Path not allowed by proxy" }, { status: 403 });
    }
  }

  const qs = new URL(req.url).search;
  const backendBase = process.env.API_URL ?? "http://localhost:8000";
  // Optional prefix on backend for API versions, e.g. '/api/v1'. Can be empty.
  const backendPrefix = (process.env.PROXY_BACKEND_PREFIX ?? "/api/v1").replace(/\/$/, "");
  const backendUrl = `${backendBase}${backendPrefix}/${params.path.join("/")}${qs}`.replace(/([^:])\/\//g, "$1/");
  console.log(`[proxy] forwarding to backend: ${backendUrl}`)

  // Build headers for forwarding (copy but drop some)
  const forwardedHeaders: Record<string, string> = {};
  req.headers.forEach((v, k) => {
    const low = k.toLowerCase();
    if (["host", "connection", "content-length"].includes(low)) return;
    forwardedHeaders[k] = v;
  });

  // Ensure content-type is preserved (important for form-data)
  const contentType = req.headers.get("content-type");
  if (contentType && !forwardedHeaders["content-type"]) forwardedHeaders["content-type"] = contentType;

  // Read body as array buffer (works for JSON and form-data)
  let body: ArrayBuffer | undefined;
  try {
    const buf = await req.arrayBuffer();
    if (buf && buf.byteLength > 0) body = buf;
  } catch (e) {
    body = undefined;
  }

  let backendRes: Response
  try {
    backendRes = await fetch(backendUrl, {
      method: req.method,
      headers: forwardedHeaders,
      body: body as any,
      credentials: "include",
    })
  } catch (err: any) {
    console.error(`[proxy] fetch to backend failed:`, err?.message || err)
    return NextResponse.json({ message: "Bad gateway: failed to reach backend", error: normalizeErr(err) }, { status: 502 })
  }

  function normalizeErr(e: any) { try { return String(e) } catch { return 'error' } }

  // Forward status, content-type and body
  const resContentType = backendRes.headers.get("content-type") || "";

  // If JSON, parse and return NextResponse.json
  if (resContentType.includes("application/json")) {
    const text = await backendRes.text().catch(() => null);
    const parsed = safeJsonParse(text);
    const out = NextResponse.json(parsed ?? text, { status: backendRes.status });
    // forward set-cookie
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);
    return out;
  }

  // For other content types (text, html, binary)
  const arrayBuf = await backendRes.arrayBuffer().catch(() => null);
  const out = new NextResponse(arrayBuf, { status: backendRes.status, headers: { "content-type": resContentType } });
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) out.headers.set("set-cookie", setCookie);
  return out;
}

export async function GET(req: Request, ctx: { params: { path: string[] } }) { return forward(req, ctx.params); }
export async function POST(req: Request, ctx: { params: { path: string[] } }) { return forward(req, ctx.params); }
export async function PUT(req: Request, ctx: { params: { path: string[] } }) { return forward(req, ctx.params); }
export async function PATCH(req: Request, ctx: { params: { path: string[] } }) { return forward(req, ctx.params); }
export async function DELETE(req: Request, ctx: { params: { path: string[] } }) { return forward(req, ctx.params); }
export async function OPTIONS(req: Request, ctx: { params: { path: string[] } }) { return forward(req, ctx.params); }