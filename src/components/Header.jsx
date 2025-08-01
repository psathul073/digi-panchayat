import { CircleUser, Info, Landmark } from 'lucide-react'
import { Link } from 'react-router'

const Header = ({aboutClick, contactClick}) => {
    return (
        <header className='fixed w-full top-0 flex flex-row justify-between px-2.5 py-3.5 font-poppins bg-white dark:bg-zinc-800 text-blue-700 dark:text-blue-400'>
            <h1 className='flex gap-2 items-center text-xl max-sm:text-[1.1em] font-medium'><Landmark /> DigiPanchayat</h1>

            <nav className='flex gap-3 max-sm:gap-0'>
                <Link onClick={aboutClick}>
                    <p className='max-sm:hidden hover:border-b border-blue-700 duration-150'>About</p><Info className='sm:hidden hover:text-blue-100' />
                </Link>
                <Link  onClick={contactClick}>
                    <p className='max-sm:hidden hover:border-b border-blue-700 duration-150'>Contact</p> 
                </Link>

            </nav>

        </header>
    )
}

export default Header