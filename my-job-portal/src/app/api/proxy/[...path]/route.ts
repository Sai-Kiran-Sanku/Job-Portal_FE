import { NextResponse } from "next/server";

function safeJsonParse(s: string | null) {
  try {
    return s ? JSON.parse(s) : null;
  } catch {
    return s;
  }
}

async function forward(req: Request, params: { path: string[] }) {
  console.log(
    `[proxy] ${req.method} /api/proxy/${(params.path || []).join("/")}`
  );

  const allowlist = (process.env.PROXY_ALLOWLIST || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowlist.length > 0) {
    const top = params.path?.[0];
    if (!top || !allowlist.includes(top)) {
      return NextResponse.json(
        { message: "Path not allowed by proxy" },
        { status: 403 }
      );
    }
  }

  const qs = new URL(req.url).search;
  const backendBase = process.env.API_URL ?? "http://localhost:8000";
  const backendPrefix = (process.env.PROXY_BACKEND_PREFIX ?? "/api/v1").replace(
    /\/$/,
    ""
  );

  const backendUrl = `${backendBase}${backendPrefix}/${params.path.join(
    "/"
  )}${qs}`.replace(/([^:])\/\//g, "$1/");

  console.log(`[proxy] forwarding to backend: ${backendUrl}`);

  const forwardedHeaders: Record<string, string> = {};
  req.headers.forEach((v, k) => {
    const low = k.toLowerCase();
    if (["host", "connection", "content-length"].includes(low)) return;
    forwardedHeaders[k] = v;
  });

  const contentType = req.headers.get("content-type");
  if (contentType && !forwardedHeaders["content-type"]) {
    forwardedHeaders["content-type"] = contentType;
  }

  let body: ArrayBuffer | undefined;
  try {
    const buf = await req.arrayBuffer();
    if (buf && buf.byteLength > 0) body = buf;
  } catch {
    body = undefined;
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, {
      method: req.method,
      headers: forwardedHeaders,
      body: body as any,
      credentials: "include",
    });
  } catch (err: any) {
    console.error(`[proxy] fetch to backend failed:`, err?.message || err);
    return NextResponse.json(
      {
        message: "Bad gateway: failed to reach backend",
        error: String(err),
      },
      { status: 502 }
    );
  }

  const resContentType = backendRes.headers.get("content-type") || "";

  if (resContentType.includes("application/json")) {
    const text = await backendRes.text().catch(() => null);
    const parsed = safeJsonParse(text);
    const out = NextResponse.json(parsed ?? text, {
      status: backendRes.status,
    });
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);
    return out;
  }

  const arrayBuf = await backendRes.arrayBuffer().catch(() => null);
  const out = new NextResponse(arrayBuf, {
    status: backendRes.status,
    headers: { "content-type": resContentType },
  });
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) out.headers.set("set-cookie", setCookie);
  return out;
}

// ⬇️ Use ctx: any to avoid Next.js 15 route type generation bug
export async function GET(req: Request, ctx: any) {
  return forward(req, ctx.params);
}
export async function POST(req: Request, ctx: any) {
  return forward(req, ctx.params);
}
export async function PUT(req: Request, ctx: any) {
  return forward(req, ctx.params);
}
export async function PATCH(req: Request, ctx: any) {
  return forward(req, ctx.params);
}
export async function DELETE(req: Request, ctx: any) {
  return forward(req, ctx.params);
}
export async function OPTIONS(req: Request, ctx: any) {
  return forward(req, ctx.params);
}