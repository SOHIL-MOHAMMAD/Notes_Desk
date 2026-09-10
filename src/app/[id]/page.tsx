
import React from 'react'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react';
interface Params {
  params : Promise<{
    id :string
  }>
}

interface NotesType {
  id : number
  title : string;
  description : string
  backgroundColor : string
  textColor : string
}



const fetchNotes = async(id: string) =>{

  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/note/list/${id}`,{
    })
    return res.json()
  } catch {
    console.error('unable to fetch notes')
  }
}

const Note = async({params} : Params) => {

  const {id} = await params
  const data : NotesType = await fetchNotes(id)
  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Note not found or you are not authorized to view it.</p>
      </div>
    );
  }
  return (
    <div className='min-h-screen w-full flex flex-col gap-10 bg-[#dfd9c2] bg-[linear-gradient(to_right,#0000001a_2px,transparent_2px),linear-gradient(to_bottom,#0000001a_2px,transparent_2px)] bg-[size:32px_32px] px-6 sm:px-12 py-8 font-mono text-black selection:bg-black selection:text-[#00ffff]' >
      <div className='w-full flex border-b-4 pb-10  justify-end'>
        <Link className='font-bold tracking-wider p-3 rounded-2xl flex gap-5 items-center bg-white border-2 shadow-[3px_3px_0px_2px_rgba(0,_0,_0,_1)] uppercase  text-xl' href={'/'}>
        <MoveLeft/>
        <span>
          Back_to_Notes
        </span>
      </Link>
      </div>

      <h1 
      style={{backgroundColor: data.backgroundColor, color : data.textColor}}
      className='w-full  font-bold text-5xl tracking-wider flex items-center uppercase bg-[#f4e8c1] h-30 border-black border-2  p-3 shadow-[3px_3px_0px_2px_rgba(0,_0,_0,_1)]'>
        <span className=''>
          {data.title}
        </span>
      </h1>


      <p
        style={{backgroundColor: data.backgroundColor, color : data.textColor}}
      className='w-full  font-semibold leading-10 text-xl tracking-widest text-justify shadow uppercase border-black bg-[#f4e8c1] shadow-[3px_3px_0px_2px_rgba(0,_0,_0,_1)] border-2  p-4'>
        {data.description}
      </p>

    </div>
  )
}

export default Note
