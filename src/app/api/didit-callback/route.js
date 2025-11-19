import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("verificationSessionId");

    console.log("📩 DIDIT CALLBACK (GET) — sessionId:", sessionId);

    const html = `
      <html>
        <body>
          <script>
            window.parent.postMessage(
              {
                diditVerification: {
                  success: true,
                  sessionId: "${sessionId}"
                }
              },
              "*"
            );
            setTimeout(() => window.close(), 100);
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" }
    });

  } catch (err) {
    console.error("DIDIT CALLBACK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}