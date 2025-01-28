import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva("border text-center p-4 text-sm flex items-center w-full", {
  variants: {
    variant: {
      warning: "bg-yellow-200/80 border-yellow-300 text-yellow-800",
      success: "bg-emerald-200/80 border-emerald-300 text-emerald-800",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

export const Banner = ({ label, variant }: BannerProps) => {
  return (
    <div className={cn(bannerVariants({ variant }))}>
      {variant === "warning" && <AlertTriangle className="h-4 w-4 mr-2" />}
      {variant === "success" && <CheckCircleIcon className="h-4 w-4 mr-2" />}
      {label}
    </div>
  );
};
