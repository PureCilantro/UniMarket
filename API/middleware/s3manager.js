import { S3Client, HeadBucketCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import { resolve } from 'path';

const awsRegion = process.env.AWS_REGION;
const s3Bucket = process.env.S3_BUCKET;

const s3 = new S3Client({ region: awsRegion });

const checkBucketConnection = async () => {
    try {
        await s3.send(new HeadBucketCommand({ Bucket: s3Bucket }));
        return true;
    } catch (err) {
        console.error('S3 bucket connection failed:', err.message);
        return false;
    }
};

const generatePresignedUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: s3Bucket,
        Key: key,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
};

const uploadFile = async (fileName) => {
    const filePath = resolve('temp/' + fileName);
    const fileContent = fs.readFileSync(filePath);
    const command = new PutObjectCommand({
        Bucket: s3Bucket,
        Key: fileName,
        Body: fileContent,
        ContentType: 'image/webp',
    });
    return s3.send(command);
};

const deleteFile = async (fileName) => {
    const command = new DeleteObjectCommand({
        Bucket: s3Bucket,
        Key: fileName,
    });
    return s3.send(command);
};

export { checkBucketConnection, generatePresignedUrl, uploadFile, deleteFile };