import ProjectCard from "../../features/trainee/dashboard/ProjectCard";

function Dashboard() {
  return (
    <>
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        <ProjectCard className="col-span-2 bg-sidebar-and-header-background"></ProjectCard>
        <ProjectCard className="bg-sidebar-and-header-background"></ProjectCard>
        <ProjectCard className="bg-sidebar-and-header-background"></ProjectCard>
        <ProjectCard className="bg-sidebar-and-header-background"></ProjectCard>
        <ProjectCard className="bg-sidebar-and-header-background"></ProjectCard>
        <ProjectCard className="bg-sidebar-and-header-background"></ProjectCard>
        <ProjectCard className="bg-sidebar-and-header-background"></ProjectCard>
      </div>
    </>
  );
}

export default Dashboard;
