import { AlertCircle, ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, Check, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronsUpDown, Circle, Clock, Flag, Funnel, Grip, Menu, PauseCircle, Pencil, Plus, Search, Settings2, Trash, X, XCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import Loading from '../button/Loading'
import { ReactSortable } from "react-sortablejs";
import ModalEditWork from '../button/ModalEditWork'
import ModalAddWork from '../button/ModalAddWork'
import ModalDeleteWork from '../button/ModalDeleteWork'
import FilterMobile from '../button/FilterMobile'
import { WorkContext } from '../WorkProvider';
import { useDebounce } from 'react-use';




function MainContent() {
    const { taskCount } = useContext(WorkContext)

    const [lists, setLists] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [selectedIds, setSelectedIds] = useState([])

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')

    //optimize search
    const [debounceSearchItem, setDebounceSearchItem] = useState('')
    useDebounce(() => setDebounceSearchItem(search), 500, [search])

    const [editModalOpen, setEditModalOpen] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(null)
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [isShow, setIsShow] = useState(false); // sidebar mobile


    const totalPage = Math.ceil(taskCount / limit)

    const [showDropdown, setShowDropdown] = useState({
        view: false,
        status: false,
        priory: false
    }); //dropdown view
    const [view, setView] = useState({
        title: true,
        status: true,
        priory: true,
        description: true
    }) //toggle view

    const [filter, setFilter] = useState({
        priory: {
            low: false,
            medium: false,
            high: false
        },
        status: {
            completed: false,
            progressing: false,
            on_hold: false,
            cancelled: false,
            none: false
        }
    }) //toggle filter

    const [filterStatus, setFilterStatus] = useState()
    const [filterPriory, setFilterPriory] = useState()
    const [sort, setSort] = useState({
        sortBy: '',
        order: 'desc'
    });

    const fetchWorkLists = async (page, limit, query, filterStatus, filterPriory) => {
        let url = `${import.meta.env.VITE_API_URL}/tasks?page=${page}&limit=${limit}`
        if (filterStatus) {
            url += `&status=${filterStatus}`
        }
        if (filterPriory) {
            url += `&priory=${filterPriory}`
        }
        if (query) {
            url += `&search=${encodeURIComponent(query)}` // encodeURIComponent ensure that special characters are handled correctly
        }
        if (sort.sortBy) {
            url += `&sortBy=${sort.sortBy}&order=${sort.order}`
        }
        setIsLoading(true)
        try {
            console.log(url);
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-type': 'Application/json'
                }
            })
            if (!res.ok) {
                setErrorMessage('Không có nhiệm vụ phù hợp')
            }

            const data = await res.json()
            setLists(data || [])


        } catch (error) {
            console.log(error);
            setErrorMessage('Xảy ra lỗi khi tải dữ liệu: ', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectedAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(lists.map(item => item.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectItem = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id])
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleEditClick = (id) => {
        setEditModalOpen(id)
    }
    const handleDeleteClick = (id) => {
        setDeleteModalOpen(id)
    }

    const handleCloseModal = () => {
        setEditModalOpen(null)
        setDeleteModalOpen(null)
    }

    const getPrioryColor = (priory) => {
        switch (priory) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriory = (priory) => {
        switch (priory) {
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return 'Mặc định';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'progressing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'on_hold': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-5 h-5" />;
            case 'progressing': return <Clock className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            case 'on_hold': return <PauseCircle className="w-5 h-5" />;
            case 'none': return <AlertCircle className="w-5 h-5" />;
            default: return <Circle className="w-5 h-5" />;
        }
    };

    const getStatus = (status) => {
        switch (status) {
            case 'completed': return 'Đã hoàn thành';
            case 'progressing': return 'Đang thực hiện';
            case 'cancelled': return 'Đã hủy';
            case 'on_hold': return 'Tạm dừng';
            case 'none': return 'Chưa thực hiện';
            default: return 'Chưa thực hiện';
        }
    }

    const toggleView = (key) => {
        setView(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
        setShowDropdown(false)
    }
    const toggleDropdown = (key) => {
        setShowDropdown(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleSort = (field) => {
        setSort(prev => ({
            sortBy: field,
            order: prev.sortBy === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const DropDownView = () => {
        return (
            <div className="absolute left-0 top-8 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 border border-gray-200">
                <div role="none" className="py-1">
                    <p role="menuitem" href="#" tabindex="-1" className="px-4 py-2  text-sm text-black font-semibold">Chế độ xem</p>
                </div>
                <div role="none" className='py-1 cursor-pointer text-black'>
                    <p
                        id="menu-item-0" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-200"
                        onClick={() => toggleView('title')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {view.title ? <Check /> : ''}
                        </span>Tiêu đề
                    </p>
                    <p
                        id="menu-item-0" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-200"
                        onClick={() => toggleView('description')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {view.description ? <Check /> : ''}
                        </span>Mô tả
                    </p>
                    <p
                        id="menu-item-1" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => toggleView('status')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {view.status ? <Check /> : ''}
                        </span>Trạng thái
                    </p>
                    <p
                        id="menu-item-2" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => toggleView('priory')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {view.priory ? <Check /> : ''}
                        </span>Ưu tiên
                    </p>
                </div>
            </div >
        )
    }

    const DropDownPriory = () => {
        return (
            <div className="absolute left-0 top-8 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 border border-gray-200">
                <div role="none" className='py-1 cursor-pointer text-black'>
                    <p
                        id="menu-item-0" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-200"
                        onClick={() => setFilterPriory('high')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.priory.high ? <Check /> : ''}
                        </span>Cao
                    </p>
                    <p
                        id="menu-item-1" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => setFilterPriory('medium')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.priory.medium ? <Check /> : ''}
                        </span>Trung Bình
                    </p>
                    <p
                        id="menu-item-2" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => setFilterPriory('low')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.priory.low ? <Check /> : ''}
                        </span>Thấp
                    </p>

                </div>
            </div >
        )
    }

    const DropDownStatus = () => {
        return (
            <div className="absolute left-0 top-8 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 border border-gray-200">
                <div role="none" className='py-1 cursor-pointer text-black'>
                    <p
                        id="menu-item-0" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm  hover:bg-gray-200"
                        onClick={() => setFilterStatus('completed')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.status.completed ? <Check /> : ''}
                        </span>Đã hoàn thành
                    </p>
                    <p
                        id="menu-item-1" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => setFilterStatus('progressing')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.status.progressing ? <Check /> : ''}
                        </span>Đang thực hiện
                    </p>
                    <p
                        id="menu-item-2" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => setFilterStatus('on_hold')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.status.on_hold ? <Check /> : ''}
                        </span>Tạm dừng
                    </p>
                    <p
                        id="menu-item-2" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => setFilterStatus('cancelled')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.status.cancelled ? <Check /> : ''}
                        </span>Đã hủy
                    </p>
                    <p
                        id="menu-item-2" role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() => setFilterStatus('none')}
                    >
                        <span className='inline-block w-5 h-5'>
                            {filter.status.none ? <Check /> : ''}
                        </span>Chưa thực hiện
                    </p>
                </div>
            </div >
        )
    }



    const handleResetFilter = () => {
        setFilterPriory('');
        setFilterStatus('');
    };

    const SortButton = ({ field, currentSort, onSort, children }) => {
        return (
            <button
                onClick={() => onSort(field)}
                className="inline-flex items-center text-sm hover:bg-gray-200 rounded-xl py-1 px-2 font-semibold"
            >
                {children}
                {currentSort.sortBy === field ? (
                    <span className="text-xl ">
                        {currentSort.order === 'desc' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                    </span>
                ) : (
                    <ChevronsUpDown size={20} />
                )}
            </button>
        );
    };



    const isOverDue = (dueDate) => {
        const today = new Date().getTime();
        const due = new Date(dueDate);
        due.setHours(24, 0, 0, 0); // tức 0h ngày kế tiếp
        return today >= due.getTime();
    };


    useEffect(() => {
        setErrorMessage(null);
        fetchWorkLists(page, limit, debounceSearchItem, filterStatus, filterPriory)
    }, [limit, page, debounceSearchItem, filterPriory, filterStatus, sort])

    return (
        <>
            <FilterMobile
                show={isShow}
                onClose={() => setIsShow(false)}
                filterStatus={filterStatus}
                filterPriory={filterPriory}
                view={view}
                onFilterStatusChange={setFilterStatus}
                onFilterPrioryChange={setFilterPriory}
                onViewChange={toggleView}
                onResetFilter={handleResetFilter}
            />
            <div className='container mx-auto py-5 px-4'>
                {lists.length > 0 ? (
                    <>
                        {/*nav mobile */}
                        <div className='md:hidden sticky flex top-0 z-40 justify-between gap-2 mb-3 p-2 bg-white border border-gray-200 rounded-t-lg shadow'>
                            <button className='inline-flex items-center cursor-pointer px-3 py-1 bg-gray-100 hover:bg-gray-300 rounded-lg border border-gray-500'
                                onClick={() => setIsShow(!isShow)}>
                                <Funnel size={24} />
                            </button>

                            <button
                                className='inline-flex items-center cursor-pointer px-3 py-1 bg-green-700 hover:bg-green-800 rounded-lg text-white font-bold '
                                onClick={() => setAddModalOpen(true)}
                            >
                                <Plus /> <span className='ml-1 '>Thêm công việc</span>
                            </button>
                        </div>

                        {/* toolbar */}
                        <div className="flex justify-between items-center mb-3 gap-3">
                            <div className='flex items-center gap-2 '>
                                <input
                                    type="checkbox"
                                    id='selectAll'
                                    className='border-gray-700 rounded w-5 h-5'
                                    onChange={handleSelectedAll}
                                    checked={selectedIds.length === lists?.length}
                                />

                                {selectedIds.length > 0 ? (
                                    <div className='text-nowrap'>
                                        {selectedIds.length}/{limit}
                                    </div>
                                ) : (
                                    <label htmlFor="selectAll" className='font-semibold'>Chọn tất cả</label>
                                )}
                                {selectedIds.length > 1 && (
                                    <button className='inline-flex gap-1 items-center hover:border-double text-sm hover:bg-green-200 border-2 border-dotted rounded-full px-1 bg-green-100' onClick={() => setSelectedIds([])}>
                                        <X size={16} />
                                        <span className='md:block hidden'>Bỏ chọn</span>
                                    </button>
                                )}
                            </div>

                            <div className={`flex-row gap-2 ${selectedIds.length > 1 ? 'flex ' : 'hidden'} items-center`}>
                                <select className='border border-gray-300 rounded-lg w-full px-2'>
                                    <option value="">-Chọn hành động-</option>
                                    <option value="deleteAll">Xóa</option>
                                </select>
                                <button className='bg-green-500 hover:bg-green-700 p-1 text-white rounded cursor-pointer'><Check size={16} /></button>
                            </div>
                        </div>


                        {/* filter */}
                        <div className='flex flex-col gap-3 md:flex-row md:items-center py-2 rounded-lg mb-3'>
                            {/* Input search */}
                            <div className='relative'>
                                <input
                                    type="search"
                                    className=' border border-gray-500 w-full rounded-lg py-1 pl-10'
                                    placeholder='Tìm kiếm...'
                                    title='Tìm kiếm theo tiêu đề và mô tả'
                                    value={search}
                                    onChange={handleSearch}
                                />
                                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                    <Search size={20} />
                                </div>
                            </div>


                            {/* filter */}
                            <div className='md:flex hidden flex-wrap gap-2 items-center flex-1  '>

                                {/* filter priory */}
                                <button
                                    title='Lọc theo Ưu tiên'
                                    onClick={() => toggleDropdown('priory')}
                                    className='relative inline-flex items-center gap-1 cursor-pointer px-3 py-1 bg-gray-100 rounded-lg border-2 border-dotted hover:bg-gray-300 text-sm'
                                >
                                    <Flag size={18} /> Ưu tiên
                                    {showDropdown.priory && DropDownPriory()}
                                </button>

                                {/* filter status */}
                                <button
                                    title='Lọc theo trạng thái'
                                    onClick={() => toggleDropdown('status')}
                                    className='relative inline-flex items-center gap-1 cursor-pointer px-3 py-1 bg-gray-200 rounded-lg border-2 border-dotted hover:bg-gray-300 text-sm'
                                >
                                    <Check size={18} /> Trạng thái
                                    {showDropdown.status && DropDownStatus()}
                                </button>

                                {/* Filter applied */}
                                {filterPriory && (
                                    <div className='flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-200 text-sm'>
                                        {getPriory(filterPriory)}
                                        <button
                                            className="ml-1 p-0.5 rounded hover:bg-green-200"
                                            onClick={() => setFilterPriory(null)}
                                            title="Bỏ lọc"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                {filterStatus && (
                                    <div className='flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-200 text-sm'>
                                        {getStatus(filterStatus)}
                                        <button
                                            className="ml-1 p-0.5 rounded hover:bg-green-200"
                                            onClick={() => setFilterStatus(null)}
                                            title="Bỏ lọc"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                {(filterPriory && filterStatus) && (
                                    <div
                                        onClick={handleResetFilter}
                                        className='flex items-center gap-1 px-3 py-1 bg-green-100 rounded-lg border border-gray-300 hover:bg-green-200 text-sm cursor-pointer disabled:cursor-not-allowed'
                                    >
                                        Reset
                                    </div>
                                )}
                            </div>

                            {/* view and button add */}
                            <div className='relative hidden md:flex gap-2 items-center flex-wrap md:flex-nowrap'>
                                <button
                                    onClick={() => toggleDropdown('view')}
                                    className='inline-flex items-center cursor-pointer px-3 py-1 bg-gray-100 hover:bg-gray-300 rounded-lg border border-gray-500'
                                >
                                    <Settings2 /> <span className='ml-1 hidden sm:inline'>Xem</span>
                                </button>
                                {showDropdown.view && DropDownView()}

                                <button
                                    className='inline-flex items-center cursor-pointer px-3 py-1 bg-green-700 hover:bg-green-800 rounded-lg text-white font-bold  transition-colors'
                                    onClick={() => setAddModalOpen(true)}
                                >
                                    <Plus /> <span className='ml-1 hidden md:inline'>Thêm công việc</span>
                                </button>

                            </div>
                        </div>


                        {/* sorting */}
                        <div className="flex items-center gap-4 p-1 rounded-lg mb-4">
                            {/* <span className="text-md font-bold">Sắp xếp theo</span> */}
                            <SortButton field="createdAt" currentSort={sort} onSort={handleSort}>
                                Ngày tạo
                            </SortButton>
                            <SortButton field="dueDate" currentSort={sort} onSort={handleSort}>
                                Hạn chót
                            </SortButton>
                            <SortButton field="priory" currentSort={sort} onSort={handleSort}>
                                Ưu tiên
                            </SortButton>
                            <SortButton field="status" currentSort={sort} onSort={handleSort}>
                                Trạng thái
                            </SortButton>
                        </div>

                        {/* task card */}
                        <ReactSortable list={lists} setList={setLists} animation={300} handle=".handle" >
                            {errorMessage ? (
                                <div className='flex items-center flex-col gap-3 justify-center mb-3'>
                                    <img src="https://todoist.b-cdn.net/assets/images/97af9e3cd96a74b2.png" alt="" />
                                    <p className='font-semibold text-red-600'>{errorMessage}</p>
                                </div>
                            ) : (
                                !isLoading && lists ? lists.map((list) => (
                                    <div
                                        className='border group border-gray-200 rounded-lg shadow p-2 px-4 mb-4 hover:scale-102 hover:bg-orange-50'
                                        key={list.id}
                                    >
                                        <div className='flex flex-col md:flex-row md:items-center gap-4'>
                                            {/* Vùng kéo */}
                                            <div
                                                title='Kéo để sắp xếp'
                                                className="md:absolute top-2 left-1 handle md:hidden md:group-hover:flex items-center pr-2 cursor-grab active:cursor-grabbing">
                                                <Grip />
                                            </div>

                                            <input
                                                type="checkbox"
                                                id={list.id}
                                                checked={selectedIds.includes(list.id)}
                                                onChange={() => handleSelectItem(list.id)}
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                                            />

                                            <div className='flex-1 min-w-0'>
                                                <div className='inline-flex items-center gap-1 mb-2'>
                                                    <span className='shrink-0 rounded-xl border border-gray-300 px-2 text-sm font-medium text-black'>TASK-{list.id}</span>
                                                    <h3
                                                        title='Tiêu đề'
                                                        className={`line-clamp-1 text-2xl capitalize gap-2 font-bold text-gray-900 ${!view.title && 'hidden'}`}>
                                                        {list.title}
                                                    </h3>
                                                </div>
                                                <p className={`line-clamp-2 text-sm mb-2 truncate ${!view.description && 'hidden'}`} title='Mô tả'>{list.description}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Clock className="w-5 h-5" />
                                                    <span>{new Date(list.createdAt).toLocaleDateString('vi-VN')}</span>
                                                    <ArrowRight className='w-5 h-5' />
                                                    <span title={`Hạn chót: ${new Date(list.dueDate).toLocaleDateString('vi-VN')}`} className={`${isOverDue(list.dueDate) ? 'text-red-500' : ''}`}>
                                                        {isOverDue(list.dueDate) ? 'Đã quá hạn' : new Date(list.dueDate).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className='flex flex-col gap-3 md:items-end'>
                                                <div className='flex items-center gap-2'>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPrioryColor(list.priory)} ${!view.priory && 'hidden'}`}>
                                                        <Flag className="w-5 h-5" />
                                                        <span>{getPriory(list.priory)}</span>
                                                    </div>

                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(list.status)} ${!view.status && 'hidden'}`}>
                                                        {getStatusIcon(list.status)}
                                                        <p>{getStatus(list.status)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-x-2">
                                                    <button
                                                        onClick={() => handleEditClick(list.id)}
                                                        className='bg-blue-500 hover:bg-blue-700 text-white p-2 rounded cursor-pointer'

                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        className='bg-red-500 hover:bg-red-700 text-white p-2 rounded cursor-pointer'
                                                        onClick={() => handleDeleteClick(list.id)}
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                )) : (
                                    <div className='flex items-center justify-center h-1/2'>
                                        <Loading />
                                    </div>
                                )
                            )}
                        </ReactSortable>

                        {/* pagination */}
                        <div className='flex items-center justify-between w-full px-3'>

                            <div className='flex items-center'>
                                <button
                                    type='button'
                                    className='text-sm cursor-pointer disabled:cursor-not-allowed'
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                >
                                    <ChevronsLeft />
                                </button>
                                <button
                                    type='button'
                                    className='text-sm cursor-pointer disabled:cursor-not-allowed'
                                    onClick={() => setPage(prev => prev - 1)}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft />
                                </button>
                                <span className='font-semibold px-2'>{page} / {totalPage}</span>
                                <button
                                    className='text-sm cursor-pointer disabled:cursor-not-allowed'
                                    onClick={() => setPage(prev => prev + 1)}
                                    disabled={page >= totalPage}
                                >
                                    <ChevronRight />
                                </button>
                                <button
                                    className='text-sm cursor-pointer disabled:cursor-not-allowed '
                                    onClick={() => setPage(totalPage)}
                                    disabled={page >= totalPage}
                                >
                                    <ChevronsRight />
                                </button>
                            </div>

                            <div className='flex items-center gap-2'>
                                <label className='font-medium '>Hiện </label>
                                <select
                                    className='border border-gray-500 text-sm px-4 py-1 rounded-lg '
                                    onChange={(e) => setLimit(e.target.value)}
                                    value={limit}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>

                    </>
                ) : (
                    <div className='flex items-center flex-col gap-2 justify-center'>
                        <img src="https://todoist.b-cdn.net/assets/images/97af9e3cd96a74b2.png" alt="" />
                        <p className='font-bold'>Chào mừng bạn</p>
                        <p className='text-gray-500'>Hiện bạn chưa có nhiệm vụ nào</p>
                        <button
                            className='inline-flex bg-green-700 hover:bg-green-800 text-white font-bold p-2 rounded-lg cursor-pointer'
                            onClick={() => setAddModalOpen(true)}
                        >
                            <Plus /> Thêm công việc
                        </button>
                    </div>
                )
                }



                {
                    editModalOpen && (
                        <ModalEditWork
                            id={editModalOpen}
                            isOpen={editModalOpen !== null}
                            onClose={handleCloseModal}
                        />
                    )
                }
                {
                    deleteModalOpen && (
                        <ModalDeleteWork
                            id={deleteModalOpen}
                            isOpen={deleteModalOpen !== null}
                            onClose={handleCloseModal}
                        />
                    )
                }
                {/* Modal Add */}
                <ModalAddWork
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                />

            </div >

        </>
    )
}

export default MainContent