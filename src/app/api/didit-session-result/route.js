import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const response = await fetch(
      `https://verification.didit.me/session/${sessionId}/decision/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.DIDIT_API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ DIDIT GET RESULT ERROR:", data);
      return NextResponse.json({ error: "Error fetching Didit result" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("💥 Server error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
