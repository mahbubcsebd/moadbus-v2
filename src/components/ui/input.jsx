import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

function Input({ className, type = "text", numeric, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isCheckbox = type === "checkbox";
  const isRadio = type === "radio";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleKeyPress = (e) => {
    if (numeric) {
      // Allow only numbers
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e) => {
    if (numeric) {
      const paste = e.clipboardData.getData("text");
      if (!/^\d+$/.test(paste)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className={cn('relative ',!isCheckbox && !isRadio && 'w-full' ) }>
      <input
        type={actualType}
        data-slot="input"
        onKeyDown={handleKeyPress}
        className={cn(
          "file:text-foreground placeholder-gray-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          isPassword && "pr-10", // space for the eye icon
          isCheckbox && "p-1 w-4 h-4 mr-2", // checkbox size
          isRadio && "p-1 w-3 h-3 mr-1", // checkbox size
          className
        )}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-4 flex items-center justify-center text-gray-500 hover:text-gray-700 transition"
        >
          {showPassword ? (
            <EyeOff size={18} strokeWidth={1.8} />
          ) : (
            <Eye size={18} strokeWidth={1.8} />
          )}
        </button>
      )}
    </div>
  );
}

export { Input };
