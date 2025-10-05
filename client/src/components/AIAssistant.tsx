import { useState } from "react";
import { summarizeComments, suggestReply } from "../api/ai";

interface AIAssistantProps {
  postId: string;
}

interface SummaryResponse {
  summary: string;
}

interface SuggestionResponse {
  suggestion: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ postId }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: SummaryResponse = await summarizeComments(postId);
      setSummary(res.summary);
      setSuggestion(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch summary.";
      setError(errorMessage);
      setSummary(null);
      console.error("Summary Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestion = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: SuggestionResponse = await suggestReply(postId);
      setSuggestion(res.suggestion);
      setSummary(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch reply suggestion.";
      setError(errorMessage);
      setSuggestion(null);
      console.error("Suggestion Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-2xl shadow-md bg-white/90 backdrop-blur-sm hover:shadow-lg transition duration-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        💡 <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">AI Assistant</span>
      </h2>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={fetchSummary}
          disabled={loading}
          className={`flex-1 min-w-[160px] px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-300 ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
          }`}
        >
          {loading && !summary ? "Summarizing..." : "📝 Summarize Comments"}
        </button>

        <button
          onClick={fetchSuggestion}
          disabled={loading}
          className={`flex-1 min-w-[160px] px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-300 ${
            loading
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200"
          }`}
        >
          {loading && !suggestion ? "Thinking..." : "💬 Suggest Reply"}
        </button>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-gray-500 animate-pulse">Processing your request...</p>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {summary && (
        <div className="mt-6 animate-fadeIn">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2 border-b pb-1">
            🧠 AI Summary
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}

      {suggestion && (
        <div className="mt-6 animate-fadeIn">
          <h3 className="text-lg font-semibold text-emerald-700 mb-2 border-b pb-1">
            💡 AI Suggested Reply
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {suggestion}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;




// import { useState } from "react";
// import { summarizeComments, suggestReply } from "../api/ai";

// interface AIAssistantProps {
//   postId: string;
// }

// // Define the expected response types for clarity
// interface SummaryResponse {
//     summary: string;
// }

// interface SuggestionResponse {
//     suggestion: string;
// }


// const AIAssistant: React.FC<AIAssistantProps> = ({ postId }) => {
//   const [summary, setSummary] = useState<string | null>(null);
//   const [suggestion, setSuggestion] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSummary = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       
//       // 💡 CORRECTION: summarizeComments returns the server data directly ({ summary: '...' })
//       const res: SummaryResponse = await summarizeComments(postId); 
//       setSummary(res.summary); // Access res.summary, not res.data.summary
//       
//       // Clear any previous suggestion when fetching a summary
//       setSuggestion(null); 
//     } catch (err: any) {
//       // Use the server's error message if available, otherwise a generic one
//       const errorMessage = err.response?.data?.message || "Failed to fetch summary.";
//       setError(errorMessage);
//       setSummary(null);
//       console.error("Summary Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuggestion = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       
//       // 💡 CORRECTION: suggestReply returns the server data directly ({ suggestion: '...' })
//       const res: SuggestionResponse = await suggestReply(postId);
//       setSuggestion(res.suggestion); // Access res.suggestion, not res.data.suggestion
//       
//       // Clear any previous summary when fetching a suggestion
//       setSummary(null); 
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Failed to fetch reply suggestion.";
//       setError(errorMessage);
//       setSuggestion(null);
//       console.error("Suggestion Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 border rounded-xl shadow bg-white space-y-4">
//       <h2 className="text-xl font-semibold text-gray-800">💡 AI Assistant</h2>

//       <div className="space-x-2">
//         <button
//           onClick={fetchSummary}
//           disabled={loading}
//           className={`px-4 py-2 text-white rounded transition ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//         >
//           {loading && !summary ? 'Summarizing...' : 'Summarize Comments'}
//         </button>

//         <button
//           onClick={fetchSuggestion}
//           disabled={loading}
//           className={`px-4 py-2 text-white rounded transition ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
//         >
//           {loading && !suggestion ? 'Thinking...' : 'Suggest Reply'}
//         </button>
//       </div>

//       {loading && <p className="text-gray-500">Processing request...</p>}
//       {error && <p className="text-red-500 font-medium">{error}</p>}

//       {summary && (
//         <div>
//           <h3 className="text-lg font-medium mt-4 border-b pb-1 text-blue-600">📝 AI Summary</h3>
//           <p className="text-gray-700 whitespace-pre-wrap mt-2">{summary}</p>
//         </div>
//       )}

//       {suggestion && (
//         <div>
//           <h3 className="text-lg font-medium mt-4 border-b pb-1 text-green-600">💬 AI Suggested Reply</h3>
//           <p className="text-gray-700 whitespace-pre-wrap mt-2">{suggestion}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIAssistant;




// import { useState } from "react";
// import { summarizeComments, suggestReply } from "../api/ai";

// interface AIAssistantProps {
//   postId: string;
// }

// const AIAssistant: React.FC<AIAssistantProps> = ({ postId }) => {
//   const [summary, setSummary] = useState<string | null>(null);
//   const [suggestion, setSuggestion] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSummary = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await summarizeComments(postId);
//       setSummary(res.data.summary);
//     } catch (err: any) {
//       setError("Failed to fetch summary.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuggestion = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await suggestReply(postId);
//       setSuggestion(res.data.suggestion);
//     } catch (err: any) {
//       setError("Failed to fetch reply suggestion.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 border rounded-xl shadow bg-white space-y-4">
//       <h2 className="text-xl font-semibold text-gray-800">💡 AI Assistant</h2>

//       <div className="space-x-2">
//         <button
//           onClick={fetchSummary}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Summarize Comments
//         </button>

//         <button
//           onClick={fetchSuggestion}
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//         >
//           Suggest Reply
//         </button>
//       </div>

//       {loading && <p className="text-gray-500">Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {summary && (
//         <div>
//           <h3 className="text-lg font-medium mt-4">📝 Summary</h3>
//           <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
//         </div>
//       )}

//       {suggestion && (
//         <div>
//           <h3 className="text-lg font-medium mt-4">💬 Suggested Reply</h3>
//           <p className="text-gray-700 whitespace-pre-wrap">{suggestion}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIAssistant;
