import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../../lib/utils";

export interface SearchProps extends React.HTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

function SearchBar({
  placeholder = "Search",
  className = "",
  ref,
  ...props
}: SearchProps & { ref?: React.Ref<HTMLInputElement> }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsExpanded(true);
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    // prevent memory leak
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const handleMouseLeave = () => {
    // Close it if user is not focused
    if (document.activeElement !== inputRef.current) {
      setIsExpanded(false);
    }
  };

  const handleMouseClick = () => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-8 items-center-safe rounded-md transition-all duration-300 ease-in-out",
        isExpanded ? "w-96 bg-menuitem" : "w-10",
        className,
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
      ref={ref}
      {...props}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-opacity" />
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        className={`h-full w-full bg-transparent pl-9 pr-3 text-sm transition-opacity duration-200 ease-in-out focus:outline-none ${isExpanded ? "opacity-100" : "opacity-0"}`}
        onFocus={() => setIsExpanded(true)}
        onBlur={handleMouseLeave}
        onKeyDown={handleKeyDown}
      ></input>
    </div>
  );
}

export default SearchBar;
