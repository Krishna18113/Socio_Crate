// client/src/pages/ProfilePage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import FileUpload from '../components/FileUpload';
import EditProfileModal from '../components/EditProfileModal'; // 🔑 Import the new modal
import { getUserById, getFollowers, getFollowing, deleteProfilePic } from '../api/users';

interface User {
    id: string;
    name: string;
    email: string;
    // 🔑 UPDATED: Using 'description' to match the backend Prisma schema
    description?: string | null;  
    profilePic?: string;
    files?: { id: string; filename: string; url: string }[];
}

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [userFiles, setUserFiles] = useState<{ id: string; filename: string; url: string }[]>([]);
    const [profileMessage, setProfileMessage] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Modal
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // State for custom confirmation

    const currentUserId = localStorage.getItem('userId');

    const fetchData = useCallback(async (userId: string) => {
        try {
            // 🔑 Calls the updated API function
            const userRes = await getUserById(userId); 
            const followersRes = await getFollowers(userId);
            const followingRes = await getFollowing(userId);

            // Ensure 'description' is read instead of 'bio'
            setUser(userRes.data); 
            setFollowers(followersRes.data);
            setFollowing(followingRes.data);
            setUserFiles(userRes.data.files || []);
        } catch (err) {
            console.error('Failed to fetch profile data', err);
            setProfileMessage('Failed to load profile data.');
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id, fetchData]);

    const handleNewUpload = (newFile: { id: string; filename: string; url: string }) => {
        setUser((prev) =>
            prev ? { ...prev, profilePic: newFile.url } : prev
        );
        setProfileMessage('Profile picture uploaded successfully!');
    };

    // 🔑 NEW: Function to handle saving description from the modal
    const handleSaveDescription = (newDescription: string | null) => {
        setUser((prev) => 
            prev ? { ...prev, description: newDescription } : prev
        );
        setProfileMessage('Description updated successfully!');
    };


    const handleDeleteProfilePic = async () => {
        setIsConfirmingDelete(false); // Close confirmation modal
        try {
            await deleteProfilePic(); // Call the API function
            setUser((prev) => (prev ? { ...prev, profilePic: undefined } : prev)); // Remove profilePic from state
            setProfileMessage('Profile picture deleted successfully!'); // Show success message
        } catch (error: any) {
            console.error('Failed to delete profile picture', error);
            setProfileMessage(error.response?.data?.message || 'Failed to delete profile picture.'); // Show error message
        }
    };


    if (!user) return <div>Loading profile...</div>;

    // Determine if the current user is viewing their own profile
    const isOwner = user.id === currentUserId; 

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900">{user.name}</h2>

            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6 mb-8 border-b pb-6">
                {user.profilePic ? (
                    <img
                        src={`http://localhost:5000${user.profilePic}?t=${new Date().getTime()}`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-6xl font-bold border-4 border-blue-300">
                        {user.name ? user.name[0].toUpperCase() : '?'}
                    </div>
                )}
                
                <div>
                    <p className="text-gray-600 text-lg font-medium">{user.email}</p>
                    <div className="flex gap-6 mt-2">
                        <p className="text-gray-700"><strong>{followers.length}</strong> Followers</p>
                        <p className="text-gray-700"><strong>{following.length}</strong> Following</p>
                    </div>
                    {isOwner && (
                        <div className="mt-4 flex gap-3">
                            {user.profilePic && (
                                <button
                                    onClick={() => setIsConfirmingDelete(true)} // 🔑 Use custom confirmation
                                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg shadow-md hover:bg-red-700 transition"
                                >
                                    Delete Picture
                                </button>
                            )}
                            <div className="w-48">
                                <FileUpload onUploadSuccess={handleNewUpload} />
                            </div>
                        </div>
                    )}
                     {!isOwner && (
                        <div className="mt-4">
                            <FollowButton userId={id!} />
                        </div>
                    )}
                </div>
            </div>

            {/* Description/About Me Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xl font-bold text-gray-800">About Me (Skills & Achievements)</h4>
                    {isOwner && (
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="text-blue-600 hover:text-blue-700 transition text-sm font-medium"
                        >
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z"></path></svg>
                            Edit
                        </button>
                    )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                    {user.description || (isOwner ? "Click 'Edit' above to add your professional description, skills, and achievements." : "This user has not added a description yet.")}
                </p>
            </div>
            
            {profileMessage && (
                <div className={`p-3 rounded-lg text-center font-medium mb-4 ${
                    profileMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {profileMessage}
                </div>
            )}

            {/* Confirmation Modal for Profile Pic Deletion */}
            {isConfirmingDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4">
                        <h4 className="text-lg font-bold mb-3">Confirm Deletion</h4>
                        <p className="mb-6">Are you sure you want to permanently delete your profile picture? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsConfirmingDelete(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProfilePic}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* User Files Section */}
            {userFiles.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h4 className="text-xl font-bold mb-4 text-gray-800">Your Uploaded Files</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {userFiles.map((file) => (
                            <li key={file.id} className="text-gray-700">
                                <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {file.filename}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* The Edit Modal Component */}
            <EditProfileModal
                initialDescription={user.description}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveDescription}
            />
        </div>
    );
}





// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import FollowButton from '../components/FollowButton';
// import FileUpload from '../components/FileUpload';
// import { getUserById, getFollowers, getFollowing, deleteProfilePic } from '../api/users';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   bio?: string;
//   profilePic?: string;
//   files?: { id: string; filename: string; url: string }[];
// }

// export default function ProfilePage() {
//   const { id } = useParams<{ id: string }>();
//   const [user, setUser] = useState<User | null>(null);
//   const [followers, setFollowers] = useState<User[]>([]);
//   const [following, setFollowing] = useState<User[]>([]);
//   const [userFiles, setUserFiles] = useState<{ id: string; filename: string; url: string }[]>([]);
//   const [profileMessage, setProfileMessage] = useState<string>('');
//   const currentUserId = localStorage.getItem('userId');

//   useEffect(() => {
//     if (!id) return;

//     const fetchData = async () => {
//       try {
//         const userRes = await getUserById(id);
//         const followersRes = await getFollowers(id);
//         const followingRes = await getFollowing(id);

//         setUser(userRes.data);
//         setFollowers(followersRes.data);
//         setFollowing(followingRes.data);
//         setUserFiles(userRes.data.files || []);
//       } catch (err) {
//         console.error('Failed to fetch profile data', err);
//         setProfileMessage('Failed to load profile data.');
//       }
//     };

//     fetchData();
//   }, [id]);

//   const handleNewUpload = (newFile: { id: string; filename: string; url: string }) => {
//     setUser((prev) =>
//       prev ? { ...prev, profilePic: newFile.url } : prev
//     );
//     setProfileMessage('Profile picture uploaded successfully!'); // <--- NEW: Success message
//   };

//   const handleDeleteProfilePic = async () => {
//     if (!window.confirm('Are you sure you want to delete your profile picture? This action cannot be undone.')) {
//       return; // User cancelled
//     }
//     try {
//       await deleteProfilePic(); // Call the API function we just created
//       setUser((prev) => (prev ? { ...prev, profilePic: undefined } : prev)); // Remove profilePic from state
//       setProfileMessage('Profile picture deleted successfully!'); // Show success message
//     } catch (error: any) {
//       console.error('Failed to delete profile picture', error);
//       setProfileMessage(error.response?.data?.message || 'Failed to delete profile picture.'); // Show error message
//     }
//   };


//   if (!user) return <div>Loading profile...</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-2">{user.name}</h2>

//       {user.profilePic ? (
//         <img
//           // <--- UPDATED: Add a timestamp to the URL to bust browser cache
//           src={`http://localhost:5000${user.profilePic}?t=${new Date().getTime()}`}
//           alt="Profile"
//           className="w-32 h-32 rounded-full object-cover border-2 border-gray-400 mb-4"
//         />
//       ) : (
//         <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-6xl font-bold mb-4">
//           {user.name ? user.name[0].toUpperCase() : '?'}
//         </div>
//       )}

//       <p className="text-gray-600">{user.email}</p>
//       {user.bio && <p className="mt-2">{user.bio}</p>}

//       <div className="flex gap-4 mt-4">
//         <p><strong>{followers.length}</strong> Followers</p>
//         <p><strong>{following.length}</strong> Following</p>
//       </div>

//       {id !== currentUserId && (
//         <div className="mt-4">
//           <FollowButton userId={id!} />
//         </div>
//       )}

//       {id === currentUserId && (
//         <>
//           {profileMessage && <p className={`mt-4 text-center ${profileMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{profileMessage}</p>}

//           {user.profilePic && (
//             <button
//               onClick={handleDeleteProfilePic}
//               className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-2"
//             >
//               Delete Profile Picture
//             </button>
//           )}

//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-4">Upload New Profile Picture</h3> {/* <--- UPDATED heading */}
//             <FileUpload onUploadSuccess={handleNewUpload} /> {/* This now correctly updates profilePic */}
//           </div>

//           {userFiles.length > 0 && (
//             <div className="mt-6">
//               <h4 className="font-semibold mb-2">Your Uploaded Files (Posts/Other):</h4> {/* <--- Clarified heading */}
//               <ul className="list-disc list-inside">
//                 {userFiles.map((file) => (
//                   <li key={file.id}>
//                     <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                       {file.filename}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }








// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import FollowButton from '../components/FollowButton';
// import FileUpload from '../components/FileUpload';
// import { getUserById, getFollowers, getFollowing } from '../api/users';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   bio?: string;
//   profilePic?: string; // <-- ADD THIS
//   files?: { id: string; filename: string; url: string }[];
// }

// export default function ProfilePage() {
//   const { id } = useParams<{ id: string }>();
//   const [user, setUser] = useState<User | null>(null);
//   const [followers, setFollowers] = useState<User[]>([]);
//   const [following, setFollowing] = useState<User[]>([]);
//   const [userFiles, setUserFiles] = useState<{ id: string; filename: string; url: string }[]>([]); // <-- new state for files
//   const currentUserId = localStorage.getItem('userId');

//   useEffect(() => {
//     if (!id) return;

//     const fetchData = async () => {
//       try {
//         const userRes = await getUserById(id);
//         const followersRes = await getFollowers(id);
//         const followingRes = await getFollowing(id);

//         setUser(userRes.data);
//         setFollowers(followersRes.data);
//         setFollowing(followingRes.data);

//         // Initialize files state when user data arrives
//         setUserFiles(userRes.data.files || []);
//       } catch (err) {
//         console.error('Failed to fetch profile data', err);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Callback to add new file when uploaded
//   const handleNewUpload = (newFile: { id: string; filename: string; url: string }) => {
//   // Check if it's a profile pic (you can optionally check newFile.id === "profilePic")
//   setUser((prev) =>
//     prev ? { ...prev, profilePic: newFile.url } : prev
//   );
//   setUserFiles((prevFiles) => [...prevFiles, newFile]);
// };

//   if (!user) return <div>Loading profile...</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
//       {user.profilePic && (
//         <img
//           src={`http://localhost:5000${user.profilePic}`}
//           alt="Profile"
//           className="w-32 h-32 rounded-full object-cover border-2 border-gray-400 mb-4"
//         />
//       )}
//       <p className="text-gray-600">{user.email}</p>
//       {user.bio && <p className="mt-2">{user.bio}</p>}

//       <div className="flex gap-4 mt-4">
//         <p><strong>{followers.length}</strong> Followers</p>
//         <p><strong>{following.length}</strong> Following</p>
//       </div>

//       {id !== currentUserId && (
//         <div className="mt-4">
//           <FollowButton userId={id!} />
//         </div>
//       )}

//       {id === currentUserId && (
//         <>
//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-4">Upload Files</h3>
//             {/* Pass the callback here */}
//             <FileUpload onUploadSuccess={handleNewUpload} />
//           </div>

//           {userFiles.length > 0 && (
//             <div className="mt-6">
//               <h4 className="font-semibold mb-2">Your Uploaded Files:</h4>
//               <ul className="list-disc list-inside">
//                 {userFiles.map((file) => (
//                   <li key={file.id}>
//                     <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                       {file.filename}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }











// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import FollowButton from '../components/FollowButton';
// import { getUserById, getFollowers, getFollowing } from '../api/users';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   bio?: string;
// }

// export default function ProfilePage() {
//   const { id } = useParams<{ id: string }>();
//   const [user, setUser] = useState<User | null>(null);
//   const [followers, setFollowers] = useState<User[]>([]);
//   const [following, setFollowing] = useState<User[]>([]);
//   const currentUserId = localStorage.getItem('userId');

//   useEffect(() => {
//     // console.log('ahfsoh :',currentUserId);
//     if (!id) return;

//     const fetchData = async () => {
//       try {
//         const userRes = await getUserById(id);
//         const followersRes = await getFollowers(id);
//         const followingRes = await getFollowing(id);

//         setUser(userRes.data);
//         setFollowers(followersRes.data);
//         setFollowing(followingRes.data);
//       } catch (err) {
//         console.error('Failed to fetch profile data', err);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!user) return <div>Loading profile...</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
//       <p className="text-gray-600">{user.email}</p>
//       {user.bio && <p className="mt-2">{user.bio}</p>}

//       <div className="flex gap-4 mt-4">
//         <p><strong>{followers.length}</strong> Followers</p>
//         <p><strong>{following.length}</strong> Following</p>
//       </div>

//       {id !== currentUserId && (
//         <div className="mt-4">
//           <FollowButton userId={id!} />
//         </div>
//       )}
//     </div>
//   );
// }
