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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-xl bg-white shadow-md">
      <label className="block mb-2 font-semibold">Upload a .png or .pdf file:</label>
      <input
        type="file"
        accept=".png,.pdf"
        onChange={handleFileChange}
        className="block w-full mb-4 border border-gray-300 p-2 rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </form>
  );
};

export default FileUpload;









// import { useState } from "react";
// import { uploadFile } from "../api/upload";

// interface FileUploadProps {
//   onUploadSuccess?: (newFile: { id: string; filename: string; url: string }) => void;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [message, setMessage] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!file) return;

//   try {
//     const res = await uploadFile(file);
//     setMessage(res.message);

//     // ✅ Updated logic for profilePic handling
//     if (onUploadSuccess && res.user?.profilePic) {
//       onUploadSuccess({
//         id: "profilePic", // dummy id since this isn't a separate file record
//         filename: file.name,
//         url: res.user.profilePic,
//       });
//     }
//   } catch (error: any) {
//     setMessage(error.response?.data?.message || "Upload failed.");
//   }
// };


//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-xl bg-white shadow-md">
//       <label className="block mb-2 font-semibold">Upload a .png or .pdf file:</label>
//       <input
//         type="file"
//         accept=".png,.pdf"
//         onChange={handleFileChange}
//         className="block w-full mb-4 border border-gray-300 p-2 rounded"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Upload
//       </button>
//       {message && <p className="mt-4 text-green-600">{message}</p>}
//     </form>
//   );
// };

// export default FileUpload;
