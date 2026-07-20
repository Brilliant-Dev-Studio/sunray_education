import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

if (!region || !bucket) {
  throw new Error("AWS_REGION / AWS_S3_BUCKET env vars are not set");
}

const s3 = new S3Client({ region });

function extensionFromMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

/** Uploads a base64 data-URI image to S3 (private) and returns the object key. */
export async function uploadInvoiceImage(dataUri: string, userId: string): Promise<string> {
  const match = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image data URI");
  }
  const [, mime, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  const key = `certificates/${userId}/${Date.now()}-${crypto.randomUUID()}.${extensionFromMime(mime)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mime,
    })
  );

  return key;
}

/** Generates a short-lived signed URL to view a private invoice image. */
export async function getInvoiceImageUrl(key: string): Promise<string> {
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: 3600,
  });
}
