// import React from "react"
// import { useAuth } from '../context/AuthContext'

// export default function Signup() {
//     const [username, setUsername] = React.useState("")
//     const [password, setPassword ] = React.useState("")
//     const {signup} = useAuth()

// const handelSignup = async()=>{
//     await signup( username, password)
//     alert("Sign-up successfully")
// }

//   return (
//     <div>
//         <h2>Wellcome to sign In page</h2>

//         <input onChange={ e => setUsername(e.target.value)}  className='border rounded-sm p-1 m-2 'placeholder='shiva' type="text" />
//         <input onChange={ e => setPassword(e.target.value)} className='border rounded-sm p-1 m-2 'placeholder='1234'type="password" />
//         <button  onClick={handelSignup} className='bg-green-500 rounded-md px-2 py-1 font-bold'>Sign-up</button>
//     </div>
//   )
// }



import React, { useState } from 'react';
import User from '../icons/User';
import Password from '../icons/Password';
import Email from '../icons/User';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: signup form, 2: OTP verification
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const otpResponse = await fetch('http://localhost:5000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!otpResponse.ok) {
        throw new Error('Failed to send OTP');
      }

      setStep(2);
      setMessage("OTP sent to your email");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/verify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, otp })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      localStorage.setItem('token', data.token);
      setMessage("Account created successfully!");
      // Redirect to dashboard or home page here
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Verification failed');
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
            alt="Create account"
          />
        </div>

        {/* Form Section */}
        <div className='md:w-1/2 bg-neutral-900 border border-neutral-700 rounded-lg p-8'>
          <div className='mb-8'>
            <h2 className='text-4xl font-bold text-white'>Create Account</h2>
            <p className='text-xl text-neutral-400 mt-2'>Join us today and get started</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes("successfully") ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
            }`}>
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className='space-y-4'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Email />
                </div>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder='Email'
                  className='w-full pl-11 pr-4 py-3 bg-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-600'
                  required
                />
              </div>

              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User />
                </div>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndSignup} className='space-y-4'>
              <p className='text-neutral-400'>Enter the 6-digit OTP sent to {formData.email}</p>
              
              <div className='relative'>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className='w-full px-4 py-3 bg-neutral-800 rounded-lg text-white text-center text-xl tracking-widest placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-600'
                  placeholder='OTP'
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className='mt-6 bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg w-full font-medium text-black transition-colors duration-200 disabled:opacity-50'
              >
                {loading ? "Verifying..." : "Complete Signup"}
              </button>
            </form>
          )}

          <div className="text-center mt-8">
            <p className="text-neutral-400 text-base">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}