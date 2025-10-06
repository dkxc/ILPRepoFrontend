import { Lightbulb, Code, Target, TrendingUp } from "lucide-react";
import * as Card from "../../ui/card";
import type { PhaseData } from "../types/Result.types";

interface ResultCardProps {
  data: PhaseData;
}

const FeedbackCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card.Card className="bg-white p-5 border border-gray-200">
      <div className="flex items-start gap-3">
        <div className="text-gray-600 mt-0.5">{icon}</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </Card.Card>
  );
};

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  return (
    <div>
      {/* Feedback Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FeedbackCard
          icon={<Lightbulb size={20} />}
          title="Conceptual Clarity"
          description={data.feedback.conceptualClarity}
        />
        <FeedbackCard
          icon={<Code size={20} />}
          title="Coding Skills"
          description={data.feedback.codingSkills}
        />
        <FeedbackCard
          icon={<Target size={20} />}
          title="Analytical Skills"
          description={data.feedback.analyticalSkills}
        />
        <FeedbackCard
          icon={<TrendingUp size={20} />}
          title="Quality of Work"
          description={data.feedback.qualityOfWork}
        />
      </div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths Card */}
        <Card.Card className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h3 className="text-base font-semibold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">●</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </Card.Card>

        {/* Areas for Improvement Card */}
        <Card.Card className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <h3 className="text-base font-semibold text-gray-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {data.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-yellow-500 mt-0.5">●</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </Card.Card>
      </div>
    </div>
  );
};

export default ResultCard;