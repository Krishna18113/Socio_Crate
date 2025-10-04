// client/src/pages/ResumeAnalyzerPage.tsx (NEW)
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { analyzeResume } from '../api/ai'; // Your new API function
// Assuming a layout component wraps your pages
// import MainLayout from '../components/MainLayout'; 
import ResumeReportCard from '../components/ResumeReportCard'; // Component to be created

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
            setFile(null); // Clear invalid file
            return;
        }

        setIsLoading(true);
        setReport(null);

        const formData = new FormData();
        formData.append('rolePreference', rolePreference);
        if (file) {
            formData.append('file', file);
        } else if (portfolioLink) {
            formData.append('portfolioLink', portfolioLink);
        }

        try {
            // 🔑 CHANGE THIS LINE: Do NOT destructure { data }
    const response = await analyzeResume(formData); 
    
    // Check if the response itself is the report object
    const reportData = response as AnalysisResult;

    // 🔑 Log the correct variable to see the actual content
    console.log('AI Resume Analysis Report:', reportData); 
    
    setReport(reportData); // Use the correct variable here
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
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">AI Resume & Portfolio Analyzer</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Job Role</label>
                        <select
                            value={rolePreference}
                            onChange={(e) => setRolePreference(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Resume (PDF only)
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                setFile(e.target.files ? e.target.files[0] : null);
                                setPortfolioLink(''); // Clear link when file is selected
                            }}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {file && <p className="mt-1 text-sm text-gray-500">Selected: {file.name}</p>}
                    </div>

                    <div className="flex items-center">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <div>
                        <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700 mb-1">
                            Paste Portfolio/Website Link
                        </label>
                        <input
                            type="url"
                            id="portfolioLink"
                            value={portfolioLink}
                            onChange={(e) => {
                                setPortfolioLink(e.target.value);
                                setFile(null); // Clear file when link is entered
                            }}
                            placeholder="https://my-portfolio.com"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (!file && !portfolioLink)}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                    >
                        {isLoading ? 'Analyzing...' : 'Get AI Analysis'}
                    </button>
                </form>
            </div>

            {/* Display Report */}
            {report && <ResumeReportCard report={report} />}
        </div>
    );
};

export default ResumeAnalyzerPage;