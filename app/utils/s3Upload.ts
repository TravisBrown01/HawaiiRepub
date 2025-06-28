import { uploadData, getUrl, remove } from '@aws-amplify/storage';

// Function to clean up malformed filenames that contain URLs
export function sanitizeFilename(filename: string): string {
  // If the filename contains a URL pattern, extract just the file extension
  if (filename.includes('http://') || filename.includes('https://')) {
    // Try to extract the actual filename from the URL
    try {
      const url = new URL(filename);
      const pathname = url.pathname;
      const lastSlash = pathname.lastIndexOf('/');
      if (lastSlash !== -1) {
        const extractedName = pathname.substring(lastSlash + 1);
        if (extractedName && extractedName.includes('.')) {
          return extractedName;
        }
      }
    } catch (e) {
      // If URL parsing fails, generate a safe filename
    }
    
    // Fallback: generate a safe filename with timestamp
    const timestamp = Date.now();
    const extension = filename.includes('.') ? filename.split('.').pop() : 'jpg';
    return `image_${timestamp}.${extension}`;
  }
  
  // Remove any potentially dangerous characters
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function uploadFileToS3(file: File, folder: string = 'events') {
  // Sanitize the filename to prevent URL encoding issues
  const sanitizedFilename = sanitizeFilename(file.name);
  const filename = `${folder}/${Date.now()}-${sanitizedFilename}`;
  
  console.log('Uploading file:', {
    originalName: file.name,
    sanitizedName: sanitizedFilename,
    finalKey: filename,
    size: file.size,
    type: file.type
  });
  
  await uploadData({ key: filename, data: file, options: { contentType: file.type, accessLevel: 'guest' } });
  
  // Return a public URL directly since the bucket is configured for public access
  return getPublicUrl(filename);
}

// Function to get public URLs (no expiration, no authentication required)
export function getPublicUrl(filename: string): string {
  const bucketName = 'hawaiirepub3c8cea135e3144caa0c954df127fb2a278bcd-dev';
  const region = 'us-west-2';
  
  // Ensure the filename is properly encoded
  const encodedFilename = encodeURIComponent(filename).replace(/%2F/g, '/');
  
  return `https://${bucketName}.s3.${region}.amazonaws.com/${encodedFilename}`;
}

// Function to validate if a URL is a valid S3 URL for our bucket
export function isValidS3Url(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const bucketName = 'hawaiirepub3c8cea135e3144caa0c954df127fb2a278bcd-dev';
    const region = 'us-west-2';
    
    // Check if it's our S3 bucket
    if (urlObj.hostname === `${bucketName}.s3.${region}.amazonaws.com`) {
      return true;
    }
    
    // Check if it's a CloudFront URL (if you have CloudFront set up)
    // You can add CloudFront domain validation here
    
    return false;
  } catch (error) {
    return false;
  }
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
    return getPublicUrl(filename);
  }
}

// Function to convert signed URLs to public URLs
export function convertToPublicUrl(signedUrl: string): string {
  try {
    const urlObj = new URL(signedUrl);
    
    // Remove query parameters (all the AWS signing parameters)
    const cleanPath = urlObj.pathname;
    
    // The path should be like /public/event-photos/filename.ext
    // We want to extract just the event-photos/filename.ext part
    const pathParts = cleanPath.split('/').filter(part => part.length > 0);
    
    // Skip 'public' if it's in the path
    const startIndex = pathParts[0] === 'public' ? 1 : 0;
    const relevantParts = pathParts.slice(startIndex);
    
    if (relevantParts.length >= 2) {
      const folder = relevantParts[0];
      const filename = relevantParts[1];
      return getPublicUrl(`${folder}/${filename}`);
    } else if (relevantParts.length === 1) {
      // If there's only one part, assume it's a filename
      return getPublicUrl(relevantParts[0]);
    }
    
    console.error('Could not parse signed URL path:', cleanPath);
    return signedUrl; // Return original if parsing fails
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