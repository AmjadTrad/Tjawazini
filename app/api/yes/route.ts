import { Resend } from "resend";

export async function POST() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) {
    return Response.json({ error: "Email is not configured" }, { status: 500 });
  }

  const when = new Date().toLocaleString("en-GB", { timeZone: "Asia/Amman" });

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM ?? "Marry Me <onboarding@resend.dev>",
    to,
    subject: "💍 Farah said YES! ❤️",
    text: `Congratulations! Farah just pressed YES on your proposal page.\n\n${when}`,
    html: `
      <div style="font-family:Georgia,serif;background:#2a0006;color:#fff;padding:40px;text-align:center;border-radius:16px">
        <div style="font-size:64px">💍</div>
        <h1 style="color:#ff4d6d;margin:12px 0">Farah said YES! ❤️</h1>
        <p style="color:#ffccd5;font-size:18px">She just pressed YES on your proposal page.</p>
        <p style="color:#ffb3c1;font-size:14px">${when}</p>
      </div>`,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ error: error.message }, { status: 502 });
  }
  return Response.json({ ok: true });
}
