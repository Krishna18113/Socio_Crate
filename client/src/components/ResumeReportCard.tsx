import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  LightbulbIcon,
} from 'lucide-react';

interface AnalysisResult {
  resumeQualityScore: number;
  jobReadinessScore: number;
  analysisSummary: string;
  keywordsPresent: string[];
  keywordsMissing: string[];
  suggestions: {
    structure: string;
    skills: string;
    achievements: string;
  };
}

interface ReportCardProps {
  report: AnalysisResult;
}

// ✅ Helper for color coding scores
const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

const ResumeReportCard: React.FC<ReportCardProps> = ({ report }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b border-indigo-100 pb-3">
        ✨ AI Resume Analysis Report
      </h2>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between ${getScoreColor(
            report.resumeQualityScore
          )}`}
        >
          <div>
            <p className="text-lg font-semibold">Resume Quality</p>
            <p className="text-sm opacity-80">
              Structure, Grammar, Clarity
            </p>
          </div>
          <span className="text-4xl font-bold mt-2 sm:mt-0">
            {report.resumeQualityScore}%
          </span>
        </div>

        <div
          className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between ${getScoreColor(
            report.jobReadinessScore
          )}`}
        >
          <div>
            <p className="text-lg font-semibold">Job Readiness</p>
            <p className="text-sm opacity-80">Relevance to Target Role</p>
          </div>
          <span className="text-4xl font-bold mt-2 sm:mt-0">
            {report.jobReadinessScore}%
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
        <h3 className="text-xl font-semibold text-indigo-700 flex items-center mb-2">
          <LightbulbIcon className="w-5 h-5 mr-2 text-indigo-600" />
          AI Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {report.analysisSummary}
        </p>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <h3 className="text-xl font-semibold text-green-700 flex items-center mb-3">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
            Keywords Present
          </h3>
          <div className="flex flex-wrap gap-2">
            {report.keywordsPresent.length > 0 ? (
              report.keywordsPresent.slice(0, 10).map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">
                No keywords detected.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-red-700 flex items-center mb-3">
            <XCircleIcon className="w-5 h-5 mr-2 text-red-600" />
            Keywords Missing
          </h3>
          <div className="flex flex-wrap gap-2">
            {report.keywordsMissing.length > 0 ? (
              report.keywordsMissing.slice(0, 10).map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium hover:bg-red-200 transition"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">
                All critical keywords covered 🎯
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-5">
        <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Actionable Suggestions
        </h3>

        {[
          {
            title: 'Structure & Formatting',
            content: report.suggestions.structure,
          },
          {
            title: 'Skills Enhancement',
            content: report.suggestions.skills,
          },
          {
            title: 'Achievements & Metrics',
            content: report.suggestions.achievements,
          },
        ].map((section, index) => (
          <div
            key={index}
            className="p-5 border-l-4 border-yellow-500 bg-yellow-50 rounded-md hover:bg-yellow-100 transition"
          >
            <p className="font-semibold text-yellow-800">
              {section.title}:
            </p>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeReportCard;




// // client/src/components/ResumeReportCard.tsx (NEW)
// import React from 'react';
// import { CheckCircleIcon, XCircleIcon, LightbulbIcon } from 'lucide-react'; // Assuming you use lucide-react or similar

// interface AnalysisResult {
//     resumeQualityScore: number;
//     jobReadinessScore: number;
//     analysisSummary: string;
//     keywordsPresent: string[];
//     keywordsMissing: string[];
//     suggestions: {
//         structure: string;
//         skills: string;
//         achievements: string;
//     };
// }

// interface ReportCardProps {
//     report: AnalysisResult;
// }

// // Helper for color coding scores
// const getScoreColor = (score: number) => {
//     if (score >= 80) return 'text-green-600 bg-green-100';
//     if (score >= 60) return 'text-yellow-600 bg-yellow-100';
//     return 'text-red-600 bg-red-100';
// };

// const ResumeReportCard: React.FC<ReportCardProps> = ({ report }) => {
//     return (
//         <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
//             <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-2">
//                 AI Analysis Report Card
//             </h2>

//             {/* Score Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div className={`p-4 rounded-lg flex items-center justify-between ${getScoreColor(report.resumeQualityScore)}`}>
//                     <div>
//                         <p className="text-lg font-medium">Resume Quality Score</p>
//                         <p className="text-sm">Structure, Grammar, Clarity</p>
//                     </div>
//                     <span className="text-4xl font-bold">{report.resumeQualityScore}%</span>
//                 </div>
//                 <div className={`p-4 rounded-lg flex items-center justify-between ${getScoreColor(report.jobReadinessScore)}`}>
//                     <div>
//                         <p className="text-lg font-medium">Job Readiness Score</p>
//                         <p className="text-sm">Relevance to Target Role</p>
//                     </div>
//                     <span className="text-4xl font-bold">{report.jobReadinessScore}%</span>
//                 </div>
//             </div>

//             {/* Summary */}
//             <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
//                 <h3 className="text-xl font-semibold text-indigo-700 flex items-center mb-2">
//                     <LightbulbIcon className="w-5 h-5 mr-2" /> AI Summary
//                 </h3>
//                 <p className="text-gray-700 leading-relaxed">{report.analysisSummary}</p>
//             </div>

//             {/* Keywords */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div>
//                     <h3 className="text-xl font-semibold text-green-700 flex items-center mb-3">
//                         <CheckCircleIcon className="w-5 h-5 mr-2" /> Keywords Present
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                         {report.keywordsPresent.slice(0, 10).map((keyword, index) => (
//                             <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                                 {keyword}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//                 <div>
//                     <h3 className="text-xl font-semibold text-red-700 flex items-center mb-3">
//                         <XCircleIcon className="w-5 h-5 mr-2" /> Keywords Missing
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                         {report.keywordsMissing.slice(0, 10).map((keyword, index) => (
//                             <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
//                                 {keyword}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Suggestions */}
//             <div className="space-y-6">
//                 <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Actionable Suggestions</h3>
                
//                 <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-md">
//                     <p className="font-semibold text-yellow-800">Structure & Formatting:</p>
//                     <p className="text-gray-700 mt-1">{report.suggestions.structure}</p>
//                 </div>
                
//                 <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-md">
//                     <p className="font-semibold text-yellow-800">Skills Enhancement:</p>
//                     <p className="text-gray-700 mt-1">{report.suggestions.skills}</p>
//                 </div>

//                 <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-md">
//                     <p className="font-semibold text-yellow-800">Achievements & Metrics:</p>
//                     <p className="text-gray-700 mt-1">{report.suggestions.achievements}</p>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default ResumeReportCard;