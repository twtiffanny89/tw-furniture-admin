import { useEffect, useState } from "react";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

interface CashImageProps {
  imageUrl: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

const CashImage: React.FC<CashImageProps> = ({
  imageUrl,
  width = 36,
  height = 36,
  borderRadius = 4,
  fit = "cover",
}) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setLoading(true);
  }, [imageUrl]);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setLoading(false);
  };

  return (
    <div
      className={`relative overflow-hidden flex cursor-pointer items-center justify-center ${
        hasError ? "bg-red-500" : "bg-transparent"
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${borderRadius}px`,
      }}
      onClick={() => {
        window.open(imageUrl, "_blank");
      }}
    >
      {/* Placeholder or Loading Spinner */}
      {loading && !hasError && (
        <div className="absolute inset-0 bg-[#00000046] flex justify-center items-center">
          <FaSpinner size={16} className="animate-spin text-white" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div
          className="flex justify-center items-center text-white text-center"
          style={{
            fontSize: `${Math.min(width, height) * 0.3}px`, // Scale font size based on container size
            padding: "4px",
            wordWrap: "break-word",
          }}
        >
          Error
        </div>
      )}

      {/* Actual Image */}
      {!hasError && (
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={imageUrl}
          width={width}
          height={height}
          className="overflow-hidden"
          style={{
            objectFit: fit,
            width: "100%",
            height: "100%",
            visibility: loading ? "hidden" : "visible",
            borderRadius: `${borderRadius}px`,
          }}
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default CashImage;
