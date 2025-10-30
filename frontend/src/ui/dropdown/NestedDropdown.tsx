/**
 * Adapted from Untitled UI to support nested submenus.
 */
import {
  isValidElement,
  type FC,
  type ReactNode,
  type RefAttributes,
} from "react";
import { ChevronRight, EllipsisVertical } from "lucide-react";
import type {
  ButtonProps as AriaButtonProps,
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  PopoverProps as AriaPopoverProps,
  SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import {
  Button as AriaButton,
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Separator as AriaSeparator,
  SubmenuTrigger,
} from "react-aria-components";
import { cn } from "@lib/utils";
import { isReactComponent } from "@lib/isReactComponent";

interface DropdownItemProps extends AriaMenuItemProps {
  label?: string;
  addon?: string;
  unstyled?: boolean;
  icon?: ReactNode | FC<{ className?: string }>;
}

const DropdownItem = ({
  label,
  children,
  addon,
  icon: Icon,
  unstyled,
  ...props
}: DropdownItemProps) => {
  if (unstyled) {
    return <AriaMenuItem id={label} textValue={label} {...props} />;
  }
  return (
    <AriaMenuItem
      {...props}
      className={(state) =>
        cn(
          "group block cursor-pointer px-1.5 py-px outline-hidden",
          state.isDisabled && "cursor-not-allowed",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    >
      {(state) => (
        <div
          className={cn(
            "relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear",
            !state.isDisabled && "group-hover:bg-primary_hover",
            state.isFocused && "bg-primary_hover",
            state.isFocusVisible && "outline-2 -outline-offset-2",
          )}
        >
          {isReactComponent(Icon) ? (
            <Icon
              aria-hidden="true"
              className={cn(
                "mr-2 size-4 shrink-0 stroke-[2.25px]",
                state.isDisabled ? "text-fg-disabled" : "text-fg-quaternary",
              )}
            />
          ) : isValidElement(Icon) ? (
            Icon
          ) : null}
          <span
            className={cn(
              "grow truncate text-sm font-semibold",
              state.isDisabled ? "text-disabled" : "text-secondary",
              state.isFocused && "text-secondary_hover",
            )}
          >
            {label ||
              (typeof children === "function" ? children(state) : children)}
          </span>
          {addon && (
            <span
              className={cn(
                "ml-3 shrink-0 rounded px-1 py-px text-xs font-medium ring-1 ring-secondary ring-inset",
                state.isDisabled ? "text-disabled" : "text-quaternary",
              )}
            >
              {addon}
            </span>
          )}
        </div>
      )}
    </AriaMenuItem>
  );
};

interface DropdownMenuProps<T extends object> extends AriaMenuProps<T> {}

const DropdownMenu = <T extends object>(props: DropdownMenuProps<T>) => {
  return (
    <AriaMenu
      disallowEmptySelection
      selectionMode="single"
      {...props}
      className={(state) =>
        cn(
          "h-min overflow-y-auto py-1 outline-hidden select-none",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    />
  );
};

interface DropdownPopoverProps extends AriaPopoverProps {
  placement?: AriaPopoverProps["placement"];
}

const DropdownPopover = ({
  placement = "bottom right",
  ...props
}: DropdownPopoverProps) => {
  return (
    <AriaPopover
      placement={placement}
      {...props}
      className={(state) =>
        cn(
          "w-62 origin-(--trigger-anchor-point) overflow-auto rounded-lg bg-primary shadow-lg ring-1 ring-secondary_alt will-change-transform",
          state.isEntering &&
            "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
          state.isExiting &&
            "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    >
      {props.children}
    </AriaPopover>
  );
};

const DropdownSeparator = (props: AriaSeparatorProps) => {
  return (
    <AriaSeparator
      {...props}
      className={cn("my-1 h-px w-full bg-border-secondary", props.className)}
    />
  );
};

const DropdownDotsButton = (
  props: AriaButtonProps & RefAttributes<HTMLButtonElement>,
) => {
  return (
    <AriaButton
      {...props}
      aria-label="Open menu"
      className={(state) =>
        cn(
          "cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear",
          (state.isPressed || state.isHovered) && "text-fg-quaternary_hover",
          (state.isPressed || state.isFocusVisible) &&
            "outline-2 outline-offset-2",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    >
      <EllipsisVertical className="size-5 transition-inherit-all" />
    </AriaButton>
  );
};

interface DropdownSubmenuProps extends Omit<AriaMenuItemProps, "children"> {
  label: string;
  icon?: ReactNode | FC<{ className?: string }>;
  children: ReactNode;
}

const DropdownSubmenu = ({
  label,
  children,
  icon: Icon,
  ...props
}: DropdownSubmenuProps) => {
  return (
    <SubmenuTrigger>
      <AriaMenuItem
        {...props}
        className={(state) =>
          cn(
            "group block cursor-pointer px-1.5 py-px outline-hidden",
            state.isDisabled && "cursor-not-allowed",
            typeof props.className === "function"
              ? props.className(state)
              : props.className,
          )
        }
      >
        {(state) => (
          <div
            className={cn(
              "relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear",
              !state.isDisabled && "group-hover:bg-primary_hover",
              state.isFocused && "bg-primary_hover",
              state.isFocusVisible && "outline-2 -outline-offset-2",
            )}
          >
            {isReactComponent(Icon) ? (
              <Icon
                aria-hidden="true"
                className={cn(
                  "mr-2 size-4 shrink-0 stroke-[2.25px]",
                  state.isDisabled ? "text-fg-disabled" : "text-fg-quaternary",
                )}
              />
            ) : isValidElement(Icon) ? (
              Icon
            ) : null}
            <span
              className={cn(
                "grow truncate text-sm font-semibold",
                state.isDisabled ? "text-disabled" : "text-secondary",
                state.isFocused && "text-secondary_hover",
              )}
            >
              {label}
            </span>
            <ChevronRight
              aria-hidden
              className="ml-auto size-4 shrink-0 text-fg-quaternary"
            />
          </div>
        )}
      </AriaMenuItem>

      <DropdownPopover placement="right top">
        <DropdownMenu>{children}</DropdownMenu>
      </DropdownPopover>
    </SubmenuTrigger>
  );
};

export const Dropdown = {
  Root: AriaMenuTrigger,
  Popover: DropdownPopover,
  Menu: DropdownMenu,
  Section: AriaMenuSection,
  SectionHeader: AriaHeader,
  Item: DropdownItem,
  Submenu: DropdownSubmenu,
  Separator: DropdownSeparator,
  DotsButton: DropdownDotsButton,
};
