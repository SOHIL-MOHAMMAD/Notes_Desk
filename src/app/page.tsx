'use client'
import React, { useEffect, useState } from 'react'
import { Plus, X, Search, ChevronDown, SquareX, Pen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface NotesType {
  id: number
  title: string;
  description: string
  backgroundColor: string
  textColor: string
}

interface MyToken {
  id: number
  username: string
}

const Home = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [title, setTitle] = useState<string>('')
  const [backgroundColor, setBackground] = useState<string>('#ff00ff')
  const [textColor, setText] = useState<string>('#000000')
  const [description, setDescription] = useState<string>('')
  const [notes, setNotes] = useState<NotesType[]>([])
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [isDropdown, setIsDropdown] = useState<boolean>(false)
  const [sortOperation, setSortOperation] = useState<string>('new')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }

  const handleLogout = () => {
    deleteCookie('token');
    setUsername('');
    setIsDropdown(false);
    router.push('/login');
  }

  useEffect(() => {
    const time = setTimeout(() => {
      const token = getCookie('token');
      if (token) {
        try {
          const decode = jwtDecode<MyToken>(token)
          setUsername(decode.username)
        } catch {
          console.error('Failed to decode token:');
        }
      }
    }, 0);
    return () => clearTimeout(time)
  }, [])

  const handleOpenAddModal = () => {
    setEditId(null)
    setTitle('')
    setBackground('#ff00ff')
    setText('#000000')
    setDescription('')
    setIsOpen(true)
  }

  const handleOpenEditModal = (note: NotesType) => {
    setEditId(note.id)
    setTitle(note.title)
    setBackground(note.backgroundColor)
    setText(note.textColor)
    setDescription(note.description)
    setIsOpen(true)
  }

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getCookie('token');
    if (!token) return;

    if (editId !== null) {
      await handleUpdate(editId)
      return;
    }

    const formData = new URLSearchParams()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('backgroundColor', backgroundColor || '#ffffff')
    formData.append('textColor', textColor || '#111111')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/note/add`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) throw new Error('Unable to add notes')
      
      const newNote = await res.json()
      if (Array.isArray(newNote)) {
        setNotes(newNote)
      } else {
        setNotes((prev) => [newNote, ...prev])
      }
      
      setTitle('')
      setBackground('#ff00ff')
      setText('#000000')
      setDescription('')
      setIsOpen(false)
    } catch {
      console.error('unable to send data to fastapi')
    }
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = getCookie('token');
        if (!token) return;
        const endpoint = searchQuery 
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/note/search?q=${searchQuery}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/note/list`;
        const res = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        setNotes(data)
      } catch {
        console.error('unable to fetch data')
      }
    }
    const timeoutId = setTimeout(() => {
      fetchNotes()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const sortedNotes = [...notes].sort((a,b)=>{
    switch (sortOperation) { 
      case 'old':
        return a.id - b.id
      case 'new':
        default:
          return b.id - a.id
    }
  })

  const handleUpdate = async (id: number) => {
  try {
    const token = getCookie('token');  
    if (!token) return;
    
    const body = {
      title: title,
      description: description,
      backgroundColor: backgroundColor,
      textColor: textColor
    };
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/note/update/${id}`, {
      method: "PUT",  
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body) 
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error(`FastAPI Error (${res.status}):`, errorData);
      throw new Error(`Failed to update note: Status ${res.status}`);
    }

    const updatedNote = await res.json();

    setNotes((prevNotes) => 
      prevNotes.map((note) => (note.id === id ? updatedNote : note))
    );
    
    setIsOpen(false);
    setEditId(null);
  } catch (err) {
    console.error('Unable to update data', err);
  }
}
  const handleDelete = async (id: number) => {
    try {
      const token = getCookie('token');
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/note/remove/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch {
      console.error('unable to delete')
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 300, damping: 20 } 
    }
  };

  return (
    <div className='min-h-screen w-full bg-[#dfd9c2] bg-[linear-gradient(to_right,#0000001a_2px,transparent_2px),linear-gradient(to_bottom,#0000001a_2px,transparent_2px)] bg-[size:32px_32px] px-6 sm:px-12 py-8 font-mono text-black selection:bg-black selection:text-[#00ffff]'>
     
      <header className='heading flex flex-col md:flex-row items-start md:items-end w-full justify-between border-b-4 border-black pb-10 gap-5'>
        <div className='title flex flex-col gap-5'>
          <h1 className='text-5xl md:text-6xl font-black uppercase tracking-tighter text-black drop-shadow-[4px_4px_0px_#fff]'>
            Notes_Desk
          </h1>
          <p className='text-lg font-bold tracking-wide text-black bg-white px-5 py-3 border-2 border-black w-max shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
            A tidy place for thoughts & scraps.
          </p>
        </div>
        
        <div className='flex gap-5 items-center z-20'>
          {username ? (
            <div className='relative'>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdown(!isDropdown)}
                className='bg-[#ffff00] p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center'
              >
                <span className='truncate max-w-30 font-bold tracking-wider text-lg uppercase'>
                 {username}
                </span>
              </motion.div>
              <AnimatePresence>
                {isDropdown && (
                  <motion.div 
                    key="dropdown-menu" 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute w-full top-full mt-3 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2'
                  >
                    <button 
                      onClick={handleLogout}
                      className='text-white bg-black hover:bg-red-600 transition-colors py-2 font-bold tracking-widest text-sm uppercase cursor-pointer'
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')} 
              className='bg-[#ffff00] p-3 border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
            >
              Login
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
            onClick={handleOpenAddModal}
            className='bg-[#ff00ff] hover:bg-[#ff4dff] transition-colors text-black px-6 py-3 flex items-center gap-3 justify-center text-xl font-black border-2 border-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
          >
            <Plus strokeWidth={4} />
            <span>Add</span>
          </motion.button>
        </div>
      </header>

      <main className='main-content pt-8'>
        <div className='w-full flex flex-col sm:flex-row justify-between gap-5'>
          <div className='relative w-full max-w-lg'>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-black">
              <Search size={24} strokeWidth={3} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              className='bg-white block w-full pl-14 pr-4 text-black border-4 border-black py-3 outline-none font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow placeholder:text-gray-500 uppercase'
              placeholder='SEARCH_NOTES'
            />
          </div>

          <div className='relative'>
            <select
              defaultValue={'new'}
              onChange={(e)=>setSortOperation(e.target.value)}
              className='bg-white w-32 p-3 pl-4 pr-10 border-4 border-black text-black font-bold tracking-wider appearance-none outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer uppercase'
            >
              <option value="new">NEW</option>
              <option value="old">OLD</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black bg-black text-white m-1">
              <ChevronDown size={20} strokeWidth={3} />
            </div>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className='notes my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'
        >
          {sortedNotes.map((n) => (
            <motion.div
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "10px 10px 0px 0px rgba(0,0,0,1)",
            y: -4 
          }}
          key={n.id}
          style={{ backgroundColor: n.backgroundColor, color: n.textColor }}
          className='shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col h-[350px] relative group'
        >
          <div className='flex w-full justify-between items-center border-b-4 border-black pb-3 gap-2'>

            <h2 className='text-3xl font-black uppercase tracking-tight truncate flex-1' title={n.title}>
              {n.title}
            </h2>
    
            <div className='flex gap-4 items-center shrink-0'>
              <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleOpenEditModal(n)}
                className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
                aria-label="Edit Note"
              >
                <Pen size={24} strokeWidth={3} />
              </motion.button>
        
                <motion.button 
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(n.id)}
                  className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
                  aria-label="Delete Note"
                >
                  <SquareX size={24} strokeWidth={3} />
                </motion.button>
              </div>
            </div>

            <div className='pt-4 flex-grow overflow-y-auto'>
              <Link 
                href={`/${n.id}`} 
              
                className="block w-full h-full font-bold text-lg leading-relaxed whitespace-pre-wrap break-words  decoration-2 underline-offset-4"
              >
                <p>
                  {n.description}
                </p>
              </Link>
            </div>
          </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              key="modal-overlay" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 flex justify-center items-center p-5 bg-black/65 backdrop-blur-sm'
            >
              <motion.div 
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className='bg-[#fff8e7] text-black w-full max-w-xl p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
              >
                <div className='flex justify-between items-center border-b-4 border-black pb-4 mb-6'>
                  <h2 className='text-3xl font-black uppercase tracking-tighter bg-black text-[#00ffff] px-3 py-1'>
                    {editId !== null ? 'EDIT_NOTE.EXE' : 'NEW_NOTE.EXE'}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='bg-red-500 hover:bg-red-400 p-2 border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={24} strokeWidth={4} />
                  </motion.button>
                </div>

                <form className='flex flex-col gap-6 font-bold' onSubmit={handleForm}>
                  <div className="flex flex-col gap-2">
                    <label className="uppercase text-sm tracking-widest">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='ENTER TITLE...'
                      className='p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none font-black text-xl focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow uppercase'
                    />
                  </div>

                  <div className='flex flex-col sm:flex-row gap-5'>
                    <div className='flex justify-between items-center w-full p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white'>
                      <span className='font-bold text-sm uppercase'>BG Color</span>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackground(e.target.value)}
                        className='cursor-pointer w-10 h-10 border-2 border-black' 
                      />
                    </div>
                    <div className='flex justify-between items-center w-full p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white'>
                      <span className='font-bold text-sm uppercase'>Text Color</span>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setText(e.target.value)}
                        className='cursor-pointer w-10 h-10 border-2 border-black' 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="uppercase text-sm tracking-widest">Content</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='h-48 border-4 border-black bg-white outline-none p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-medium resize-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                      placeholder='ENTER YOUR NOTES HERE...'
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98, x: 4, y: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                    type="submit"
                    className='bg-[#00ffff] text-black border-4 border-black p-4 text-2xl font-black tracking-widest uppercase hover:bg-[#00cccc] transition-colors mt-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                  >
                    {editId !== null ? 'Update Note' : 'Save Note'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Home;