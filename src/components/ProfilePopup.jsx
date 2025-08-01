import { CircleUserRound, Loader2, MoonStarIcon, SunIcon } from "lucide-react"
import { useTheme } from "../contexts/themeContext";
import { useEffect, useRef, useState } from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";


const ProfilePopup = ({ setShowProfile }) => {

    const [loading, setLoading] = useState(false);
    const { theme, setTheme } = useTheme();
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // Handle theme.
    const themeChange = () => {
        if (theme === 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    };

    // Handle log out.
    const handleSignOut = async () => {
        setLoading(true);

        setTimeout(async () => {
            await signOut(auth);
            setLoading(false);
            navigate('/landing');
        }, 2000)

    };

    // Handle click outside.
    useEffect(() => {

        const handleOutSideClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('pointerdown', handleOutSideClick);
        return () => document.removeEventListener('pointerdown', handleOutSideClick);

    }, []);

    return (
        <div ref={profileRef} className="fixed right-3 top-15 px-4 py-2 rounded-xl z-30 text-[#4b5157] dark:text-zinc-50 bg-white dark:bg-zinc-800 shadow animate-popIn">
            {/* user email */}
            <div className="flex items-center gap-2 py-2 mb-5 border-b border-zinc-400/40">
                <CircleUserRound size={44} strokeWidth={1} />
                <h2 className="font-semibold">{auth.currentUser.email || "abcd@gmail.com"}</h2>

            </div>
            {/* theme */}
            <div className="flex items-center justify-between gap-2 mb-5">
                <p className="font-medium">Theme</p>
                <button onClick={themeChange}>
                    {theme === 'light' ? <p className="flex items-center justify-between gap-0.5 text-blue-800/80 cursor-pointer"> <SunIcon size={16} />Light </p> : <p className="flex items-center gap-0.5 text-blue-500/80 cursor-pointer"> <MoonStarIcon size={16} strokeWidth={2} />Dark </p>}
                </button>
            </div>
            {/* logout */}
            <div className="flex items-center justify-between gap-2 mb-5">
                <p className="font-medium">Account</p>
                <button disabled={loading} onClick={handleSignOut} className="text-red-700 dark:text-red-400 cursor-pointer">{!loading ? 'Logout' : <Loader2 size={16} className='animate-spin' />}</button>
            </div>

        </div>
    )
}

export default ProfilePopup