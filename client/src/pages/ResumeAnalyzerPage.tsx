// client/src/pages/ResumeAnalyzerPage.tsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { analyzeResume } from '../api/ai';
import ResumeReportCard from '../components/ResumeReportCard';

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

const roles = ['Software Engineer (SDE)', 'Data Analyst', 'Product Manager', 'UX/UI Designer', 'Other'];

const ResumeAnalyzerPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [portfolioLink, setPortfolioLink] = useState('');
    const [rolePreference, setRolePreference] = useState(roles[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<AnalysisResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file && !portfolioLink) {
            toast.error('Please upload a PDF or paste a portfolio link.');
            return;
        }

        if (file && file.type !== 'application/pdf') {
            toast.error('Only PDF files are supported for resume analysis.');
            setFile(null);
            return;
        }

        setIsLoading(true);
        setReport(null);

        const formData = new FormData();
        formData.append('rolePreference', rolePreference);
        if (file) formData.append('file', file);
        else if (portfolioLink) formData.append('portfolioLink', portfolioLink);

        try {
            const response = await analyzeResume(formData);
            const reportData = response as AnalysisResult;
            console.log('AI Resume Analysis Report:', reportData);
            setReport(reportData);
            toast.success('Analysis complete! Check your report.');
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Error processing request.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                        AI Resume & Portfolio Analyzer
                    </span>
                </h1>

                <div className="bg-white/80 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                🎯 Target Job Role
                            </label>
                            <select
                                value={rolePreference}
                                onChange={(e) => setRolePreference(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                📄 Upload Resume (PDF only)
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    setFile(e.target.files ? e.target.files[0] : null);
                                    setPortfolioLink('');
                                }}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                            />
                            {file && (
                                <p className="mt-2 text-sm text-gray-500 italic">
                                    Selected: {file.name}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <hr className="flex-grow border-gray-300" />
                            <span className="text-sm text-gray-500 font-medium">OR</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div>
                            <label htmlFor="portfolioLink" className="block text-sm font-semibold text-gray-700 mb-1">
                                🌐 Paste Portfolio / Website Link
                            </label>
                            <input
                                type="url"
                                id="portfolioLink"
                                value={portfolioLink}
                                onChange={(e) => {
                                    setPortfolioLink(e.target.value);
                                    setFile(null);
                                }}
                                placeholder="https://my-portfolio.com"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || (!file && !portfolioLink)}
                            className={`w-full py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-white transition ${
                                isLoading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200'
                            }`}
                        >
                            {isLoading ? 'Analyzing your Resume...' : '🚀 Get AI Analysis'}
                        </button>
                    </form>
                </div>

                {report && (
                    <div className="mt-10 animate-fadeIn">
                        <ResumeReportCard report={report} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalyzerPage;


