import { X } from 'lucide-react'
import React, { useState } from 'react'
import LoadingButton from './LoadingButton'

function ModalAddWork({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false)
    const [addTask, setAddTask] = useState({
        title: '',
        status: '',
        priory: '',
        description: '',
        dueDate: '',
        createdAt: new Date()
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setAddTask(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addTask)
            })
            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }

            alert(`Thêm thành công nhiệm vụ`)
            setAddTask({
                title: '',
                status: '',
                priory: '',
                description: '',
                dueDate: '',
            })
            window.location.reload()
            onClose()
        } catch (error) {
            console.log('errorAPI: ', error)
        } finally {
            setIsLoading(false)
        }
        console.log(addTask);

    }
    if (!isOpen) return null
    return (
        < >
            {/* Back drop */}
            <div
                className="fixed inset-0 bg-black opacity-70 z-40"
                onClick={onClose}
            />
            {/* <!-- Main modal --> */}
            <div className=" fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full p-4">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    {/* <!-- Modal content --> */}

                    <div className="relative bg-white rounded-lg shadow-sm ">

                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-green-700 text-white  border-gray-200">
                            <h3 className="text-lg font-semibold 0 ">
                                Thêm Nhiệm Vụ
                            </h3>
                            <button className="text-white bg-transparent  hover:text-gray-900 rounded-lg  ms-auto inline-flex " onClick={onClose}>
                                <X />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {/* <!-- Modal body --> */}
                        <form className="p-4 md:p-5" onSubmit={handleAdd}>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="title" className=" mb-2 text-sm font-medium text-gray-900 ">Tiêu đề</label>
                                    <input type="text"
                                        name="title"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                        placeholder="Nhập tiêu đề nhiệm vụ"
                                        required
                                        value={addTask.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="status" className=" mb-2 text-sm font-medium text-gray-900 ">Trạng thái</label>
                                    <select
                                        name="status"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                        value={addTask.status}
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
                                    <label htmlFor="priory" className=" mb-2 text-sm font-medium text-gray-900 ">Độ ưu tiên</label>
                                    <select
                                        value={addTask.priory}
                                        onChange={handleInputChange}
                                        name="priory"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2">
                                        <option defaultValue="">-Ưu tiên-</option>
                                        <option value="high" className='bg-red-100 text-red-800 border-red-200'>Cao</option>
                                        <option value="medium" className='bg-yellow-100 text-yellow-800 border-yellow-200'>Trung Bình</option>
                                        <option value="low" className='bg-green-100 text-green-800 border-green-200'>Thấp</option>

                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="description" className=" mb-2 text-sm font-medium text-gray-900 ">Mô tả nhiệm vụ</label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        className=" p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                        placeholder="Write something...."
                                        value={addTask.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="dueDate" className=" mb-2 text-sm font-medium text-gray-900 ">Ngày hoàn thành</label>
                                    <input
                                        type="date"
                                        className='bg-gray-100 rounded-lg border border-gray-300 w-full p-2.5 focus:bg-gray-50'
                                        name='dueDate'
                                        required
                                        value={addTask.dueDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {isLoading ? (
                                    <LoadingButton />
                                ) : (
                                    <button className=" bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                                    >
                                        Thêm
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="bg-gray-500 hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ModalAddWork