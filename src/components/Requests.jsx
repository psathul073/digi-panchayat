import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAllRequest } from "../APIs/user";
import { Loader2, PrinterCheck } from "lucide-react";
import GenericTable from "./GenericTable";
import { useNavigate } from "react-router";


const Requests = ({ isOpen }) => {

    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [requests, setRequests] = useState([]);
    const observer = useRef();
    const scrollContainerRef = useRef();
    const navigate = useNavigate();


    const FetchAllRequests = async () => {

        if (loading || !hasMore) return;

        setLoading(true);

        const { requests: newRequests, nextCursor: newCursor } = await fetchAllRequest(nextCursor, 10);

        setRequests(prev => [...prev, ...newRequests]); // set requests.
        setNextCursor(newCursor);
        setHasMore(Boolean(newCursor));
        setLoading(false);

    };

    // Last req ref.
    const lastReqRef = useCallback((node) => {
        if (observer.current) {
            // Disconnect observer.
            observer.current.disconnect();
        };

        // Set new observer...
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMore && !loading && nextCursor !== null) {
                await FetchAllRequests();
            };
        }, {
            root: scrollContainerRef.current,
            threshold: 1.0,
        });

        // observe the node....
        if (node) {
            observer.current.observe(node);
        }

    }, [hasMore, loading, nextCursor]);

    // API call on load.
    useEffect(() => {
        FetchAllRequests();
    }, []);

    return (
        <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3 overflow-hidden font-poppins text-[#4b5157] dark:text-white bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300`}>

            <h1 className="py-4 text-[1.2em] max-sm:text-[1.1em] font-bold ">My Applications</h1>

            {/* Recent applications table */}
            <div ref={scrollContainerRef} className=" max-h-full overflow-y-auto">

                <GenericTable
                    columns={["Requests Id", "Services", "Status"]}
                    rows={requests}
                    lastRowRef={lastReqRef}
                    renderRows={(request, idx, rowRef) => (
                        <tr key={request.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                            <td className="p-3 whitespace-normal ">{request.id}</td>
                            <td className="p-3  whitespace-normal ">{request.formData?.service}</td>
                            <td onClick={() => {request.status !== "Pending" && navigate(`/certificate/${request.id}`) }} className="p-3 whitespace-normal" > <p className={` w-fit flex items-center gap-2.5 text-[0.9em] py-2 px-3 rounded-full cursor-pointer ${request.status === 'Pending' && 'bg-yellow-100 text-yellow-700' || request.status === 'Approved' && ' bg-green-100 text-green-700 ' || request.status === 'Rejected' && 'bg-red-100 text-red-700'}`}> {request.status} <PrinterCheck  size={18}/> </p> </td>
                        </tr>
                    )}
                />

                {loading && <p className='text-blue-700 w-full flex items-center justify-center gap-1 py-2 text-base '><Loader2 size={18} className='animate-spin' /> Loading...</p>}
                {!hasMore && <p className="text-red-700 pb-5 text-center py-2">No more Requests!</p>}


            </div>


        </div>
    )
}

export default Requests