import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAllServices } from "../APIs/admin";
import { Loader2 } from "lucide-react";
import ServiceCard from "./ServiceCard";


const Services = ({ isOpen, openForm, setServiceId }) => {

    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [services, setServices] = useState([]);
    const observer = useRef();
    const scrollContainerRef = useRef();

    // Fetch all services fun.
    const FetchAllServices = async (cursor = null) => {

        if (loading || !hasMore) return;

        setLoading(true);

        const { services: newServices, nextCursor: newCursor } = await fetchAllServices(cursor, "", 10);

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
                        FetchAllServices(nextCursor);
                    }
                },
                {
                    root: scrollContainerRef.current,
                    threshold: 1.0,
                }
            );

            if (node) observer.current.observe(node);
        },
        [hasMore, loading, nextCursor]
    );

    // API call...
    useEffect(() => {
        // Always reset on new search OR first load.
        setServices([]);
        setNextCursor(null);
        setHasMore(true);

        FetchAllServices(null, "");

    }, []);



    return (

        <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3 overflow-hidden font-poppins text-[#4b5157] dark:text-zinc-50 bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300`}>

            <h1 className="py-4 text-[1.2em] max-sm:text-[1.1em] font-bold ">Available Services</h1>

            <div ref={scrollContainerRef} className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-full overflow-y-auto scroll-smooth ">

                {/* Service Card */}
                {
                    services?.map((service, idx) => {

                        const isLast = idx === (services.length - 1) && services.length > 0;

                        return (
                            <ServiceCard
                                key={service.id || `${idx}-${service.title}`}
                                cardRef={isLast ? lastServiceRef : null}
                                service={service} onApply={(id) => { setServiceId(id); openForm(true) }}
                            />
                        )
                    })
                }

                {loading && <p className='text-blue-700 w-full flex items-center justify-center gap-1 text-base '><Loader2 size={18} className='animate-spin' /> Loading...</p>}
                {!hasMore && <p className="text-red-700 pb-5 text-center ">No more services!</p>}

            </div>

        </div>
    )
}

export default Services