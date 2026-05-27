const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3');

const bucket = () => process.env.AWS_S3_BUCKET_NAME;
const region = () => process.env.AWS_REGION;
const folder = () => (process.env.AWS_S3_FOLDER || 'uploads').replace(/\/$/, '');

function buildKey(filename) {
  return `${folder()}/${filename}`;
}

function buildPublicUrl(key) {
  return `https://${bucket()}.s3.${region()}.amazonaws.com/${key}`;
}

function keyFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('amazonaws.com')) return null;
    return decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  } catch {
    return null;
  }
}

async function uploadToS3(file) {
  const key = buildKey(`${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);

  console.log('[s3Upload] uploadToS3 called:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    bufferLength: file.buffer ? file.buffer.length : 0,
    bucket: bucket(),
    region: region(),
    key,
  });

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  ).then(() => {
    console.log('[s3Upload] PutObjectCommand success');
  }).catch((err) => {
    console.error('[s3Upload] PutObjectCommand failed:', {
      name: err?.name,
      code: err?.Code || err?.code,
      message: err?.message,
    });
    throw err;
  });

  return buildPublicUrl(key);
}

async function deleteFromS3(imageUrl) {
  const key = keyFromUrl(imageUrl);
  if (!key) return;

  console.log('[s3Upload] deleteFromS3 called:', { bucket: bucket(), key });
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket(),
      Key: key,
    })
  );
}

module.exports = { uploadToS3, deleteFromS3, buildPublicUrl };
