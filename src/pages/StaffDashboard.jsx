import { Check, ClockAlertIcon, Inspect, LayoutDashboard, ListTodo, X } from "lucide-react"
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PendingReq from "../components/PendingReq";
import AllRequest from "../components/AllRequests";
import RequestReviewPanel from "../components/RequestReviewPanel";
import { fetchStatus, fetchUsersPendingReq } from "../APIs/staff";
import GenericTable from "../components/GenericTable";
import QuickStatus from "../components/QuickStatus";


const StaffDashboard = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [section, setSection] = useState('home');
    const [showUserRequestViewer, setShowUserRequestViewer] = useState(false);
    const [userReqId, setUserReqId] = useState("");
    const [pendingReqs, setPendingReqs] = useState([]);
    const [status, setStatus] = useState({});

    // sidebar items.
    const sidebarItems = [
        {
            id: 1,
            section: 'home',
            title: 'Dashboard',
            icon: <LayoutDashboard strokeWidth={1.5} />
        },
        {
            id: 2,
            section: 'p-requests',
            title: 'Pending Requests',
            icon: <ClockAlertIcon strokeWidth={1.5} />
        },
        {
            id: 3,
            section: 'all-requests',
            title: 'All Requests',
            icon: <ListTodo strokeWidth={1.5} />
        }
    ];

    // Fetch status.
    useEffect(() => {
        const FetchStatus = async () => {
            const result = await fetchStatus();
            setStatus(result.status);
        };
        FetchStatus();

    }, [])

    // Fetch users latest pending req.
    const FetchUsersPendingReq = async () => {

        const { pendingReq } = await fetchUsersPendingReq(3, "", "desc", null);
        setPendingReqs(prev => [...prev, ...pendingReq]);

    };

    useEffect(() => {
        FetchUsersPendingReq();
    }, []);


    return (
        <>
            {/* Navbar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} setSection={setSection} sidebarItems={sidebarItems} />

            {/* Dashboard section */}
            {section === 'home' &&

                <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen p-6 mt-14 max-sm:p-3 font-poppins text-zinc-900 dark:text-white bg-blue-50 dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>

                    <h1 className="text-[1.2em] max-sm:text-[1.1em] font-bold mb-10">Staff Dashboard</h1>

                    {/* Quick Stats */}
                    <QuickStatus role={'staff'} status={status} />

                    {/* Pending Requests Table */}
                    <div className="mb-10">
                        <h2 className="text-[1.2em] max-sm:text-[1.1em] font-bold mb-5">Pending Requests</h2>

                        {/* Table */}
                        <div className="min-w-full overflow-x-auto scroll-smooth">

                            <GenericTable
                                columns={["Request ID", "Citizen", "Services", "Status", "Action"]}
                                rows={pendingReqs}
                                renderRows={(pendingReq, idx, rowRef) => (
                                    <tr key={pendingReq.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                                        <td className="p-3 whitespace-normal ">{pendingReq.id}</td>
                                        <td className="p-3  whitespace-normal ">{pendingReq.citizen}</td>
                                        <td className="p-3  whitespace-normal ">{pendingReq.formData?.service}</td>
                                        <td className="p-3  whitespace-normal ">{pendingReq.status}</td>

                                        <td className="p-3 ">
                                            <div className='h-full flex flex-row flex-wrap items-center justify-start max-sm:justify-center gap-6'>
                                                <button onClick={() => { setUserReqId(pendingReq.id); setShowUserRequestViewer(true) }} className=" flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer "><Inspect size={16} />Inspect</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            />


                        </div>

                    </div>

                </div>
            }

            {/* Pending requests section */}
            {section === 'p-requests' &&
                <PendingReq isOpen={isOpen} setShowUserRequestViewer={setShowUserRequestViewer} setUserReqId={setUserReqId} />
            }

            {/* All requests section*/}
            {section === 'all-requests' &&
                <AllRequest isOpen={isOpen} />
            }

            {/* Request review model */}
            {showUserRequestViewer && <RequestReviewPanel requestId={userReqId} close={setShowUserRequestViewer} />}


        </>

    )
}

export default StaffDashboard