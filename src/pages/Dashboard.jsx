import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import { BookA, LayoutDashboard, LayoutList } from "lucide-react";
import Services from "../components/Services";
import Requests from "../components/Requests";
import ApplyServiceForm from "../components/forms/ApplyServiceForm";
import { fetchAllRequest, fetchStatus } from "../APIs/user";
import { fetchAllServices } from "../APIs/admin";
import QuickStatus from "../components/QuickStatus";
import ServiceCard from "../components/ServiceCard";
import GenericTable from "../components/GenericTable";
import Notification from "../components/Notification";


const Dashboard = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [section, setSection] = useState('home');
    const [showApplyForm, setShowApplyForm] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [status, setStatus] = useState({});
    const [requests, setRequests] = useState([]);
    const [featuredServices, setFeaturedServices] = useState([]);


    // sidebar items.
    const sidebarItems = [
        {
            id: 1,
            section: 'home',
            title: 'Home',
            icon: <LayoutDashboard strokeWidth={1.5} />
        },
        {
            id: 2,
            section: 'services',
            title: 'Available Services',
            icon: <LayoutList strokeWidth={1.5} />
        },
        {
            id: 3,
            section: 'requests',
            title: 'My Applications',
            icon: <BookA strokeWidth={1.5} />
        }
    ];

    // Fetch status.
    useEffect(() => {
        const FetchStatus = async () => {
            const result = await fetchStatus();
            setStatus(result);
        };

        FetchStatus();

    }, [])

    // Fetch recent requests.
    useEffect(() => {
        const FetchRecentReq = async () => {
            const { requests } = await fetchAllRequest(null, 3);
            setRequests(requests);
        };
        FetchRecentReq();
    }, []);

    // Fetch recent services.
    useEffect(() => {
        const FetchRecentServices = async () => {
            const { services } = await fetchAllServices(null, "", 3);
            setFeaturedServices(services);
        };
        FetchRecentServices();
    }, [])


    return (
        <>
            {/* Navbar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} setSection={setSection} sidebarItems={sidebarItems} />

            {/* User dashboard section */}
            {section === 'home' &&
                <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen p-6 mt-14  max-sm:p-3.5 font-poppins text-[#4b5157] dark:text-zinc-50 bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>
                    <h1 className="text-[1.2em] max-sm:text-[1.1em] font-bold mb-10">Welcome, Athul! 👋</h1>

                    {/* Quick Stats */}
                    <QuickStatus role={"user"} status={status} />

                    {/* Recent Requests */}
                    <div className="mb-10">
                        <h2 className="text-[1.2em] max-sm:text-[1.1em] font-bold mb-5">Recent Requests</h2>

                        {/* Recent applications table */}
                        <GenericTable
                            columns={["Requests Id", "Services", "Status"]}
                            rows={requests}
                            renderRows={(request, idx, rowRef) => (
                                <tr key={request.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                                    <td className="p-3 whitespace-normal ">{request.id}</td>
                                    <td className="p-3  whitespace-normal ">{request.formData?.service}</td>
                                    <td className={`p-3  whitespace-normal `}><p className={`w-fit  rounded-full px-3 py-1.5 ${request.status === 'Pending' && 'text-yellow-700 bg-yellow-100' || request.status === 'Approved' && 'text-green-700 bg-green-100' || request.status === 'Rejected' && 'text-red-700 bg-red-100'}`}>{request.status}</p></td>
                                </tr>
                            )}
                        />
                    </div>

                    {/* Popular Services */}
                    <div className="mb-10">
                        <h2 className="text-[1.2em] max-sm:text-[1.1em] font-bold mb-5">Popular Services</h2>

                        {/* Service cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {
                                featuredServices.map((service, idx) => (
                                    <ServiceCard
                                        key={service.id || idx}
                                        service={service}
                                        onApply={(id) => { setServiceId(id); setShowApplyForm(true) }}
                                    />
                                ))
                            }
                        </div>

                    </div>

                    {/* Notification */}
                    <Notification />

                </div>
            }

            {/* Services section */}
            {section === 'services' &&
                <Services isOpen={isOpen} openForm={setShowApplyForm} setServiceId={setServiceId} />
            }

            {/* My applications section */}
            {section === 'requests' &&
                <Requests isOpen={isOpen} />
            }

            {/* Apply service form */}
            {showApplyForm && <ApplyServiceForm closeForm={setShowApplyForm} serviceId={serviceId} />}

        </>
    )
}

export default Dashboard