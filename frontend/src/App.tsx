import { Outlet } from "react-router";
import SideBar from "./features/ui/sidebar/Sidebar";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/myproject", label: "My Project" },
];

function App() {
  return (
    <>
      <div className="flex h-screen">
        <SideBar navItems={navItems} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
