import { Landmark, SidebarOpen, User2, X } from 'lucide-react'
import ProfilePopup from './ProfilePopup';
import { useEffect, useRef, useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen, sidebarItems, setSection }) => {

    const [showProfile, setShowProfile] = useState(false);
    const sidebarRef = useRef(null);


    // Close sidebar when outside click.
    useEffect(() => {
        const handleClickOnOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOnOutside);
        return () => document.removeEventListener('pointerdown', handleClickOnOutside);

    }, []);


    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-800 text-[#4b5157] dark:text-zinc-50 flex justify-between items-center p-2 z-30">
                <button onClick={() => setIsOpen(true)}><SidebarOpen size={40} className='hover:bg-zinc-500/10 p-2 rounded-md cursor-e-resize' /></button>
                <button onClick={() => setShowProfile(!showProfile)}><User2 size={40} className='hover:bg-zinc-500/10 p-2 rounded-md cursor-help' /></button>
            </header>

            {/* Profile popup model */}
            {showProfile && <ProfilePopup setShowProfile={setShowProfile} />}

            {/* Sidebar */}
            <aside ref={sidebarRef} className={` ${isOpen ? 'left-0' : '-left-64'} bg-white dark:bg-zinc-800 text-[#4b5157] dark:text-zinc-50 fixed h-full w-64 top-0 shadow overflow-x-hidden transition-[left] ease-in-out duration-300 z-50`}>

                {/* Sidebar header */}
                <div className='w-full p-3 flex justify-between'>
                    <button>
                        <Landmark size={40} className='hover:bg-zinc-500/10 p-2 rounded-md cursor-grabbing' />
                    </button>

                    <button onClick={() => setIsOpen(false)}>
                        <X size={40} className='hover:bg-zinc-500/10 p-2 rounded-md cursor-e-resize' />
                    </button>
                </div>

                {/* Dynamically add sidebar items */}
                <ul className='p-3 font-poppins font-medium'>
                    {
                        sidebarItems?.map((item) => (
                            <li className='my-5 py-2.5 px-2 flex items-center gap-3 rounded-md hover:bg-zinc-500/10 transition-colors duration-200 cursor-pointer' key={item.id} onClick={() => setSection(item.section)}>{item.icon} <p>{item.title}</p></li>
                        ))
                    }
                </ul>

            </aside>

        </>


    )
}

export default Sidebar