import showToast from "@/components/error-handle/show-toast";

export const resizeImageConvertBase64 = (
  file: File,
  quality: number = 0.9,
  targetWidth?: number,
  targetHeight?: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check file size (10MB = 10 * 1024 * 1024 bytes)

    if (file.size > 8 * 1024 * 1024) {
      showToast("File size must be under 8MB.", "error");
      reject(new Error("File size must be under 8MB."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read the file."));
        return;
      }

      const img = new Image();
      img.src = event.target.result as string;
      img.crossOrigin = "Anonymous"; // Prevent potential CORS issues

      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        let newWidth = targetWidth || originalWidth;
        let newHeight = targetHeight || originalHeight;

        // Maintain aspect ratio when only one dimension is provided
        if (targetWidth && !targetHeight) {
          newHeight = Math.round(
            (targetWidth / originalWidth) * originalHeight
          );
        } else if (!targetWidth && targetHeight) {
          newWidth = Math.round(
            (targetHeight / originalHeight) * originalWidth
          );
        }

        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to create canvas context."));
          return;
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert canvas to Base64 with compression
        try {
          const base64 = canvas.toDataURL("image/jpeg", quality); // Default to JPEG for better compression
          resolve(base64);
        } catch {
          reject(new Error("Failed to convert image to Base64."));
        }
      };

      img.onerror = () => reject(new Error("Failed to load image."));
    };

    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsDataURL(file);
  });
};
