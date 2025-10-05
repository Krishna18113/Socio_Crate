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


    if (!user) return <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">Loading profile...</div>;

    // Determine if the current user is viewing their own profile
    const isOwner = user.id === currentUserId; 

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">{user.name}</h2>

                {/* Profile Picture Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-8 border-b pb-6">
                    {user.profilePic ? (
                        <img
                            src={`http://localhost:5000${user.profilePic}?t=${new Date().getTime()}`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg mb-4 md:mb-0"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-6xl font-bold border-4 border-indigo-300 mb-4 md:mb-0">
                            {user.name ? user.name[0].toUpperCase() : '?'}
                        </div>
                    )}
                    
                    <div className="text-center md:text-left">
                        <p className="text-gray-600 text-lg font-medium">{user.email}</p>
                        <div className="flex justify-center md:justify-start gap-6 mt-2">
                            <p className="text-gray-700"><strong>{followers.length}</strong> Followers</p>
                            <p className="text-gray-700"><strong>{following.length}</strong> Following</p>
                        </div>
                        {isOwner && (
                            <div className="mt-4 flex flex-col md:flex-row gap-3 justify-center md:justify-start">
                                {user.profilePic && (
                                    <button
                                        onClick={() => setIsConfirmingDelete(true)} // 🔑 Use custom confirmation
                                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg shadow-md hover:bg-red-700 transition"
                                    >
                                        Delete Picture
                                    </button>
                                )}
                                <div className="w-full md:w-48">
                                    <FileUpload onUploadSuccess={handleNewUpload} />
                                </div>
                            </div>
                        )}
                        {!isOwner && (
                            <div className="mt-4 flex justify-center md:justify-start">
                                <FollowButton userId={id!} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Description/About Me Section */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xl font-bold text-gray-800">About Me (Skills & Achievements)</h4>
                        {isOwner && (
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="text-indigo-600 hover:text-indigo-700 transition text-sm font-medium"
                            >
                                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z"></path></svg>
                                Edit
                            </button>
                        )}
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {user.description || (isOwner ? "Click 'Edit' above to add your professional description, skills, and achievements." : "This user has not added a description yet.")}
                    </p>
                </div>
                
                {profileMessage && (
                    <div className={`p-3 rounded-lg text-center font-medium mb-4 transition-all duration-300 ${
                        profileMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {profileMessage}
                    </div>
                )}

                {/* Confirmation Modal for Profile Pic Deletion */}
                {isConfirmingDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4 animate-fadeIn">
                            <h4 className="text-lg font-bold mb-3">Confirm Deletion</h4>
                            <p className="mb-6 text-gray-700">Are you sure you want to permanently delete your profile picture? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsConfirmingDelete(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteProfilePic}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* User Files Section */}
                {userFiles.length > 0 && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
                        <h4 className="text-xl font-bold mb-4 text-gray-800">Your Uploaded Files</h4>
                        <ul className="list-disc list-inside space-y-2">
                            {userFiles.map((file) => (
                                <li key={file.id} className="text-gray-700">
                                    <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
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
        </div>
    );
}
