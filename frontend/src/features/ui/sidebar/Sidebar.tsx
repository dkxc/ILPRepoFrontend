import { NavLink, type To } from "react-router";
import MenuBar from "./MenuBar";
import MenuItem from "./MenuItem";

export interface NavItem {
  to: To;
  label: string;
  icon?: React.ElementType;
  end?: boolean;
}

export interface SideBarProps extends React.HTMLAttributes<HTMLElement> {
  navItems: NavItem[];
}

function SideBar({
  navItems,
  className = "",
  ref,
  ...props
}: SideBarProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <aside className={`h-full ${className}`} ref={ref} {...props}>
      <MenuBar>
        {navItems.map((item) => (
          <NavLink
            key={item.to.toString()}
            to={item.to}
            end={item.end}
            viewTransition
          >
            {({ isActive }) => (
              <MenuItem isActive={isActive}>
                <>
                  {item.icon && <item.icon />}
                  {item.label}
                </>
              </MenuItem>
            )}
          </NavLink>
        ))}
      </MenuBar>
    </aside>
  );
}

export default SideBar;
