export interface CompressionResult {
  base64: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  savedPercentage: number;
  width: number;
  height: number;
  mimeType: string;
}

/**
 * Compresses an image file or data URL using an HTML5 Canvas.
 * Resizes max dimension to 1600px and exports as JPEG quality 0.82.
 * Drastically reduces upload bandwidth for mobile users on Nigerian cellular networks.
 */
export async function compressImage(
  source: File | string,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    let originalSizeKB = 0;

    const img = new Image();

    if (typeof source === 'string') {
      img.src = source;
      // Estimate size from base64 string
      originalSizeKB = Math.round((source.length * (3 / 4)) / 1024);
    } else {
      originalSizeKB = Math.round(source.size / 1024);
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }

    img.onload = () => {
      let { width, height } = img;

      // Scale down proportionally if larger than maximum boundaries
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      // Draw with high quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      const compressedSizeKB = Math.round((compressedDataUrl.length * (3 / 4)) / 1024);
      const savedPercentage = originalSizeKB > 0
        ? Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100))
        : 0;

      resolve({
        base64: compressedDataUrl,
        originalSizeKB,
        compressedSizeKB,
        savedPercentage,
        width,
        height,
        mimeType,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
  });
}
