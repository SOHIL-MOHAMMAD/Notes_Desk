'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';


const Register = () => {
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {username : username, email: email, password: password }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Login failed. Please check your credentials.')
      }
      
      setEmail('')
      setPassword('')
      router.push('/login') 
    } catch (err) {
      console.error('unable to send login request', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-orange-50 max-w-full flex justify-center items-center'>
      <div className='bg-orange-400 py-7 px-10 w-150 flex flex-col justify-between rounded-2xl gap-5 shadow-[6px_6px_0px_4px_rgba(0,_0,_0,_0.8)]'>
          <div className='flex flex-col gap-3'>
            <span className='bg-white px-5 py-2 flex items-center gap-5 rounded-4xl border-2 w-1/2 text-sm'>
                <Sparkles/>
                <span className='uppercase font-semibold'>
                  Welcome Back
                </span>
            </span>
            <h1 className='text-4xl font-bold'>
              Log in to your account.
            </h1>
            <p className='text-lg'>
              Enter your credentials to access your notes and pick up where you left off.
            </p>
          </div>
          <form action="" className='flex flex-col gap-5 border-b-2 pb-5' onSubmit={handleSubmit}>

              <div className='flex flex-col gap-3'>
              <label htmlFor="" className='text-lg font-semibold uppercase tracking-wide'>Email</label>
              <div className='relative w-full'>
                <input 
                type="text" 
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                required
                className='bg-white block w-full pl-12 text-black border-2 rounded-2xl py-3 outline-none font-semibold' 
                placeholder='John_Doe' 
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className='flex flex-col gap-3'>
              <label htmlFor="" className='text-lg font-semibold uppercase tracking-wide'>Email</label>
              <div className='relative w-full'>
                <input 
                type="email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                className='bg-white block w-full pl-12 text-black border-2 rounded-2xl py-3 outline-none font-semibold' 
                placeholder='you@example.com' 
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <label htmlFor="" className='text-lg font-semibold uppercase tracking-wide'>Password</label>
              <div className='relative w-full'>
                <input 
                type="password"
                value={password}
                required
                onChange={(e)=>setPassword(e.target.value)} 
                className='bg-white block w-full pl-12 text-black border-2 rounded-2xl py-3 outline-none font-semibold' 
                placeholder='Enter your password' 
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <button type='submit' className='text-white bg-black p-3 text-lg font-bold tracking-widest rounded-xl mt-2 flex gap-5 items-center justify-center hover:bg-gray-800 hover:-translate-y-1 transform transition-all duration-300 cursor-pointer'>
              <span>
                {loading ? 'Submitting...' : 'Log In'}
              </span>
              <ArrowRight/>
            </button>
          </form>
          
          <p className='text-center font-semibold tracking-wider text-lg'>
            Have an account <Link href={'/login'} className='border-b-2 border-black font-bold'>Login</Link>
          </p>
      </div>
    </div>
  )
}

export default Register