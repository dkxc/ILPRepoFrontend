import { Outlet } from "react-router";
import SideBar from "./features/ui/sidebar/Sidebar";
import {
  Bell,
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

const navItems = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/myproject", label: "My Project", icon: GitMerge },
  { to: "/ilpprojects", label: "ILP Projects", icon: FolderGit2 },
  { to: "/results", label: "Results", icon: ChartNoAxesCombined },
];

function App() {
  const sideBarWidth = "w-48";
  const headerWidth = "h-16 max-h-16";
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header
          className={`${headerWidth} bg-sidebar-and-header-background`}
          logo={experionLogo}
          logoWidth={sideBarWidth}
        >
          <HeaderBar>
            <SearchBar placeholder="Search for batches, projects & trainees" />
            <HeaderItem aria-label="Notifications">
              <Bell className="size-4" />
            </HeaderItem>
            <HeaderItem aria-label="Dark Mode">
              <Moon className="size-4" />
            </HeaderItem>
          </HeaderBar>
        </Header>
        <div className="flex h-full">
          <SideBar
            navItems={navItems}
            className={`${sideBarWidth} bg-sidebar-and-header-background`}
          />
          <main className="flex-1 bg-background ">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
