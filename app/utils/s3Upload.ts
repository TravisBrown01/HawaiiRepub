import { uploadData, getUrl, remove } from '@aws-amplify/storage';

export async function uploadFileToS3(file: File, folder: string = 'events') {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  await uploadData({ key: filename, data: file, options: { contentType: file.type, accessLevel: 'guest' } });
  
  // Return a signed URL since public access isn't working
  return await getSignedUrl(filename);
}

// Function to get signed URLs for authenticated access (for refreshing expired URLs)
export async function getSignedUrl(filename: string): Promise<string> {
  try {
    const { url } = await getUrl({ 
      key: filename, 
      options: { 
        accessLevel: 'guest',
        validateObjectExistence: false,
        expiresIn: 86400 // 24 hours
      } 
    });
    return typeof url === 'string' ? url : url.toString();
  } catch (error) {
    console.error('Error getting signed URL:', error);
    // Fallback to public URL
    const bucketName = 'hawaiirepub3c8cea135e3144caa0c954df127fb2a278bcd-dev';
    const region = 'us-west-2';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
  }
}

// Function to convert signed URLs to public URLs
export function convertToPublicUrl(signedUrl: string): string {
  try {
    const urlObj = new URL(signedUrl);
    const pathParts = urlObj.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    const folder = pathParts[pathParts.length - 2];
    
    const bucketName = 'hawaiirepub3c8cea135e3144caa0c954df127fb2a278bcd-dev';
    const region = 'us-west-2';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${folder}/${filename}`;
  } catch (error) {
    console.error('Error converting to public URL:', error);
    return signedUrl; // Return original if conversion fails
  }
}

export async function deleteFileFromS3(url: string) {
  try {
    // Extract the key from the URL
    const urlObj = new URL(url);
    const key = urlObj.pathname.substring(1); // Remove leading slash
    await remove({ key, options: { accessLevel: 'guest' } });
  } catch (error) {
    console.error('Error deleting file from S3:', error);
  }
}

export async function deleteMultipleFilesFromS3(urls: string[]) {
  const deletePromises = urls.map(url => deleteFileFromS3(url));
  await Promise.all(deletePromises);
} 