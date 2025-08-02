import React, { createContext, useEffect, useState } from 'react'

export const WorkContext = createContext()

const WorkProvider = ({ children }) => {
    const [taskCount, setTaskCount] = useState()

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
                setTaskCount(data.length)
            }
        } catch (error) {
            console.error('Error fetching work lists:', error)
        }
    }
    useEffect(() => {
        fetchWorkLists()
    }, [])



    return (
        <WorkContext.Provider value={{ taskCount }}>
            {children}
        </WorkContext.Provider>
    )
}

export default WorkProvider