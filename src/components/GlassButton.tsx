import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  active?: boolean;
}

export default function GlassButton({
  children,
  className,
  variant = "primary",
  active = false,
  ...rest
}: GlassButtonProps) {
  const baseClasses = "px-6 py-3 rounded-full font-medium transition-all duration-300";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg",
    secondary: "text-primary-100 hover:bg-white/20",
    outline: "bg-transparent border-2 border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:text-white"
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        active && "bg-purple-500/30",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
} 