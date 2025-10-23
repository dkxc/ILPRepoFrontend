import { useRef, useState } from "react";
import { cn } from "../../../../lib/utils";
import { UserRound } from "lucide-react";
import HeaderItem from "../HeaderItem";
import { useOnClickOutside } from "../../../../hooks/useOnClickOutside";

interface ProfileIconWithDropDownProps
  extends React.HTMLAttributes<HTMLDivElement> {
  avatarUrl?: string;
}

export function ProfileIconWithDropDown({
  avatarUrl,
  children,
  className,
  ...props
}: ProfileIconWithDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropDown = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(wrapperRef, () => setIsOpen(false));

  return (
    <div ref={wrapperRef} className={cn("relative", className)} {...props}>
      <HeaderItem
        asChild
        className="rounded-full overflow-hidden"
        onClick={toggleDropDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="p-2" />
        )}
      </HeaderItem>

      {isOpen && (
        <div className="absolute right-0 w-48 bg-white rounded-md shadow-md z-10">
          {children}
        </div>
      )}
    </div>
  );
}
