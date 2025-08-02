
import { Loader2Icon } from 'lucide-react'
import React from 'react'

function Loading() {
    return (
        <div className='text-center'>
            <button className='inline-flex gap-2 items-center'>
                <Loader2Icon className="animate-spin text-red-500" size={30} />
                Please wait
            </button>

        </div>
    )
}

export default Loading