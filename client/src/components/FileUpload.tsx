import { useState } from "react";
import { uploadFile } from "../api/upload";

interface FileUploadProps {
  onUploadSuccess?: (newFile: { id: string; filename: string; url: string }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const res = await uploadFile(file);
      setMessage(res.message);

      // ✅ Updated logic for profilePic handling
      if (onUploadSuccess && res.profilePic) {
        onUploadSuccess({
          id: "profilePic", // dummy id since this isn't a separate file record
          filename: file.name,
          url: res.profilePic,//url: `http://localhost:5000${res.profilePic}`,
        });
      }
      setFile(null);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Upload failed.");
    }
  };

  return (
    // 🎨 ENHANCED STYLING: Removed outer max-w-md and centered mx-auto for a compact, integrated look.
    // Increased padding and shadow, and used a light gray background for the container.
    <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm flex flex-col items-center">
      
      {/* 🎨 ENHANCED STYLING: Made the label smaller and less dominant. */}
      <label className="block mb-3 text-sm text-gray-600">Upload a .png or .pdf file:</label>

      {/* 🎨 ENHANCED STYLING: Custom file input appearance for better look and feel. */}
      <div className="flex flex-col items-center w-full">
        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out w-3/4 text-center truncate">
          {file ? file.name : "Choose File N...n"}
          <input
            type="file"
            accept=".png,.pdf"
            onChange={handleFileChange}
            className="hidden" // Hides the default input
          />
        </label>
        
        {/* 🎨 ENHANCED STYLING: The actual Upload button, styled to be a primary action. */}
        <button
          type="submit"
          disabled={!file} // Disabled state for better UX
          className={`mt-4 w-3/4 py-2 rounded-lg font-semibold transition duration-150 ease-in-out 
            ${file 
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
              : "bg-blue-300 text-white cursor-not-allowed"
            }`
          }
        >
          Upload
        </button>
      </div>

      {/* 🎨 ENHANCED STYLING: Message display */}
      {message && <p className={`mt-4 text-sm ${message.includes("failed") ? "text-red-500" : "text-green-600"}`}>{message}</p>}
    </form>
  );
};

export default FileUpload;


