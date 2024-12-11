export const resizeImageConvertBase64 = (
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let width = targetWidth;
        let height = targetHeight;

        // Adjust dimensions to maintain aspect ratio
        if (img.width > img.height) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to Base64
          const base64 = canvas.toDataURL(file.type, 0.9); // Use file type for format
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
