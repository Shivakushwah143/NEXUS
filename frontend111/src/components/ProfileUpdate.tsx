// import { useAuth } from '../context/AuthContext';
// import { useState } from 'react';

// export default function UpdateProfileForm() {
//   const { user } = useAuth(); // Get current user from your auth context
//   const [formData, setFormData] = useState({
//     username: user?.username || '',
//     avtar: user?.avtar || ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   console.log(user?.userId)
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await fetch(`http://localhost:5000/api/v1/user/update/${user?.userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           avtar: formData.avtar
//         })
//       });


//       const data = await response.json();
//       console.log(data)
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update profile');
//       }

//       setMessage('Profile updated successfully!');
//     } catch (error) {
//       setMessage(error instanceof Error ? error.message : 'Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4">Update Profile</h2>

//       {message && (
//         <div className={`mb-4 p-2 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//             Username
//           </label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="avtar" className="block text-sm font-medium text-gray-700">
//             Avatar URL
//           </label>
//           <input
//             type="text"
//             id="avtar"
//             name="avtar"
//             value={formData.avtar}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//         >
//           {loading ? 'Updating...' : 'Update Profile'}
//         </button>
//       </form>
//     </div>
//   );
// }