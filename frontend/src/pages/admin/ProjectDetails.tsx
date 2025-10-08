import { useParams } from "react-router";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  return <>{id}</>;
}
