export const resizeImageConvertBase64 = (
  file: File,
  quality: number = 0.9, // Default quality is 0.9 (compression)
  targetWidth?: number, // Optional target width for resizing
  targetHeight?: number // Optional target height for resizing
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Get the original width and height of the image
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Default to original dimensions if no target dimensions are provided
        let newWidth = targetWidth || originalWidth;
        let newHeight = targetHeight || originalHeight;

        // Adjust dimensions if only one of targetWidth or targetHeight is provided
        if (targetWidth && !targetHeight) {
          const aspectRatio = originalWidth / originalHeight;
          newHeight = targetWidth / aspectRatio;
        } else if (!targetWidth && targetHeight) {
          const aspectRatio = originalWidth / originalHeight;
          newWidth = targetHeight * aspectRatio;
        }

        // Create a canvas to draw the resized or original image
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convert the image to Base64 with the specified quality
          const base64 = canvas.toDataURL(file.type, quality); // Apply the quality compression
          resolve(base64);
        } else {
          reject(new Error("Canvas context not available"));
        }
      };

      img.onerror = () => reject(new Error("Image load error"));
    };

    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
};
