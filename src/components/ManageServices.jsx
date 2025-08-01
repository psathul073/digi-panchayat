import { Loader2, Pencil, Plus, SearchIcon, SquarePen, Trash2 } from "lucide-react"
import { deleteService, fetchAllServices } from "../APIs/admin"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDebounce } from "../Hooks/useDebounce";
import GenericTable from "./GenericTable";

const ManageServices = ({ isOpen, openForm, setServiceId }) => {

    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, searchTerm ? 300 : 0);
    const [disabled, setDisabled] = useState(false);
    const [refreshVersion, setRefreshVersion] = useState(0);
    const observer = useRef();
    const scrollContainerRef = useRef();


    // Fetch all services fun.
    const FetchAllServices = async (cursor = null, searchTerm = debouncedSearchTerm) => {

        if (loading || !hasMore) return;

        setLoading(true);

        const { services: newServices, nextCursor: newCursor } = await fetchAllServices(cursor, searchTerm, 10);

        setServices((prev) => [...prev, ...newServices]);
        setNextCursor(newCursor);
        setHasMore(Boolean(newCursor));
        setLoading(false);

    };

    // set last service node reference.
    const lastServiceRef = useCallback(

        (node) => {

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !loading && nextCursor !== null) {
                        // console.log("Intersecting last row!");
                        FetchAllServices(nextCursor, debouncedSearchTerm);
                    }
                },
                {
                    root: scrollContainerRef.current,
                    threshold: 0.5,
                }
            );

            if (node) observer.current.observe(node);
        },
        [hasMore, loading, nextCursor, debouncedSearchTerm]
    );

    // Delete service.
    const DeleteService = async (id) => {
        setDisabled(true);
        await deleteService(id);
        setDisabled(false);
        // Fore re-trigger useEffect and re fetch data.
        setRefreshVersion(version => version + 1);
        // Reset.
        setServices([]);
        setNextCursor(null);
        setHasMore(true);
    };

    // API call...
    useEffect(() => {
        // Always reset on new search OR first load.
        setServices([]);
        setNextCursor(null);
        setHasMore(true);

        FetchAllServices(null, debouncedSearchTerm);

    }, [debouncedSearchTerm, refreshVersion]);


    return (
        <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3 overflow-hidden font-poppins text-[#4b5157] dark:text-white bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>

            {/* Manage Services Table */}

            <h2 className=" pt-6 text-[1.2em] max-sm:text-[1.1em] font-bold ">Manage Services</h2>

            {/* Search and add services section */}
            <div className=" pt-6 flex justify-between items-center gap-2 mb-5">
                {/* Search box */}
                <div className="w-full sm:w-80 flex items-center justify-between rounded-md py-1 px-2 bg-white dark:bg-zinc-800 shadow">
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-2 py-1 outline-0 " type="text" placeholder="Enter service name" />
                    <button><SearchIcon /></button>
                </div>

                {/* Add service btn */}
                <button onClick={() => { openForm(true); setServiceId(null) }} className="bg-white dark:bg-zinc-800 text-[#4b5157] dark:text-zinc-50 flex items-center justify-center gap-1.5 p-2 rounded shadow hover:bg-zinc-500/10 cursor-pointer"><Plus /> <p className='max-sm:hidden'>Add Service</p></button>
            </div>

            {/* Services table list */}
            <div className=" pt-4 overflow-x-auto scroll-smooth" >

                <div ref={scrollContainerRef} className="max-h-full overflow-y-auto">

                    <GenericTable 
                        columns={["Title", "Description", "Actions"]}
                        rows={services}
                        lastRowRef={lastServiceRef}
                        renderRows={(service, idx, rowRef) => (
                            <tr key={service.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                                <td className="p-3 whitespace-normal ">{service.title}</td>
                                <td className="p-3  whitespace-normal ">{service.description}</td>
                                <td className="p-3 ">
                                    <div className='h-full flex flex-row flex-wrap items-center justify-start max-sm:justify-center gap-6'>
                                        <button onClick={() => { openForm(true); setServiceId(service.id) }} className=" flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-green-100 text-green-700 hover:text-green-800 cursor-pointer "><SquarePen size={16} />Edit</button>
                                        <button onClick={() => DeleteService(service.id)} disabled={disabled} className=" flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-red-100 text-red-700  hover:text-red-800 cursor-pointer"><Trash2 size={16} />Delete </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />

                    {loading && <p className='text-blue-700 w-full flex items-center justify-center gap-1 py-2 text-base '><Loader2 size={18} className='animate-spin' /> Loading...</p>}
                    {!hasMore && <p className="text-red-700 pb-5 text-center py-2">No more services!</p>}
                </div>

            </div>

        </div>
    )
}

export default ManageServices