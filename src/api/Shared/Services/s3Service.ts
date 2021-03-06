import { S3 } from 'aws-sdk';
import { customAlphabet } from 'nanoid';
const s3 = new S3({ apiVersion: '2006-03-01', signatureVersion: 'v4', region: process.env.AWS_REGION });
const bucketName = process.env.S3_BUCKET_NAME || 'papyrusstoragedump';

export const uploadFileToS3 = async (filename: string, buffer: Buffer, mimeType: string) => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 10);
  const uniquekey = nanoid() + filename;
  await s3
    .putObject({
      Bucket: bucketName,
      Key: uniquekey,
      ContentType: mimeType,
      Body: buffer,
    })
    .promise();
  return uniquekey;
};

export const getSignedUrlFromS3 = async (key: string) => {
  return await s3.getSignedUrlPromise('getObject', { Bucket: bucketName, Key: key, Expires: 300 });
};
