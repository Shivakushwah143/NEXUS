


// // import { Link, useNavigate } from 'react-router-dom'
// // import { useAuth } from '../context/AuthContext'

// // const Navbar = () => {
// //   const { user, logout } = useAuth()
// //   const navigate = useNavigate()

// //   const handleLogout = () => {
// //     logout()
// //     navigate('/login')
// //   }
// //   console.log(user)
// //   return (

// //     <div className="flex items-center justify-between bg-gray-800 px-6 py-4 shadow-md">
// //       <div className="flex items-center space-x-4">

// //         <img className='h-10 w-10 bg-emerald-100 flex items-center justify-center rounded-full' src="https://plus.unsplash.com/premium_photo-1677687188601-f7b6aff29aa8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8" alt="" />

// //         <h2 className="text-xl font-bold text-white">
// //           {user ? `Welcome , ${user.username}` : "Welcome Guest"}
// //         </h2>
// //       </div>

// //       <div className="flex items-center space-x-6">
// //         {user && (
// //           <div className="relative group">
// //             <img
// //               className='h-10 w-10 bg-emerald-100 flex items-center justify-center rounded-full cursor-pointer'
// //               src={user.avtar}
// //               alt="User Avatar"
// //             />

// //             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible">
// //               {/* Dropdown items */}
// //               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
// //                 <a
// //                   href="/profile"
// //                   className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
// //                 >
// //                   Update Profile
// //                 </a>
// //                 <a
// //                   href="/purchases"
// //                   className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
// //                 >
// //                   My Purchases
// //                 </a>
// //                 <a
// //                   href="/logout"
// //                   className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
// //                 >
// //                   Logout
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {user ? (
// //           <button onClick={() => { logout(); navigate('/signin') }}
// //             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
// //           >
// //             Logout
// //           </button>
// //         ) : (
// //           <Link
// //             to="/signin"
// //             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
// //           >
// //             Login
// //           </Link>
// //         )}
// //       </div>
// //     </div>

// //   )
// // }

// // export default Navbar




// // import { Link, useNavigate } from 'react-router-dom'
// // import { useAuth } from '../context/AuthContext'
// // import { useState } from 'react'

// // const Navbar = () => {
// //   const { user, logout } = useAuth()
// //   const navigate = useNavigate()
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

// //   const handleLogout = () => {
// //     logout()
// //     navigate('/login')
// //   }

// //   const toggleDropdown = () => {
// //     setIsDropdownOpen(!isDropdownOpen)
// //   }

// //   return (
// //     <div className="flex items-center justify-between bg-gray-800 px-6 py-4 shadow-md">
// //       <div className="flex items-center space-x-4">
// //         <img 
// //           className='h-10 w-10 bg-emerald-100 flex items-center justify-center rounded-full' 
// //           src="https://plus.unsplash.com/premium_photo-1677687188601-f7b6aff29aa8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8" 
// //           alt="" 
// //         />

// //         <h2 className="text-xl font-bold text-white">
// //           {user ? `Welcome , ${user.username}` : "Welcome Guest"}
// //         </h2>
// //       </div>

// //       <div className="flex items-center space-x-6">
// //         {user && (
// //           <div className="relative">
// //             <img
// //               className='h-10 w-10 bg-emerald-100 flex items-center justify-center rounded-full cursor-pointer'
// //               src={user.avtar}
// //               alt="User Avatar"
// //               onClick={toggleDropdown}
// //             />

// //             {isDropdownOpen && (
// //               <div 
// //                 className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
// //                 onClick={(e) => e.stopPropagation()}
// //               >
// //                 <Link
// //                   to="/UpdateProfileForm"
// //                   className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
// //                   onClick={() => setIsDropdownOpen(false)}
// //                 >
// //                   Update Profile
// //                 </Link>
// //                 <Link
// //                   to="/MyProducts"
// //                   className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
// //                   onClick={() => setIsDropdownOpen(false)}
// //                 >
// //                   My Purchases
// //                 </Link>
// //                 <button
// //                   onClick={handleLogout}
// //                   className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-orange-500"
// //                 >
// //                   Logout
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {user ? (
// //           <button 
// //             onClick={handleLogout}
// //             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
// //           >
// //             Logout
// //           </button>
// //         ) : (
// //           <Link
// //             to="/signup"
// //             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
// //           >
// //             Sign-Up
// //           </Link>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default Navbar

// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { useState } from 'react'

// const Navbar = () => {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false)

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen)
//   }

//   const toggleAdminDropdown = () => {
//     setIsAdminDropdownOpen(!isAdminDropdownOpen)
//   }

//   return (
//     <div className="flex items-center justify-between bg-gray-800 px-6 py-4 shadow-md">
//       <div className="flex items-center space-x-4">
//         <img 
//           className='h-10 w-10 bg-emerald-100 flex items-center justify-center rounded-full' 
//           src="https://plus.unsplash.com/premium_photo-1677687188601-f7b6aff29aa8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8" 
//           alt="Logo" 
//         />

//         <h2 className="text-xl font-bold text-white">
//           {user ? `Welcome, ${user.username}` : "Welcome Guest"}
//         </h2>
//       </div>

//       <div className="flex items-center space-x-6">
//         {user && (
//           <>
//             {/* Regular user buttons */}
//             <button
//               onClick={() => navigate('/FilterPage')}
//               className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
//             >
//               Products
//             </button>

//             {/* Admin-specific buttons */}
//             {user && (
//               <div className="relative">
//                 <button
//                   onClick={toggleAdminDropdown}
//                   className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
//                 >
//                   Admin Panel
//                 </button>

//                 {isAdminDropdownOpen && (
//                   <div 
//                     className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <Link
//                       to="/dashboard"
//                       className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
//                       onClick={() => setIsAdminDropdownOpen(false)}
//                     >
//                       Dashboard
//                     </Link>
//                     <Link
//                       to="/CreateProduct"
//                       className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
//                       onClick={() => setIsAdminDropdownOpen(false)}
//                     >
//                       Create Product
//                     </Link>
                  
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* User profile dropdown */}
//             <div className="relative">
//               <img
//                 className='h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full cursor-pointer'
//                 src={user.avtar || '/default-avatar.png'}
//                 alt="User Avatar"
//                 onClick={toggleDropdown}
//               />

//               {isDropdownOpen && (
//                 <div 
//                   className="absolute right-0 mt-2 w-48 bg-gray-500 rounded-md shadow-lg py-1 z-50"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <Link
//                     to="/UpdateProfileForm"
//                     className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
//                     onClick={() => setIsDropdownOpen(false)}
//                   >
//                     Update Profile
//                   </Link>
//                   <Link
//                     to="/MyProducts"
//                     className="block px-4 py-2 text-sm text-white hover:bg-orange-500"
//                     onClick={() => setIsDropdownOpen(false)}
//                   >
//                     My Purchases
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-orange-500"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* Auth buttons */}
//         {!user && (
//           <div className="flex space-x-4">
//             <Link
//               to="/signin"
//               className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
//             >
//               user Sign-In
//             </Link>
        
//             <Link
//               to="/AdminSignIn"
//               className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-md transition-colors duration-200"
//             >
//               Admin Login
//             </Link>
//           </div>
//         )}

      
//         {/* {user && (
//           <button 
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
//           >
//             Logout
//           </button>
//         )} */}
//       </div>
//     </div>
//   )
// }

// export default Navbar