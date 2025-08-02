import { Loader2Icon } from 'lucide-react'
import React from 'react'

function LoadingButton() {
    return (

        <button className='bg-gray-300 font-bold rounded-lg text-sm px-4 py-2.5 text-center text-white'>
            <Loader2Icon className="animate-spin text-gray-500" />
        </button>

    )
}

export default LoadingButton