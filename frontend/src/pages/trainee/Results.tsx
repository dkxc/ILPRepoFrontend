import { useState } from "react";
import { Code, Palette, Server } from "lucide-react";
import type {
  ResultFeedback,
  Phase,
} from "../../features/trainee/types/Result.types";
import ResultCard from "../../features/trainee/results/ResultsCard";
import * as Card from "../../features/ui/card";

const resultData: ResultFeedback = {
  overallScore: 82,
  phases: [
    {
      phaseName: "Tech Fundamentals",
      score: 78,
      feedback: {
        conceptualClarity:
          "Strong understanding of core programming concepts and data structures.",
        codingSkills:
          "Good coding practices, but could improve code optimization techniques.",
        analyticalSkills:
          "Excellent problem-solving approach with logical thinking.",
        qualityOfWork:
          "Code quality is good but attention to edge cases needs improvement.",
      },
      strengths: [
        "Strong algorithmic thinking",
        "Good understanding of time complexity",
        "Clean code structure",
      ],
      improvements: [
        "Practice more edge case handling",
        "Improve code documentation",
        "Learn advanced optimization techniques",
      ],
    },
    {
      phaseName: "Frontend Development",
      score: 81,
      feedback: {
        conceptualClarity:
          "Good understanding of component-based architecture and React hooks.",
        codingSkills:
          "Clean and modular code, needs improvement in accessibility practices.",
        analyticalSkills:
          "Handles UI problems effectively with optimized solutions.",
        qualityOfWork:
          "Neat UI, consistent theming, but code comments can be improved.",
      },
      strengths: [
        "Component reuse",
        "Consistent styling approach",
        "Understanding of responsive layouts",
      ],
      improvements: [
        "Improve accessibility testing",
        "Add more inline documentation",
      ],
    },
    {
      phaseName: "Backend Development",
      score: 74,
      feedback: {
        conceptualClarity:
          "Good understanding of API endpoints and REST principles.",
        codingSkills:
          "Needs improvement in handling edge cases and error management.",
        analyticalSkills:
          "Strong logic, but optimization in database queries required.",
        qualityOfWork: "Stable backend but lacks detailed exception handling.",
      },
      strengths: ["Good API structuring", "Secure authentication handling"],
      improvements: [
        "Improve database query optimization",
        "Handle more failure scenarios",
      ],
    },
  ],
};

function Results() {
  const [activePhase, setActivePhase] = useState<Phase>("Tech Fundamentals");
  const currentPhaseData = resultData.phases.find(
    (phase) => phase.phaseName === activePhase,
  );

  const getPhaseIcon = (phaseName: Phase) => {
    switch (phaseName) {
      case "Tech Fundamentals":
        return <Code size={18} />;
      case "Frontend Development":
        return <Palette size={18} />;
      case "Backend Development":
        return <Server size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Results</h1>

        {/* Overall Score Card */}
        <Card.Card className="bg-white p-4 border border-gray-200 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-gray-700">
              Overall Score
            </span>
            <span className="text-4xl font-bold text-brand-600">
              {resultData.overallScore}%
            </span>
          </div>
        </Card.Card>

        {/* Phase-wise Feedback Section */}
        <Card.Card className="bg-white p-4 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Phase-wise Feedback
          </h2>

          {/* Phase Tabs */}
          <div className="flex flex-wrap justify-between mb-6 bg-bg-results-tabs px-3 py-1.5 rounded-lg">
            {resultData.phases.map((phase) => (
              <button
                key={phase.phaseName}
                onClick={() => setActivePhase(phase.phaseName)}
                className={`flex items-center gap-2 px-16 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  phase.phaseName === activePhase
                    ? "bg-blue-50 text-brand-600"
                    : "text-gray-600 hover:bg-gray-100 "
                }`}
              >
                {getPhaseIcon(phase.phaseName)}
                <span>{phase.phaseName}</span>
              </button>
            ))}
          </div>

          {/* Phase Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-700">Score</span>
              <span className="text-3xl font-bold text-brand-600">
                {currentPhaseData?.score}%
              </span>
            </div>
          </div>

          {/* Results Card */}
          {currentPhaseData && <ResultCard data={currentPhaseData} />}
        </Card.Card>
      </div>
    </div>
  );
}

export default Results;
