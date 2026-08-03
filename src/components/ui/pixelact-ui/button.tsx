import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/pixelact-ui/styles/styles.css";
import "./button.css";

const pixelButtonVariants = cva(
  "pixel__button pixel-font cursor-pointer rounded-none inline-flex items-center justify-center whitespace-nowrap font-bold border-3 border-pxl-dark shadow-[4px_4px_0px_0px_#2d2d2d] transition-all duration-200 select-none gap-2.5",
  {
    variants: {
      variant: {
        default: "bg-white text-pxl-dark",
        mint: "bg-pxl-mint text-pxl-dark",
        purple: "bg-pxl-purple text-pxl-dark",
        pink: "bg-pxl-pink text-pxl-dark",
        yellow: "bg-pxl-yellow text-pxl-dark",
        blue: "bg-pxl-blue text-pxl-dark",
        sky: "bg-pxl-sky text-pxl-dark",
        secondary: "bg-pxl-purple text-pxl-dark",
        warning: "bg-pxl-yellow text-pxl-dark",
        success: "bg-pxl-mint text-pxl-dark",
        destructive: "bg-pxl-pink-pop text-white",
        link: "bg-transparent text-pxl-dark underline shadow-none border-0 px-0",
      },
      size: {
        default: "h-10 px-4 text-xs",
        sm: "h-8 px-3 text-[10px]",
        lg: "h-12 px-5 text-xs sm:text-sm",
      },
    },
    defaultVariants: {
      variant: "mint",
      size: "default",
    },
  }
);

export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pixelButtonVariants> {
  asChild?: boolean;
}

import { playButtonSound } from "@/lib/audioManager";

const Button = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playButtonSound();
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        {...props}
        onClick={handleClick}
        className={cn(pixelButtonVariants({ variant, size }), className)}
        ref={ref}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, pixelButtonVariants, playButtonSound };
