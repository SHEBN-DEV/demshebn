import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const host = req.headers.get("host") || "";
    const protocol = host.includes("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/api/didit-callback`;

    const apiKey = process.env.DIDIT_API_KEY;
    const workflowId = process.env.DIDIT_WORKFLOW_ID;

    console.log("🔎 DIDIT_API_KEY exists:", !!apiKey);
    console.log("🔎 DIDIT_WORKFLOW_ID:", workflowId);
    console.log("🔎 callbackUrl:", callbackUrl);
    console.log("🔎 body:", body);

    // 1) Validar envs
    if (!apiKey || !workflowId) {
      console.error("❌ Faltan variables de entorno de Didit");
      return NextResponse.json(
        {
          error:
            "Configuración incompleta en el backend (DIDIT_API_KEY o DIDIT_WORKFLOW_ID).",
        },
        { status: 500 }
      );
    }

    // 2) Llamada a Didit (usa el endpoint que tengas en la doc, aquí pongo sessions)
    const response = await fetch("https://verification.didit.me/auth/v2/session/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        callback: callbackUrl,
        vendor_data: body.userId || "temp-user",
        metadata: { user_type: "standard" },
        contact_details: {
          email: body.email,
          email_lang: "en",
          phone: body.phone || "+10000000000",
        },
      }),
    });

    const data = await response.json();
    console.log("🟣 Didit status:", response.status, "body:", data);

    if (!response.ok) {
      console.error("❌ Error desde Didit:", data);
      return NextResponse.json(
        {
          error: "Error creando sesión Didit",
          diditStatus: response.status,
          diditBody: data,
        },
        { status: 500 }
      );
    }

    // 3) Si todo va bien, devolvemos la URL de Didit
    return NextResponse.json({ url: data.url });
  } catch (err) {
    console.error("❌ Error Didit (catch):", err);
    return NextResponse.json(
      { error: err.message || "No se pudo crear la sesión Didit" },
      { status: 500 }
    );
  }
}

