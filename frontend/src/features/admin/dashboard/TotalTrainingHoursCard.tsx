import Card from "../../ui/card/Card";
import CardContent from "../../ui/card/CardContent";
import CardHeader from "../../ui/card/CardHeader";

interface Props {
  totalHours: number;
}

export default function TotalTrainingHoursCard({ totalHours }: Props) {
  return (
    <Card className="border bg-white p-6">
      <CardHeader className="mb-4">Total Training Hours</CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-blue-600">{totalHours}</div>
            <div className="text-sm text-muted-foreground">hr/week</div>
          </div>
          <div className="w-48 h-24 bg-gray-100 rounded-md flex items-center justify-center">
            Img
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
