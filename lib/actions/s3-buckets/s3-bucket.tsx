"use server";

import { auth } from "@clerk/nextjs/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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
  prefix: "listing" | "room" | "post" | "attachment";
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

/**
 * Generates a signed URL for uploading an object to AWS S3.
 *
 * @param {string} prefix - The prefix to use for the object key.
 * @param {string} fileType - The type of the file being uploaded.
 * @param {number} fileSize - The size of the file being uploaded.
 * @param {string} checksum - The SHA256 checksum of the file being uploaded.
 * @returns {Promise<{error?: string, success?: {url: string}}>} A promise that resolves to an object with a signed URL or an error message.
 */
export async function getSignedURL({
  prefix,
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
    Key: `${prefix}-${generateFileName()}`,
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

/**
 * Deletes an object from AWS S3.
 *
 * @param {string} key - The key of the object to be deleted.
 * @returns {Promise<{error?: string}>} A promise that resolves to an object with an error message if the user is not authenticated.
 */

export async function deleteFile(key: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Not Authenticated" };
  }
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key.split("/").pop()?.split("?")[0] || "",
    })
  );
}

/**
 * Generates a signed URL for uploading legal documents to AWS S3.
 *
 * @param {{ prefix: string; fileType: string; fileSize: number; checksum: string }} params
 * @returns {Promise<{error?: string, success?: {url: string}}>} A promise that resolves to an object with an error message if the user is not authenticated, or an object with a success message containing the signed URL if the user is authenticated.
 */
export async function getSignedURLForLegalDocs({
  prefix,
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams): SignedURLResponse {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Not Authenticated" };
  }
  if (
    ![
      "application/pdf",
      "applocation/docx",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ].includes(fileType)
  ) {
    return { error: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { error: "File size too large" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${prefix}-legalDoc-${generateFileName()}`,
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

export async function getSignedURLForMailAttachment({
  prefix,
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams): SignedURLResponse {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Not Authenticated" };
  }
  if (
    ![
      "application/pdf",
      "applocation/docx",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ].includes(fileType)
  ) {
    return { error: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { error: "File size too large" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${prefix}-${generateFileName()}`,
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
