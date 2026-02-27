
import { CircleAlert } from 'lucide-react'
import React from 'react'

function Alert({ errorMessage }) {
    return (
        <div class="flex items-center flex-col gap-3 justify-center mb-3" role="alert">
            <img src='failed.png' alt="" />
            <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700  p-4 '>
                <p class="font-bold"><CircleAlert />Cảnh báo</p>
                <p>{errorMessage}</p>
            </div>
        </div>
        // <div className='flex items-center flex-col gap-3 justify-center mb-3'>
        //     <img src="https://todoist.b-cdn.net/assets/images/97af9e3cd96a74b2.png" alt="" />
        //     <p className='font-semibold text-red-600'>{errorMessage}</p>
        // </div>
    )
}

export default Alert