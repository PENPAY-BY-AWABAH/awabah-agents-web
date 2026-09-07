import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { trackingId } = await req.json();

    if (!trackingId) {
      return NextResponse.json(
        { status: false, message: "Missing trackingId", data: {} },
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

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: "image/png",
    });

    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: 900,
    });

    return NextResponse.json({
      status: true,
      message: "Presigned URL generated",
      data: { signedUrl, key },
    });
  } catch (e: any) {
    return NextResponse.json(
      { status: false, message: e?.message || "Failed to generate presigned URL", data: {} },
      { status: 500 }
    );
  }
}
