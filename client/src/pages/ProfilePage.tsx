// client/src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import FileUpload from '../components/FileUpload';
import { getUserById, getFollowers, getFollowing, deleteProfilePic } from '../api/users';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
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
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const userRes = await getUserById(id);
        const followersRes = await getFollowers(id);
        const followingRes = await getFollowing(id);

        setUser(userRes.data);
        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
        setUserFiles(userRes.data.files || []);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
        setProfileMessage('Failed to load profile data.');
      }
    };

    fetchData();
  }, [id]);

  const handleNewUpload = (newFile: { id: string; filename: string; url: string }) => {
    setUser((prev) =>
      prev ? { ...prev, profilePic: newFile.url } : prev
    );
    setProfileMessage('Profile picture uploaded successfully!'); // <--- NEW: Success message
  };

  const handleDeleteProfilePic = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture? This action cannot be undone.')) {
      return; // User cancelled
    }
    try {
      await deleteProfilePic(); // Call the API function we just created
      setUser((prev) => (prev ? { ...prev, profilePic: undefined } : prev)); // Remove profilePic from state
      setProfileMessage('Profile picture deleted successfully!'); // Show success message
    } catch (error: any) {
      console.error('Failed to delete profile picture', error);
      setProfileMessage(error.response?.data?.message || 'Failed to delete profile picture.'); // Show error message
    }
  };


  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>

      {user.profilePic ? (
        <img
          // <--- UPDATED: Add a timestamp to the URL to bust browser cache
          src={`http://localhost:5000${user.profilePic}?t=${new Date().getTime()}`}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-400 mb-4"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-6xl font-bold mb-4">
          {user.name ? user.name[0].toUpperCase() : '?'}
        </div>
      )}

      <p className="text-gray-600">{user.email}</p>
      {user.bio && <p className="mt-2">{user.bio}</p>}

      <div className="flex gap-4 mt-4">
        <p><strong>{followers.length}</strong> Followers</p>
        <p><strong>{following.length}</strong> Following</p>
      </div>

      {id !== currentUserId && (
        <div className="mt-4">
          <FollowButton userId={id!} />
        </div>
      )}

      {id === currentUserId && (
        <>
          {profileMessage && <p className={`mt-4 text-center ${profileMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{profileMessage}</p>}

          {user.profilePic && (
            <button
              onClick={handleDeleteProfilePic}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-2"
            >
              Delete Profile Picture
            </button>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Upload New Profile Picture</h3> {/* <--- UPDATED heading */}
            <FileUpload onUploadSuccess={handleNewUpload} /> {/* This now correctly updates profilePic */}
          </div>

          {userFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Your Uploaded Files (Posts/Other):</h4> {/* <--- Clarified heading */}
              <ul className="list-disc list-inside">
                {userFiles.map((file) => (
                  <li key={file.id}>
                    <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}








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
