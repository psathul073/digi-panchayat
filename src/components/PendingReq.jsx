import { Inspect, ListFilter, Loader2, Search } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../Hooks/useDebounce";
import { fetchUsersPendingReq } from "../APIs/staff";
import GenericTable from "./GenericTable";

const PendingReq = ({ isOpen, setShowUserRequestViewer, setUserReqId }) => {

    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pendingReqs, setPendingReqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [didInitialLoad, setDidInitialLoad] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, searchTerm ? 300 : 0);
    const observer = useRef();
    const scrollContainerRef = useRef();

    const FetchUsersPendingReq = async (cursor = null, searchTerm = debouncedSearchTerm, sortingOrder = sortOrder) => {

        if (loading || !hasMore) return;

        setLoading(true);
        const { pendingReq: newPendingReq, nextCursor: newCursor } = await fetchUsersPendingReq(20, searchTerm, sortingOrder, cursor);

        setPendingReqs(prev => [...prev, ...newPendingReq]);
        setNextCursor(newCursor);
        setHasMore(Boolean(newCursor));
        setLoading(false);
        setDidInitialLoad(true);
    };

    // set last pending requests node reference.
    const lastPendingReqRef = useCallback(

        (node) => {

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !loading && nextCursor !== null) {
                        // console.log("Intersecting last row!");
                        FetchUsersPendingReq(nextCursor, debouncedSearchTerm, sortOrder);
                    }
                },
                {
                    root: scrollContainerRef.current,
                    threshold: 0.1,
                }
            );

            if (node) observer.current.observe(node);
        },
        [hasMore, loading, nextCursor, debouncedSearchTerm, sortOrder]
    );

    // Call API on load.
    useEffect(() => {
        // Always reset on new search OR first load.
        setPendingReqs([]);
        setNextCursor(null);
        setHasMore(true);

        const timerId = setTimeout(() => {
            FetchUsersPendingReq(null, debouncedSearchTerm, sortOrder)
        }, 0);

        return () => clearTimeout(timerId);

    }, [sortOrder, debouncedSearchTerm]);

    // Scroll fallback ONLY if initial load is done.
    useEffect(() => {

        const container = scrollContainerRef.current;

        if (!container) return;

        const checkNoScroll = () => {
            if (
                didInitialLoad &&
                container.scrollHeight <= container.clientHeight &&
                hasMore && !loading
            ) {
                FetchUsersPendingReq(nextCursor, debouncedSearchTerm, sortOrder);
            }
        };

        checkNoScroll();
    }, [pendingReqs, hasMore, loading, nextCursor, debouncedSearchTerm, sortOrder, didInitialLoad]);



    return (
        <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3 overflow-hidden font-poppins text-[#4b5157] dark:text-white bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>

            <h2 className="pt-6 text-[1.2em] max-sm:text-[1.1em] font-bold ">Pending Requests</h2>

            {/* Search / filter box */}
            <div className="pt-6 flex justify-between items-center gap-2 mb-5">
               
                {/* Search */}
                <div className="w-full sm:w-80 flex items-center justify-between rounded-md py-1 px-2 bg-white dark:bg-zinc-800 shadow">
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-2 py-1 outline-0 " type="text" placeholder="Enter citizen name" />
                    <Search className=" cursor-pointer" />
                </div>

                {/* Filter */}
                <button onClick={() => { setSortOrder(prev => prev === "desc" ? "asc" : "desc") }} className="bg-white dark:bg-zinc-800 text-[#4b5157] dark:text-zinc-50 flex items-center justify-center gap-1.5 p-2 rounded-md shadow hover:bg-zinc-500/10 cursor-pointer">
                    <ListFilter />
                </button>

            </div>

            {/* Pending Requests Table */}
            <div className="pt-4 overflow-x-auto scroll-smooth">

                <div ref={scrollContainerRef} className="max-h-[600px] overflow-y-auto" >

                    <GenericTable
                        columns={["Request ID", "Citizen", "Services", "Status", "Action"]}
                        rows={pendingReqs}
                        lastRowRef={lastPendingReqRef}
                        renderRows={(pendingReq, idx, rowRef) => (
                            <tr key={pendingReq.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                                <td className="p-3 whitespace-normal ">{pendingReq.id}</td>
                                <td className="p-3  whitespace-normal ">{pendingReq.citizen}</td>
                                <td className="p-3  whitespace-normal ">{pendingReq.formData?.service}</td>
                                <td className="p-3  whitespace-normal ">{pendingReq.status}</td>

                                <td className="p-3 ">
                                    <div className='h-full flex flex-row flex-wrap items-center justify-start max-sm:justify-center gap-6'>
                                        <button onClick={() => { setUserReqId(pendingReq.id); setShowUserRequestViewer(true)}} className=" flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer "><Inspect size={16} />Inspect</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />

                    {loading && <p className='text-blue-700 w-full flex items-center justify-center gap-1 py-2 text-base '><Loader2 size={18} className='animate-spin' /> Loading...</p>}
                    {!hasMore && <p className="text-red-700 pb-5 text-center py-2 ">No More Requests!</p>}

                </div>

            </div>

        </div>
    )
}

export default PendingReq