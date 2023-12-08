import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/utils/index";
// I had to edit this type to allow customization of the indicator background
type CustomProgressPrimitive = React.ForwardRefExoticComponent<
  Omit<
    ProgressPrimitive.ProgressProps & React.RefAttributes<HTMLDivElement>,
    "ref"
  > & { indicatorBackground?: boolean }
>;
const Progress = React.forwardRef<
  React.ElementRef<CustomProgressPrimitive>,
  React.ComponentPropsWithoutRef<CustomProgressPrimitive>
>(({ className, indicatorBackground, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    {/* I Editted this to allow customization of indicator background */}
    <ProgressPrimitive.Indicator
      className={cn({
        "h-full w-full flex-1  transition-all": true,
        "bg-[#0160fe]": !indicatorBackground,
        "dark:bg-red-800 bg-red-500": indicatorBackground,
      })}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
