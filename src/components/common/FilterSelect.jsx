import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const EMPTY_SENTINEL = "__all__";

/**
 * Reusable shadcn Select wrapper supporting empty-string "All" values,
 * bounded scrollable dropdowns, and full accessibility.
 */
const FilterSelect = ({
    id,
    value,
    onValueChange,
    options = [],
    placeholder,
    ariaLabel,
    triggerClassName,
    contentClassName,
}) => {
    const safeValue = value === "" || value === undefined || value === null
        ? EMPTY_SENTINEL
        : String(value);

    const handleChange = (next) => {
        onValueChange(next === EMPTY_SENTINEL ? "" : next);
    };

    return (
        <Select value={safeValue} onValueChange={handleChange}>
            <SelectTrigger
                id={id}
                aria-label={ariaLabel}
                className={cn("rounded-lg border-input bg-background text-sm", triggerClassName)}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={cn("max-h-60 border-border bg-popover", contentClassName)}>
                {options.map((opt) => {
                    const itemValue = opt.value === "" ? EMPTY_SENTINEL : String(opt.value);
                    return (
                        <SelectItem key={itemValue} value={itemValue}>
                            {opt.label}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};

export default FilterSelect;
