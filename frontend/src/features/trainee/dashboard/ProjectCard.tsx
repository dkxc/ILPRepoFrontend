import * as Card from "../../ui/card";
import Button from "../../ui/Button";

export interface ProjectCardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function ProjectCard({
  className,
  ref,
  ...props
}: ProjectCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Card.Card className={className} ref={ref} {...props}>
      <Card.CardHeader>
        <Card.CardTitle>Test Total</Card.CardTitle>
        <Card.CardDescription>22.22% last year</Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="text-4xl font-bold">123,456</div>
      </Card.CardContent>
      <Card.CardFooter>
        <Button size="sm">View Details</Button>
      </Card.CardFooter>
    </Card.Card>
  );
}

export default ProjectCard;
