import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAllLogs, sendUpdates } from "../APIs/admin";
import formatTime from "../Utils/format-time";
import { BellPlus, Cross, Loader2, Plus, X } from "lucide-react";
import GenericTable from "./GenericTable";

const Logs = ({ isOpen }) => {

    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [logs, setLogs] = useState([]);
    const [showSendModel, setShowSendModel] = useState(false);
    const [message, setMessage] = useState("");
    const [disabled, setDisabled] = useState(false);
    const observer = useRef();
    const scrollContainerRef = useRef();
    const sendModelRef = useRef(null);


    // Send message.
    const sendMessage = async () => {
        if (!message) return;
        setDisabled(true);
        const formData = new FormData();
        formData.append('message', message);
        await sendUpdates(formData);
        setMessage("");
        setDisabled(false);
    };

    // Fetch all logs.
    const FetchAllLogs = async () => {

        if (loading || !hasMore) return;

        setLoading(true);

        const { logs: newLogs, nextCursor: newCursor } = await fetchAllLogs(nextCursor, 10);

        setLogs(prev => [...prev, ...newLogs]); // set logs.
        setNextCursor(newCursor);
        setHasMore(Boolean(newCursor));
        setLoading(false);

    };

    // Last Logs ref.
    const lastLogRef = useCallback((node) => {

        if (observer.current) {
            // Disconnect observer.
            observer.current.disconnect();
        };

        // Set new observer...
        observer.current = new IntersectionObserver(async (entries) => {

            if (entries[0].isIntersecting && hasMore && !loading && nextCursor !== null) {
                await FetchAllLogs();
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
        FetchAllLogs();
    }, []);

    // Handle send model outside click,
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (sendModelRef.current && !sendModelRef.current.contains(e.target)) {
                setShowSendModel(false);
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick);

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
        }
    }, [])


    return (
        <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3  overflow-hidden font-poppins text-[#4b5157] dark:text-white bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>

            {/* Logs Section*/}
            <div ref={sendModelRef} className="flex justify-between items-center pt-6">
                {/* Title */}
                <h2 className="text-[1.2em] max-sm:text-[1.1em] font-bold ">Recent Logs</h2>

                <button onClick={() => setShowSendModel(!showSendModel)} className="bg-white dark:bg-zinc-800 text-[#4b5157] dark:text-zinc-50 font-medium flex items-center justify-center gap-2 p-2 rounded shadow cursor-pointer"><BellPlus size={24} /> <p className='max-sm:hidden'>Send Updates</p></button>

                {/* Notification update model */}
                {showSendModel &&
                    <div className=" p-4 w-md max-sm:w-full rounded-md fixed bottom-15 right-10 max-sm:right-0  z-40 flex flex-col gap-3 shadow border border-zinc-400/50 bg-white dark:bg-zinc-700 animate-popUp">
                        <label className=" text-[1.1em] font-medium mb-1">Important Updates.</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className=" h-28 border border-zinc-400/50 p-2 rounded-md outline-0" maxLength={60} placeholder="Update message..." ></textarea>
                        <button disabled={disabled} onClick={sendMessage} className="bg-blue-700 text-zinc-50 p-2.5 rounded-full flex items-center justify-center hover:bg-blue-800 cursor-pointer ">{disabled ? <Loader2 size={18} className='animate-spin' /> : 'Send'}</button>
                    </div>
                }

            </div>

            {/* Log table list */}
            <div className="pt-6 overflow-x-auto scroll-smooth" >

                <div ref={scrollContainerRef} className=" max-h-full overflow-y-auto" >

                    <GenericTable 
                    columns={["Timestamp","Action","PerformedBy","Details"]}
                    rows={logs}
                    lastRowRef={lastLogRef}
                    renderRows={(log, idx, rowRef) => (
                        <tr key={log.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                            <td className="p-3 whitespace-normal ">{formatTime(log.createdAt)}</td>
                            <td className="p-3  whitespace-normal ">{log.action}</td>
                            <td className="p-3  whitespace-normal ">{log.performedBy?.role}</td>
                            <td className="p-3  whitespace-normal ">{log.details?.status}</td>
                        </tr>
                    )}
                    />

                    {loading && <p className='text-blue-700 w-full flex items-center justify-center gap-1 py-2 text-base '><Loader2 size={18} className='animate-spin' /> Loading...</p>}
                    {!hasMore && <p className="text-red-700 pb-5 text-center py-2">No more Logs!</p>}

                </div>

            </div>

        </div>
    )
}

export default Logs