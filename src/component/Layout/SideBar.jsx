import { CalendarCheck, CalendarX, ChevronRight, CircleGauge, LayoutPanelTop, Menu, MoreVertical, PencilOff, Plus, TimerOff } from 'lucide-react'
import { list } from 'postcss'
import React, { useEffect, useState } from 'react'

function SideBar() {
    const [isShow, setIsShow] = useState(false)
    const [tasks, setTasks] = useState([])

    const fetchWorkLists = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                method: 'GET',
                headers: {
                    'Content-type': 'Application/json'
                }
            })
            if (res.ok) {
                const data = await res.json()
                setTasks(data)
            }

        } catch (error) {
            console.log('Xảy ra lỗi khi tải dữ liệu: ', error)
        }
    }

    const getOverdueTasks = (tasks) => {
        const today = new Date().getTime()
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate)
            due.setHours(24, 0, 0, 0); // tức 0h ngày kế tiếp
            return today >= due.getTime();
        });
    };

    const completedTasks = tasks.filter(task => task.status === 'completed');
    const cancelledTasks = tasks.filter(task => task.status === 'cancelled');
    const overdueTasks = getOverdueTasks(tasks);

    const menuItems = [
        { icon: CircleGauge, label: 'Dashboard' },
        { icon: TimerOff, label: 'Quá hạn', count: overdueTasks.length, color: 'text-gray-500' },
        { icon: CalendarCheck, label: 'Đã hoàn thành', count: completedTasks.length, color: 'text-green-700' },
        { icon: CalendarX, label: 'Đã hủy', count: cancelledTasks.length, color: 'text-red-700' }

    ]

    useEffect(() => {
        fetchWorkLists()
    }, [])
    if (!list) return null
    return (
        <div className={`flex flex-col w-64 min-h-[100dvh] ${isShow ? 'ms-[0px]' : 'ms-[-260px]'} gap-3  duration-100 bg-gray-800 absolute z-50 md:static`} >
            {!isShow && (
                <button className='cursor-pointer hidden md:block md:fixed top-4 left-0 p-1.5 ms-2  rounded-lg' onClick={() => setIsShow(!isShow)}><Menu size={32} /></button>
            )}
            {/* button sidebar mobile */}
            {!isShow && (
                <button className='cursor-pointer md:hidden fixed top-1/2 left-0 rounded-r-lg z-50' onClick={() => setIsShow(!isShow)}><ChevronRight size={32} /></button>
            )}

            <div className='flex justify-between items-center p-3 pb-2 text-white rounded-t-lg w-full'>
                <a className='text-2xl font-bold' href='/'>Menu</a>
                <button className='cursor-pointer p-1.5 rounded-lg' onClick={() => setIsShow(!isShow)}><Menu size={32} /></button>
            </div>


            <div className='flex-1 p-3'>
                <ul className='space-y-3 font-medium'>
                    {menuItems.map((item, index) => (
                        <li key={index} className='flex items-center gap-3 p-2 rounded-lg text-white hover:bg-gray-100 hover:text-gray-900 transition-colors'>
                            <item.icon className={`group-hover:text-gray-700 ${item.color}`} />
                            <span className='flex-1  ms-3 whitespace-nowrap'>{item.label}</span>
                            {item.count && <span className='inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium text-blue-300 bg-blue-900 rounded-full'>{item.count}</span>}
                        </li>
                    ))}
                </ul>
            </div>


            <div className='flex p-3 rounded-lg text-white hover:bg-gray-100 hover:text-gray-900 m-2 group'>
                <img src="https://ui.shadcn.com/avatars/shadcn.jpg" alt="" className='w-11 h-11 rounded-md' />
                <div className="flex justify-between items-center ml-3 w-52">
                    <div className='leading-4'>
                        <h3 className='font-semibold '>Le Hoang Dat</h3>
                        <span className='text-xs text-white/50 group-hover:text-gray-600'>eltad2003@gmail.com</span>
                    </div>
                    <MoreVertical size={20} />

                </div>
            </div>


        </div>
    )
}

export default SideBar
{/* <li>
                <a href="#" className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-900 group">
                    <CircleGauge />
                    <span className="ms-3">Dashboard</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-gray-100 rounded-lg  hover:bg-gray-200 hover:text-gray-900 group">
                    <LayoutPanelTop className='group-hover:text-gray-700 text-gray-50' />
                    <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-300 bg-gray-700 rounded-full ">Pro</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-900 group">
                    <TimerOff className='group-hover:text-gray-700 text-gray-300' />
                    <span className="flex-1 ms-3 whitespace-nowrap">Quá hạn</span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium text-blue-300 bg-blue-900 rounded-full ">{overdueTasks.length}</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-gray-100 rounded-lg  hover:bg-gray-200 hover:text-gray-900 group">
                    <CalendarCheck className='group-hover:text-green-700 text-green-600' />
                    <span className="flex-1 ms-3 whitespace-nowrap">Đã hoàn thành</span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium text-blue-800  bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{completedTasks.length}</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-gray-100 rounded-lg  hover:bg-gray-200 hover:text-gray-900 group">
                    <CalendarX className='group-hover:text-red-700 text-red-600' />
                    <span className="flex-1 ms-3 whitespace-nowrap">Đã hủy</span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{cancelledTasks.length}</span>
                </a>
            </li> */}