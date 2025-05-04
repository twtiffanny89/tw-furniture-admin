import React from "react";

interface SwitchProps {
  checked: boolean;
  disabled?: boolean; // Changed from disable to disabled for consistency with HTML standards
  onChange: () => void;
  size?: "sm" | "md" | "lg"; // Added size options
  className?: string; // Added className for custom styling
  label?: string; // Added optional label
  id?: string; // Added id for accessibility
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  label,
  id = `switch-${Math.random().toString(36).substring(2, 9)}`,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "w-8 h-4",
      dot: "w-3 h-3",
      dotTranslate: "translate-x-4",
    },
    md: {
      container: "w-10 h-5",
      dot: "w-4 h-4",
      dotTranslate: "translate-x-5",
    },
    lg: {
      container: "w-12 h-6",
      dot: "w-5 h-5",
      dotTranslate: "translate-x-6",
    },
  };

  // Get the correct size configuration
  const sizeStyle = sizeConfig[size];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <label
        htmlFor={id}
        className={`flex items-center relative ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={disabled ? undefined : onChange}
          disabled={disabled}
          aria-checked={checked}
          role="switch"
        />
        <div
          className={`block ${
            sizeStyle.container
          } rounded-full transition-colors duration-200 ease-in-out ${
            checked ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`dot absolute left-0.5 top-0.5 ${
            sizeStyle.dot
          } bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
            checked ? `${sizeStyle.dotTranslate} bg-white` : "translate-x-0"
          }`}
        ></div>
      </label>
      {label && (
        <span className={`ml-2 ${disabled ? "opacity-50" : ""}`}>{label}</span>
      )}
    </div>
  );
};
