import { useStateContext } from '@/context/Statecontext'
import deleteFile from '@/firebase/deleteFile'
import uploadFile from '@/firebase/uploadFile'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

function ImageInput({ values, setValues, name = "image" }) {
    const { setAlert, setLoading } = useStateContext()
    // const [file, setFile] = useState("")
    const fileRef = useRef(null)
    const selectImage = () => {
        fileRef.current.click()
    }
    const imageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return setAlert({ isShow: true, duration: 3000, message: "Select image file to upload.", type: "error" })
        }
        setLoading(true)
        const filePath = crypto.randomUUID() + "-" + file.name
        try {
            const url = await uploadFile(file, filePath)
            setValues(prevState => ({
                ...prevState,
                [name]: url
            }))
            setAlert({ isShow: true, duration: 3000, message: "Image has been upload.", type: "success" })
        } catch (error) {
            setAlert({ isShow: true, duration: 3000, message: error.message, type: "error" })
        }
        setLoading(false)
    }
    const deleteImage = async () => {
        if (!values[name]) {
            setAlert({ isShow: true, duration: 3000, message: "No Image Found", type: "error" })
            return
        }
        setLoading(true)
        try {
            await deleteFile(values[name])
            setValues(prevState => ({
                ...prevState,
                [name]: ""
            }))
            setLoading(false)
            return setAlert({ isShow: true, duration: 3000, message: "Image Deleted successfully.", type: "success" })
        } catch (error) {
            setLoading(false)
            return setAlert({ isShow: true, duration: 3000, message: error.message, type: "error" })
        }
    }
    return (
        <div className='flex py-2 gap-2'>
            <input type="file" name={name} onChange={imageChange} className="sr-only" ref={fileRef} />
            <span className="relative h-12 bg-blue-200 w-16 rounded overflow-hidden">
                {values[name] && <img src={values[name]} alt="Social media Icon" className='w-full h-full object-cover' />}
            </span>
            {!values[name] ? (
                <button type='button' className='bg-blue-400 text-gray-900 rounded px-4 w-full font-semibold hover:bg-blue-300 shadow-slate-900/50 justify-center py-2 items-center transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg flex gap-2 outline-none' onClick={selectImage} >
                    <svg className='h-7 stroke-current' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 12C13.5 15.18 10.93 17.75 7.75 17.75C4.57 17.75 2 15.18 2 12C2 8.82 4.57 6.25 7.75 6.25" stroke="inherit" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10 12C10 8.69 12.69 6 16 6C19.31 6 22 8.69 22 12C22 15.31 19.31 18 16 18" stroke="inherit" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Add Image</button>
            ) : (
                <button type='button' className='bg-red-400 text-gray-900 rounded px-4 w-full font-semibold hover:bg-red-300 shadow-slate-900/50 justify-center py-2 items-center transition-colors disabled:bg-red-400 disabled:cursor-not-allowed shadow-lg flex gap-2 outline-none' onClick={deleteImage}>
                    Delete Image
                    <svg className='h-4 fill-current' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30958 3.54424C7.06741 2.56989 8.23263 2 9.46699 2H20.9997C21.8359 2 22.6103 2.37473 23.1614 2.99465C23.709 3.61073 23.9997 4.42358 23.9997 5.25V18.75C23.9997 19.5764 23.709 20.3893 23.1614 21.0054C22.6103 21.6253 21.8359 22 20.9997 22H9.46699C8.23263 22 7.06741 21.4301 6.30958 20.4558L0.687897 13.2279C0.126171 12.5057 0.126169 11.4943 0.687897 10.7721L6.30958 3.54424ZM10.2498 7.04289C10.6403 6.65237 11.2734 6.65237 11.664 7.04289L14.4924 9.87132L17.3208 7.04289C17.7113 6.65237 18.3445 6.65237 18.735 7.04289L19.4421 7.75C19.8327 8.14052 19.8327 8.77369 19.4421 9.16421L16.6137 11.9926L19.4421 14.8211C19.8327 15.2116 19.8327 15.8448 19.4421 16.2353L18.735 16.9424C18.3445 17.3329 17.7113 17.3329 17.3208 16.9424L14.4924 14.114L11.664 16.9424C11.2734 17.3329 10.6403 17.3329 10.2498 16.9424L9.54265 16.2353C9.15212 15.8448 9.15212 15.2116 9.54265 14.8211L12.3711 11.9926L9.54265 9.16421C9.15212 8.77369 9.15212 8.14052 9.54265 7.75L10.2498 7.04289Z" fill="current" />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default ImageInput