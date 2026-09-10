'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = { username: username, email: email, password: password }
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL 

    try {
      const res = await fetch(`${backendUrl}/user/signup`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || 'Registration failed. Please try again.')
      }
      
      setEmail('')
      setPassword('')
      setUsername('')
      router.push('/login') 
    } catch (err: any) {
      console.error('Unable to send registration request:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-orange-50 w-full flex justify-center items-center p-4'>
      <div className='bg-orange-400 py-7 px-8 sm:px-10 w-full max-w-lg flex flex-col justify-between rounded-2xl gap-5 shadow-[6px_6px_0px_4px_rgba(0,_0,_0,_0.8)]'>
          <div className='flex flex-col gap-3'>
            <span className='bg-white px-5 py-2 flex items-center gap-3 rounded-4xl border-2 w-max text-sm font-semibold'>
                <Sparkles className="w-5 h-5" />
                <span className='uppercase'>
                  Get Started
                </span>
            </span>
            <h1 className='text-3xl sm:text-4xl font-bold leading-tight'>
              Create your account.
            </h1>
            <p className='text-lg'>
              Set up your account in a minute. Your details stay private and secure.
            </p>
          </div>

          <form className='flex flex-col gap-5 border-b-2 border-black/20 pb-5' onSubmit={handleSubmit}>

            {error && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role="alert">
                    <span className='block sm:inline'>{error}</span>
                </div>
            )}

            {/* Username Input */}
            <div className='flex flex-col gap-3'>
              <label htmlFor="username" className='text-lg font-semibold uppercase tracking-wide'>Username</label>
              <div className='relative w-full'>
                <input 
                  id="username"
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className='bg-white block w-full pl-12 pr-4 text-black border-2 border-black rounded-2xl py-3 outline-none font-semibold focus:ring-2 focus:ring-black/50 transition-all' 
                  placeholder='Choose a username' 
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Email Input */}
            <div className='flex flex-col gap-3'>
              <label htmlFor="email" className='text-lg font-semibold uppercase tracking-wide'>Email</label>
              <div className='relative w-full'>
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='bg-white block w-full pl-12 pr-4 text-black border-2 border-black rounded-2xl py-3 outline-none font-semibold focus:ring-2 focus:ring-black/50 transition-all' 
                  placeholder='you@example.com' 
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className='flex flex-col gap-3'>
              <label htmlFor="password" className='text-lg font-semibold uppercase tracking-wide'>Password</label>
              <div className='relative w-full'>
                <input 
                  id="password"
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)} 
                  className='bg-white block w-full pl-12 pr-4 text-black border-2 border-black rounded-2xl py-3 outline-none font-semibold focus:ring-2 focus:ring-black/50 transition-all' 
                  placeholder='Create a strong password' 
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <button 
              type='submit' 
              disabled={loading}
              className='text-white bg-black p-3 text-lg font-bold tracking-widest rounded-xl mt-2 flex gap-5 items-center justify-center hover:bg-gray-800 hover:-translate-y-1 transform transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0'
            >
              <span>
                {loading ? 'Submitting...' : 'Create Account'}
              </span>
              {!loading && <ArrowRight />}
            </button>
          </form>
          
          <p className='text-center font-semibold tracking-wider text-lg'>
            Already have an account? <Link href={'/login'} className='border-b-2 border-black font-bold hover:text-white transition-colors'>Log In</Link>
          </p>
      </div>
    </div>
  )
}

export default Register