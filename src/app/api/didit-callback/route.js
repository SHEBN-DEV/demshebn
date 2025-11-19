import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("verificationSessionId");

  const html = `
    <script>
      window.parent.postMessage(
        { diditVerification: { sessionId: "${sessionId}" } },
        "*"
      );

      setTimeout(() => window.close(), 50);
    </script>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html"
    }
  });
}