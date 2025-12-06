import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const SimpleSelect = ({ 
  options, 
  placeholder = "Select...", 
  value, 
  onValueChange,
  className 
}: SimpleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-3 flex items-center justify-between border border-luxury-divider rounded bg-white text-left hover:border-service-gold focus:border-service-gold focus:outline-none transition-colors"
      >
        <span className={cn(
          "text-sm",
          selectedOption ? "text-luxury-text" : "text-luxury-text-muted"
        )}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 text-luxury-text-muted transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-luxury-divider rounded shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-luxury-bg-warm transition-colors",
                value === option.value ? "bg-luxury-bg-warm text-service-gold" : "text-luxury-text"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};