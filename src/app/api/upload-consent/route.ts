import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

function base64ToBuffer(base64: string): Uint8Array {
  const clean = base64.replace(/\s/g, "");
  const pad = clean.length % 4 === 0 ? "" : "=".repeat(4 - (clean.length % 4));
  const padded = clean + pad;
  const binary = atob(padded);
  const n = binary.length;
  const bytes = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const trackingId = form.get("trackingId") as string | null;
    const file = form.get("file") as Blob | null;
    const base64 = form.get("base64") as string | null;

    if (!trackingId) {
      return NextResponse.json(
        { status: false, message: "Missing trackingId", data: {} },
        { status: 400 }
      );
    }
    if (!file && !base64) {
      return NextResponse.json(
        { status: false, message: "Missing file or base64 payload", data: {} },
        { status: 400 }
      );
    }

    const client = new S3Client({
      region: process.env.R2_REGION,
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });

    const key = `${process.env.R2_ACCESS_FOLDER}/${trackingId}.png`;
    const body: Uint8Array | Buffer = file
      ? new Uint8Array(await file.arrayBuffer())
      : base64ToBuffer(base64!);

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: "image/png",
    });

    await client.send(command);

    return NextResponse.json({
      status: true,
      message: "Consent uploaded",
      data: { key },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e ?? "Failed to upload consent");
    return NextResponse.json(
      { status: false, message, data: {} },
      { status: 500 }
    );
  }
}
