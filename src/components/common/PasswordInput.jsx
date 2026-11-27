import { forwardRef, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Reusable password field built on shadcn Input + Button with 40x40px
 * accessible visibility toggle.
 */
const PasswordInput = forwardRef(
    (
        {
            id,
            toggleLabel,
            error,
            className,
            ...props
        },
        ref
    ) => {
        const [visible, setVisible] = useState(false);

        return (
            <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={ref}
                    id={id}
                    type={visible ? "text" : "password"}
                    aria-invalid={Boolean(error)}
                    className={cn(
                        "h-11 pl-10 pr-12",
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    {...props}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setVisible((prev) => !prev)}
                    aria-label={toggleLabel}
                    aria-pressed={visible}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground"
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
