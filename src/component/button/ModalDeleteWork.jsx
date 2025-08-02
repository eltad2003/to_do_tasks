import { Info, X } from 'lucide-react'
import React, { useState } from 'react'
import Loading from './Loading'
import LoadingButton from './LoadingButton'

function ModalDeleteWork({ id, isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }

            alert(`Xóa thành công ${id}`)
            window.location.reload()
            onClose()
        } catch (error) {
            console.log('errorAPI: ', error)
        } finally {
            setIsLoading(false)
        }


    }
    
    if (!isOpen) return null
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-70 z-40"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full p-4">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm">
                        <button
                            onClick={onClose}
                            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <X />
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <div className='flex items-center justify-center'>
                                <Info className='w-15 h-15 text-gray-500' />
                            </div>
                            <h3 className="mb-5 text-lg font-normal  ">Bạn có muốn xóa nhiệm vụ {id} này ?</h3>
                            {isLoading ? (
                                <LoadingButton />
                            ) : (
                                <button
                                    onClick={handleDelete}
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    Yes, I'm sure
                                </button>
                            )}
                            <button onClick={onClose} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalDeleteWork