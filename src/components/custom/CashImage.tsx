import { useEffect, useState } from "react";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa"; // Import an icon for error
import { images } from "@/constants/image/image";

interface CashImageProps {
  imageUrl: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down"; // Valid ObjectFit values
}

const CashImage: React.FC<CashImageProps> = ({
  imageUrl,
  width = 36,
  height = 36,
  borderRadius = 4,
  fit = "cover", // Default to 'cover'
}) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setLoading(true);
  }, [imageUrl]);

  useEffect(() => {
    // Set a timeout to trigger error if image takes too long to load
    const timeout = setTimeout(() => {
      if (loading) {
        setHasError(true); // Trigger error if image doesn't load within the timeout
        setLoading(false); // Hide the loading spinner
      }
    }, 2000);

    return () => {
      clearTimeout(timeout); // Clean up the timeout on component unmount
    };
  }, [loading]);

  const handleLoadingComplete = () => {
    setLoading(false); // Image has loaded
  };

  const handleError = () => {
    setHasError(true); // Error loading image
    setLoading(false); // Hide loading spinner
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Placeholder or Loading Spinner */}
      {loading && !hasError && (
        <div className="absolute inset-0 bg-[#00000046] flex justify-center items-center">
          <FaSpinner size={16} className="animate-spin text-white" />
        </div>
      )}

      {/* Actual Image */}
      <Image
        key={imageUrl} // Add the key here
        src={hasError ? images.errorImg : imageUrl} // Show fallback image if error occurs
        alt="Cash image"
        width={width}
        height={height}
        className="object-cover" // Tailwind's object-fit classes
        style={{
          objectFit: fit, // Use 'cover', 'contain', etc.
          visibility: loading ? "hidden" : "visible",
        }}
        onLoadingComplete={handleLoadingComplete} // Image loaded
        onError={handleError} // Image load error
      />
    </div>
  );
};

export default CashImage;
