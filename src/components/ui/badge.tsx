import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary",
        secondary:
          "border-transparent bg-[#334155] text-slate-200",
        destructive:
          "border-transparent bg-destructive/20 text-red-400",
        outline: "text-foreground",
        security:
          "border-primary/30 bg-primary/10 text-primary",
        business:
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        reputation:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        critical:
          "border-red-900/50 bg-red-900/30 text-red-400",
        hard:
          "border-red-900/50 bg-red-900/30 text-red-400",
        high:
          "border-orange-900/50 bg-orange-900/30 text-orange-400",
        medium:
          "border-yellow-900/50 bg-yellow-900/30 text-yellow-400",
        easy:
          "border-blue-900/50 bg-blue-900/30 text-blue-400",
        low:
          "border-blue-900/50 bg-blue-900/30 text-blue-400",
        live:
          "border-yellow-500/30 bg-yellow-500/20 text-yellow-500 uppercase tracking-wider font-bold",
        new:
          "border-blue-900/50 bg-blue-900/30 text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
