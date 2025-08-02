import { AlertCircle, CheckCircle, Clock, Flag, PauseCircle, Settings2, X, XCircle } from 'lucide-react';


function FilterMobile({
    show,
    onClose,
    filterStatus,
    filterPriory,
    view,
    onFilterStatusChange,
    onFilterPrioryChange,
    onViewChange,
    onResetFilter
}) {
    const priorities = [
        { key: 'high', label: 'Cao', color: 'text-red-600', bg: 'bg-red-50' },
        { key: 'medium', label: 'Trung bình', color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { key: 'low', label: 'Thấp', color: 'text-green-600', bg: 'bg-green-50' }
    ]

    const statuses = [
        { key: 'completed', label: 'Đã hoàn thành', icon: CheckCircle, color: 'text-green-600' },
        { key: 'progressing', label: 'Đang thực hiện', icon: Clock, color: 'text-blue-600' },
        { key: 'on_hold', label: 'Tạm dừng', icon: PauseCircle, color: 'text-orange-600' },
        { key: 'cancelled', label: 'Đã hủy', icon: XCircle, color: 'text-red-600' },
        { key: 'none', label: 'Chưa thực hiện', icon: AlertCircle, color: 'text-gray-600' }
    ]

    const views = [
        { key: 'title', label: 'Tiêu đề' },
        { key: 'description', label: 'Mô tả' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'priory', label: 'Ưu tiên' }
    ]
    return (
        <div className={`flex flex-col w-64 min-h-[100dvh] max-h-[100dvh] ${show ? 'translate-x-0' : '-translate-x-full'} duration-300 bg-gray-50 absolute z-50 md:hidden shadow-xl border-r border-gray-200`}>
            {/* Header */}
            <div className='flex justify-between items-center border-b border-gray-200 bg-gray-800 p-2 text-white'>
                <h2 className='text-xl font-bold'>Bộ lọc & Tùy chọn</h2>
                <button
                    className='p-2 hover:bg-blue-700 rounded-lg transition-colors'
                    onClick={onClose}
                >
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Priority Filter */}
                <div className="p-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Flag size={16} className="text-orange-500" />
                        Lọc theo ưu tiên
                    </h3>
                    <div className="space-y-2">
                        {priorities.map(priority => (
                            <label key={priority.key} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${filterPriory === priority.key ? priority.bg : ''}`}>
                                <input
                                    type="radio"
                                    name="priority"
                                    checked={filterPriory === priority.key}
                                    onChange={() => onFilterPrioryChange(priority.key)}
                                    className="w-4 h-4"
                                />
                                <span className={`text-sm ${filterPriory === priority.key ? priority.color + ' font-medium' : 'text-gray-700'}`}>
                                    {priority.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Status Filter */}
                <div className="p-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <CheckCircle size={16} className="text-blue-500" />
                        Lọc theo trạng thái
                    </h3>
                    <div className="space-y-2">
                        {statuses.map(status => {
                            const IconComponent = status.icon;
                            return (
                                <label key={status.key} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${filterStatus === status.key ? 'bg-blue-50' : ''}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={filterStatus === status.key}
                                        onChange={() => onFilterStatusChange(status.key)}
                                        className="w-4 h-4"
                                    />
                                    <IconComponent size={16} className={status.color} />
                                    <span className={`text-sm ${filterStatus === status.key ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                        {status.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* View Options */}
                <div className="p-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Settings2 size={16} className="text-purple-500" />
                        Tùy chọn hiển thị
                    </h3>
                    <div className="space-y-2">
                        {views.map(viewOption => (
                            <label key={viewOption.key} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={view[viewOption.key]}
                                    onChange={() => onViewChange(viewOption.key)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">{viewOption.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">

                <button
                    onClick={onResetFilter}
                    className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'
                >
                    Reset bộ lọc
                </button>


            </div>
        </div>
    )
}

export default FilterMobile
