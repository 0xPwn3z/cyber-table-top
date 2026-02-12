import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/40",
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-500",
        outline:
          "border border-[#334155] bg-transparent text-slate-200 hover:bg-surface hover:border-slate-500",
        secondary:
          "bg-surface text-slate-200 shadow-sm hover:bg-surface-hover border border-[#334155]",
        ghost:
          "text-slate-400 hover:bg-surface hover:text-slate-200",
        link:
          "text-primary underline-offset-4 hover:underline",
        option:
          "border border-[#334155] bg-surface text-left text-slate-200 hover:bg-surface-hover hover:border-primary hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        full: "h-auto w-full p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
