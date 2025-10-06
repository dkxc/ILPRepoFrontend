import ProjectCard from "../../features/trainee/dashboard/ProjectCard";
import type { Project } from "../../features/trainee/types/Project.types";

function Dashboard() {
  const project: Project = {
    id: 21231,
    title: "ILP Repo",
    status: "Live",
    technologies: [".NET", "React"],
    team: {
      number: 4,
      members: [
        "Dhanush Kovi",
        "Nino Jagadish",
        "Raihana Rasaldeen",
        "Merlin Baiju",
        "Nandhu Krishna",
        "Mohammed Aiman",
        "Alex Joseph Pius",
      ],
    },
    progress: 60,
  };

  return (
    <>
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        <ProjectCard project={project} />
      </div>
    </>
  );
}

export default Dashboard;
