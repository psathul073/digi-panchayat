import { Loader2, SearchIcon, Trash, Trash2, UserPlus } from "lucide-react"
import Register from "./forms/Register"
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../Hooks/useDebounce";
import { deleteUsers, fetchAllUsers } from "../APIs/admin";
import GenericTable from "./GenericTable";


const ManageStaffs = ({ isOpen }) => {

    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, searchTerm ? 300 : 0);
    const [disabled, setDisabled] = useState(false);
    const [refreshVersion, setRefreshVersion] = useState(0);
    const observer = useRef();
    const scrollContainerRef = useRef();

    // Fetch all users.
    const FetchAllUsers = async (cursor = null, searchTerm = debouncedSearchTerm) => {
        if (loading || !hasMore) return;
        setLoading(true);
        const { users: newUsers, nextCursor: newCursor } = await fetchAllUsers(cursor, searchTerm, 10);
        setUsers(prev => [...prev, ...newUsers]);
        setNextCursor(newCursor);
        setHasMore(Boolean(newCursor));
        setLoading(false);
    };

    // Set last users ref and observe...
    const lastUserRef = useCallback((node) => {
        // Disconnect current ref...
        if (observer.current) observer.current.disconnect();

        // Set new observer and intersect.
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading && nextCursor !== null) {
                FetchAllUsers(nextCursor, debouncedSearchTerm);
            }
        }, { root: scrollContainerRef.current, threshold: 1.0 });

        // Observe new node.
        if (node) observer.current.observe(node);

    }, [hasMore, loading, nextCursor, debouncedSearchTerm]);

    // Delete user.
    const DeleteUser = async (id) => {
        setDisabled(true);
        await deleteUsers(id);
        setDisabled(false);
        // Fore re-trigger useEffect and re fetch data.
        setRefreshVersion(version => version + 1);
        // Reset.
        setUsers([]);
        setNextCursor(null);
        setHasMore(true);
    };

    // Users API call...
    useEffect(() => {
        // Always reset on new search OR first load.
        setUsers([]);
        setNextCursor(null);
        setHasMore(true);

        FetchAllUsers(null, debouncedSearchTerm);

    }, [debouncedSearchTerm, refreshVersion]);


    return (
        <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3 overflow-hidden font-poppins text-[#4b5157] dark:text-white bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>

            {/* Manage Staffs Table */}
            {!showRegisterForm &&
                <div className="mb-10">

                    <h2 className="pt-6 text-[1.2em] max-sm:text-[1.1em] font-bold">Manage Staffs</h2>

                    {/* Search and add services section */}
                    <div className=" pt-6 flex justify-between items-center gap-2 mb-5 ">
                        {/* Search box */}
                        <div className="w-full sm:w-80 flex items-center justify-between rounded-md py-1 px-2 bg-white dark:bg-zinc-800 shadow">
                            <input onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-2 py-1 outline-0 " type="text" placeholder="Search..." />
                            <button><SearchIcon /></button>
                        </div>

                        {/* Add Staffs btn */}
                        <button onClick={() => setShowRegisterForm(true)} className="bg-white dark:bg-zinc-800 text-[#4b5157] dark:text-zinc-50 flex items-center justify-center gap-1.5 p-2 rounded shadow hover:bg-zinc-500/10  cursor-pointer"><UserPlus /> <p className='max-sm:hidden'>Add Staff</p></button>
                    </div>

                    {/* Staffs table list */}
                    <div className="pt-4 overflow-x-auto scroll-smooth" >
                        <div ref={scrollContainerRef} className="max-h-full overflow-y-auto" >
     
                            <GenericTable
                            columns={["Id", "Name", "Action"]}
                            rows={users}
                            lastRowRef={lastUserRef}
                            renderRows={(user, idx, rowRef) => (
                                <tr key={user.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                                    <td className="p-3 whitespace-normal ">{user.id}</td>
                                    <td className="p-3  whitespace-normal ">{user.username}</td>
                                    <td className="p-3 ">
                                        <div className='h-full flex flex-row flex-wrap items-center justify-start max-sm:justify-center gap-6'>
                                        
                                            <button onClick={() => DeleteUser(user.id)} disabled={disabled} className=" flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-red-100 text-red-700 hover:text-red-800  cursor-pointer"><Trash2 size={16} />Delete </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            />

                            {loading && <p className='text-blue-700 w-full flex items-center justify-center gap-1 py-2 text-base '><Loader2 size={18} className='animate-spin' /> Loading...</p>}
                            {!hasMore && <p className="text-red-700 pb-5 text-center py-2">No more Users!</p>}

                        </div>

                    </div>

                </div>
            }

            {showRegisterForm && <Register isRole={'staff'} closeForm={setShowRegisterForm} />}

        </div>
    )
}

export default ManageStaffs