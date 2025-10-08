//
import { Outlet, useNavigate } from "react-router";
import SideBar from "./features/ui/sidebar/Sidebar";
import {
  Bell,
  ChartLine,
  ChartNoAxesCombined,
  FolderGit2,
  GitMerge,
  House,
  Moon,
} from "lucide-react";
import Header from "./features/ui/header/Header";
import experionLogo from "./assets/experionlogo.svg";
import HeaderBar from "./features/ui/header/HeaderBar";
import HeaderItem from "./features/ui/header/HeaderItem";
import SearchBar from "./features/ui/header/search/SearchBar";
import { useState } from "react";
import { cn } from "./lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/myproject", label: "My Project", icon: GitMerge },
  { to: "/ilpprojects", label: "ILP Projects", icon: FolderGit2 },
  { to: "/results", label: "Results", icon: ChartNoAxesCombined },
];

const adminNavItems = [
  { to: "/admindash", label: "Home", icon: House, end: true },
  { to: "/batches", label: "Batches", icon: GitMerge },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/documents", label: "Documents", icon: ChartNoAxesCombined },
  { to: "/adminres", label: "Reports", icon: ChartLine },
];

function App() {
  const sideBarWidth = "w-52";
  const headerHeight = "h-14 max-h-14";
  // TODO: Remove this after auth
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
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
      <div className="flex flex-col h-screen font-secondary text-text-base overflow-hidden">
        <Header
          className={cn("bg-sidebar-and-header-background", headerHeight)}
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
            <HeaderItem aria-label="Dark Mode">
              <Moon className="size-3.5" />
            </HeaderItem>
          </HeaderBar>
        </Header>
        <div className="flex grow min-h-0">
          {/* TODO: Remove this after auth */}
          <SideBar
            navItems={isAdmin ? adminNavItems : navItems}
            className={cn("bg-sidebar-and-header-background", sideBarWidth)}
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
