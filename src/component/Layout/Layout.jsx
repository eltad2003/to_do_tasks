import React from 'react'
import Navbar from './Navbar'

import MainContent from './MainContent'
import SideBar from './SideBar'

function Layout() {
    return (
        <div className="min-h-[100dvh]">

            {/* Main content with sidebar */}
            <div className="flex w-full h-screen">
                {/* Sidebar */}
                <aside>
                    <SideBar />
                </aside>
                {/* Main content */}
                <main className="flex-1 max-h-[100dvh] min-h-[100dvh] overflow-y-auto">
                    <MainContent />
                </main>
            </div>
        </div>
    )
}

export default Layout