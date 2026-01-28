
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';


// const Login = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const { login } = useAuth();

//     const handleLogin = async () => {
//         try {
//             await login(username, password);
//             alert("Login successful!");
//         } catch (err) {
//             setError(err instanceof Error ? err.message : "Login failed");
//             alert(error);
//         }
//     };

//     return (
//         <div className='bg-gray-200 rounded-xl flex flex-col p-20 justify-center items-center border-2'>
//             <h2>Welcome to sign In page</h2>
//             <input 
//                 className='border p-1 m-2 rounded' 
//                 placeholder='Username' 
//                 value={username}
//                 onChange={e => setUsername(e.target.value)} 
//                 type="text" 
//             />
//             <input 
//                 className='border p-1 m-2 rounded' 
//                 placeholder='Password' 
//                 value={password}
//                 onChange={e => setPassword(e.target.value)} 
//                 type="password" 
//             />
//             <button 
//                 className='bg-green-600 font-semibold px-2 py-1 rounded-2xl' 
//                 onClick={handleLogin}
//             >
//                 Sign In
//             </button>
//         </div>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import User from '../icons/User';
import Password from '../icons/Password';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            await login(username, password);
            alert("Login successful!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-700 flex justify-center items-center p-4'>
            <div className='flex flex-col md:flex-row gap-4 max-w-4xl w-full'>
                {/* Image Section */}
                <div className='md:w-1/2 flex justify-center items-center'>
                    <img
                        className='w-full h-auto max-h-[500px] object-cover rounded-lg'
                        src="https://images.unsplash.com/photo-1586907835000-f692bbd4c9e0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2lybHN8ZW58MHx8MHx8fDA%3D"
                        alt="Login"
                    />
                </div>

                {/* Form Section */}
                <div className='md:w-1/2 bg-neutral-900 border border-neutral-700 rounded-lg p-8'>
                    <div className='mb-8'>
                        <h2 className='text-4xl font-bold text-white'>Welcome Back</h2>
                        <p className='text-xl text-neutral-400 mt-2'>Sign in to your account</p>
                    </div>

                    {error && (
                        <div className='mb-4 p-3 rounded-lg bg-red-900 text-red-200'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className='space-y-4'>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <User />
                            </div>
                            <input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                type="text"
                                placeholder='Username'
                                className='w-full pl-11 pr-4 py-3 bg-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-600'
                                required
                            />
                        </div>

                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Password />
                            </div>
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                placeholder='Password'
                                className='w-full pl-11 pr-4 py-3 bg-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-600'
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className='mt-6 bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg w-full font-medium text-black transition-colors duration-200 disabled:opacity-50'
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-neutral-400 text-base">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors duration-200"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;