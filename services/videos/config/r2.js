const AWS = require('aws-sdk');

const r2 = new AWS.S3({
  accessKeyId: process.env.CF_ACCESS_KEY,
  secretAccessKey: process.env.CF_SECRET_KEY,
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: process.env.CF_REGION,
  signatureVersion: 'v4'
});

module.exports = r2;
