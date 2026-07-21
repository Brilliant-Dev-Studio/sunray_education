const PAYMENT_LABELS: Record<string, string> = {
  UAB_PAY: "UAB Pay",
  KBZ_PAY: "KBZ Pay",
  WAVE_MONEY: "Wave Money",
};

type NotifyCertificateRequestInput = {
  requestId: string;
  userName: string;
  userEmail: string;
  contactEmail: string;
  testName: string;
  levelCode: string;
  levelName: string;
  score: number;
  total: number;
  percentage: number;
  paymentMethod: string;
  price: number;
  invoiceImageDataUri: string; // data:image/...;base64,....
};

// Fire-and-forget Telegram alert for a new certificate request, including
// the uploaded invoice screenshot. Silently no-ops if unconfigured, and
// never throws — a notification failure must not block the request flow.
export async function notifyTelegramNewCertificateRequest(
  input: NotifyCertificateRequestInput
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!token || chatIds.length === 0) return;

  const caption = [
    "🎓 New Certificate Request",
    "",
    `Name: ${input.userName}`,
    `Account Email: ${input.userEmail}`,
    `Contact Email: ${input.contactEmail}`,
    `Test: ${input.testName}`,
    `Level: ${input.levelCode} · ${input.levelName}`,
    `Score: ${input.score}/${input.total} (${input.percentage}%)`,
    `Payment: ${PAYMENT_LABELS[input.paymentMethod] ?? input.paymentMethod}`,
    `Price: ${input.price.toLocaleString()} MMK`,
    `Request ID: ${input.requestId}`,
  ].join("\n");

  try {
    const match = input.invoiceImageDataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) {
      console.error("Telegram notify: invalid invoice image data URI");
      return;
    }
    const [, mime, base64] = match;
    const ext = mime.split("/")[1] || "jpg";
    const buffer = Buffer.from(base64, "base64");

    await Promise.all(
      chatIds.map(async (chatId) => {
        const form = new FormData();
        form.append("chat_id", chatId);
        form.append("caption", caption);
        form.append("photo", new Blob([buffer], { type: mime }), `invoice.${ext}`);

        const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          console.error(`Telegram notify failed for chat ${chatId}:`, await res.text());
        }
      })
    );
  } catch (err) {
    console.error("Telegram notify error:", err);
  }
}
