import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import LoadingButton from './LoadingButton'

function ModalEditWork({ id, isOpen, onClose }) {
    const [task, setTask] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [editTask, setEditTask] = useState({
        title: '',
        status: '',
        priory: '',
        description: '',
        dueDate: ''
    })



    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditTask(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        // Xử lý submit form ở đây
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(editTask)
            })
            if (!res.ok) throw new Error(`Error: ${res.status}`)
            alert('Cập nhật nhiệm vụ thành công')
            window.location.reload()
            onClose()
        } catch (error) {
            alert('error API: ', error)
        } finally {
            setIsLoading(false)
        }

    }
    useEffect(() => (
        async function fetchTaskId() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setTask(data)
                    setEditTask({
                        title: data?.title,
                        status: data?.status,
                        priory: data?.priory,
                        description: data?.description,
                        dueDate: data?.dueDate
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    ), [id])

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
                <div className="relative w-full max-w-md max-h-full">
                    {/* Modal content */}
                    {task ? (
                        <div className="relative bg-white rounded-lg shadow-lg">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-blue-700 text-white border-gray-200">
                                <h3 className="text-lg font-semibold">
                                    Sửa Nhiệm Vụ {id}
                                </h3>
                                <button
                                    className="text-white bg-transparent hover:text-gray-200 rounded-lg p-1 ml-auto inline-flex items-center"
                                    onClick={onClose}
                                >
                                    <X size={20} />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            {/* Modal body */}
                            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2">
                                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                                            Tiêu đề
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                            placeholder="Nhập tiêu đề nhiệm vụ"
                                            value={editTask.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="status" className=" mb-2 text-sm font-medium text-gray-900 ">Trạng thái</label>
                                        <select
                                            name="status"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                            value={editTask.status}
                                            onChange={handleInputChange}
                                        >
                                            <option defaultValue="">-Trạng thái-</option>
                                            <option value="completed">Hoàn thành</option>
                                            <option value="progressing">Đang thực hiện</option>
                                            <option value="on_hold">Tạm dừng</option>
                                            <option value="none">Chưa thực hiện</option>

                                        </select>
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900">
                                            Độ ưu tiên
                                        </label>
                                        <select

                                            name="priory"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                            value={editTask.priory}
                                            onChange={handleInputChange}
                                        >
                                            <option defaultValue="">-Ưu tiên-</option>
                                            <option value="high" className='bg-red-100 text-red-800 border-red-200'>Cao</option>
                                            <option value="medium" className='bg-yellow-100 text-yellow-800 border-yellow-200'>Trung Bình</option>
                                            <option value="low" className='bg-green-100 text-green-800 border-green-200'>Thấp</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                                            Mô tả nhiệm vụ
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows="4"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                            placeholder="Write something...."
                                            value={editTask.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="dueDate" className=" mb-2 text-sm font-medium text-gray-900 ">Ngày hoàn thành</label>
                                        <input
                                            type="date"
                                            className='bg-gray-100 rounded-lg border border-gray-300 w-full p-2.5 focus:bg-gray-50'
                                            name='dueDate'
                                            value={editTask.dueDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {isLoading ? (
                                        <LoadingButton />
                                    ) : (
                                        <button
                                            type="submit"
                                            className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                                        >
                                            Cập nhật
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="bg-gray-500 hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className='flex justify-center items-center'>
                            <Loading />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalEditWork