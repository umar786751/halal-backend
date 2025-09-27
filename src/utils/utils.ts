import { PutObjectCommand } from "@aws-sdk/client-s3"
import { S3Client } from "@aws-sdk/client-s3"



export async function uploadImage(file: any,s3Client:S3Client): Promise<string> {

    const uploadResult = await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || 'halalfood',
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));

    console.log(uploadResult);
    // return the url of the image
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME || 'halalfood'}.s3.amazonaws.com/${file.originalname}`;
    return imageUrl;
}