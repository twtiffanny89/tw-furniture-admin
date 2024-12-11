import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`border px-4 text-sm bg-gray-50 border-gray-300 rounded w-full duration-150 ease-in-out focus:outline-none 
                  focus:border-primary focus:ring-0 focus:ring-primary placeholder-gray-500  disabled:bg-gray-200
                  transition-all  focus:border-1 active:border-1 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
