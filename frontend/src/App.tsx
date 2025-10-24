import { Outlet, useNavigate } from "react-router";
import SideBar from "./features/ui/sidebar/Sidebar";
import {
  Bell,
  ChartLine,
  ChartNoAxesCombined,
  FolderGit2,
  House,
  LogOut,
  Moon,
  Sun,
  UserRoundCog,
  Settings,
  CheckCircle,
  XCircle,
  UsersRound,
} from "lucide-react";

import Header from "./features/ui/header/Header";
import experionLogo from "./assets/experionlogo.svg";
import HeaderBar from "./features/ui/header/HeaderBar";
import HeaderItem from "./features/ui/header/HeaderItem";
import SearchBar from "./features/ui/header/search/SearchBar";

import { useState } from "react";
import { Toaster } from "sonner";

import { cn } from "./lib/utils";
import { ProfileIconWithDropDown } from "./features/ui/header/profile/ProfileIconWithDropDown";
import { useTheme } from "./hooks/useTheme";

const navItems = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/ilpprojects", label: "ILP Projects", icon: FolderGit2 },
  { to: "/results", label: "Results", icon: ChartNoAxesCombined },
  { to: "/curriculum", label: "Curriculum", icon: ChartLine },
];

const adminNavItems = [
  { to: "/admindash", label: "Home", icon: House, end: true },
  { to: "/batches", label: "Batches", icon: UsersRound },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/curriculumAdmin", label: "Curriculum", icon: ChartLine },
];

const dropDownItems = [
  { to: "/profile", label: "My Profile", icon: UserRoundCog },
  { to: "/traineeSettings", label: "Settings", icon: Settings },
  { to: "/signout", label: "Sign Out", icon: LogOut },
];
const adminDropDownItems = [
  { to: "/profile", label: "My Profile", icon: UserRoundCog },
  { to: "/adminSettings", label: "Settings", icon: Settings },
  { to: "/signout", label: "Sign Out", icon: LogOut },
];

function App() {
  const sideBarWidth =
    "md:w-40 lg:w-44 xl:w-52 max-w-52 transition-[width] motion-reduce:transition-none";
  const headerHeight = "h-14 max-h-14";
  // TODO: Remove this after auth
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    const nextIsAdmin = !isAdmin;
    setIsAdmin(nextIsAdmin);

    if (nextIsAdmin) {
      navigate("/admindash");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        theme={isDarkMode ? "dark" : "light"}
        toastOptions={{
          style: {
            background: "var(--color-card)",
            color: "var(--color-text-base)",
          },
        }}
        icons={{
          success: <CheckCircle style={{ color: "var(--color-bg-success)" }} />,
          error: <XCircle style={{ color: "var(--color-bg-error)" }} />,
        }}
      />
      <div className="flex flex-col h-screen font-secondary text-text-base overflow-hidden">
        <Header
          className={cn("bg-menucolor", headerHeight)}
          logo={experionLogo}
          logoWidth={sideBarWidth}
        >
          <HeaderBar>
            {/* TODO: Remove this after auth */}
            <div className="flex items-center text-sm">
              <input
                type="checkbox"
                id="admin-toggle"
                checked={isAdmin}
                onChange={handleToggle}
                className="mr-4"
              />
              <label htmlFor="admin-toggle">Admin View</label>
            </div>
            <SearchBar placeholder="Search for batches, projects & trainees" />
            <HeaderItem aria-label="Notifications">
              <Bell className="size-3.5" />
            </HeaderItem>
            <HeaderItem aria-label="Dark Mode" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="size-3.5" />
              ) : (
                <Moon className="size-3.5" />
              )}
            </HeaderItem>
            <ProfileIconWithDropDown>
              <SideBar
                navItems={isAdmin ? adminDropDownItems : dropDownItems}
              />
            </ProfileIconWithDropDown>
          </HeaderBar>
        </Header>

        <div className="flex grow min-h-0">
          {/* TODO: Remove this after auth */}
          <SideBar
            navItems={isAdmin ? adminNavItems : navItems}
            className={cn("bg-menucolor", sideBarWidth)}
          />

          <main className="flex-1 bg-background overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
