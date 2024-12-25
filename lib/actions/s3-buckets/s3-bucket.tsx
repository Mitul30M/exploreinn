"use server";

import { auth } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type SignedURLResponse = Promise<
  | { error?: undefined; success: { url: string } }
  | { error: string; success?: undefined }
>;

const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const maxFileSize = 4 * 1024 * 1024; // 4 MB

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};

import crypto from "crypto";
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// use this in edge
// const generateFileName = (bytes = 32) => {
//   const array = new Uint8Array(bytes);
//   crypto.getRandomValues(array);
//   return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
// };

export async function getSignedURL({
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams): SignedURLResponse {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Not Authenticated" };
  }
  if (!allowedFileTypes.includes(fileType)) {
    return { error: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { error: "File size too large" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${userId}-${generateFileName()}`,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    // Let's also add some metadata which is stored in s3.
    Metadata: {
      userId,
    },
  });

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );
  return { success: { url } };
}
