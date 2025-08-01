import { Loader2, Search } from "lucide-react"
import GenericTable from "./GenericTable"
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../Hooks/useDebounce";
import { fetchUsersAllReq } from "../APIs/staff";

const AllRequest = ({ isOpen }) => {

  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allRequests, setAllRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, searchTerm ? 300 : 0);
  const observer = useRef();
  const scrollContainerRef = useRef();
  

  const FetchUsersAllReq = async (cursor = null, searchTerm = debouncedSearchTerm) => {

    if (loading || !hasMore) return;

    setLoading(true);
    const { allUsersReq: newAllRequests, nextCursor: newCursor } = await fetchUsersAllReq(5, searchTerm, cursor);

    setAllRequests(prev => [...prev, ...newAllRequests]);
    setNextCursor(newCursor);
    setHasMore(Boolean(newCursor));
    setLoading(false);
  };

  // set last request node reference.
  const lastReqRef = useCallback(

    (node) => {

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading && nextCursor !== null) {
            // console.log("Intersecting last row!");
            FetchUsersAllReq(nextCursor, debouncedSearchTerm);
          }
        },
        {
          root: scrollContainerRef.current,
          threshold: 0.1,
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, loading, nextCursor, debouncedSearchTerm]
  );

  // Call API on load.
  useEffect(() => {
    // Always reset on new search OR first load.
    setAllRequests([]);
    setNextCursor(null);
    setHasMore(true);
    FetchUsersAllReq(null, debouncedSearchTerm);

  }, [debouncedSearchTerm]);


  return (
    <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3 overflow-hidden font-poppins text-[#4b5157] dark:text-white bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>

      {/* All Requests Table */}
      <h2 className="pt-6 text-[1.2em] max-sm:text-[1.1em] font-bold ">All Requests</h2>

      {/* Search */}
      <div className="my-6 w-full sm:w-80 flex items-center justify-between rounded-md py-1 px-2 bg-white dark:bg-zinc-800 shadow">
        <Search className=" cursor-pointer" />
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-2 py-1 outline-0 " type="text" placeholder="Enter citizen name" />
      </div>

      {/* Table */}
      <div className="pt-4 overflow-x-auto scroll-smooth">

        <div ref={scrollContainerRef} className="max-h-[600px] overflow-y-auto" >

          <GenericTable
            columns={["Request ID", "Citizen", "Services", "Status"]}
            rows={allRequests}
            lastRowRef={lastReqRef}
            renderRows={(request, idx, rowRef) => (
              <tr key={request.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                <td className="p-3 whitespace-normal ">{request.id}</td>
                <td className="p-3 whitespace-normal ">{request.citizen}</td>
                <td className="p-3 whitespace-normal ">{request.formData?.service}</td>
                <td className="p-3 whitespace-normal"><p className={` w-fit px-3 py-1.5 rounded-full ${request.status === 'Pending' && ' bg-yellow-100 text-yellow-700' || request.status === 'Approved' && ' bg-green-100 text-green-700 ' || request.status === 'Rejected' && 'bg-red-100 text-red-700'}`}>{request.status}</p></td>
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

export default AllRequest