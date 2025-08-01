import { LayoutDashboard, ListTodo, Plus, Logs, Trash2, Users, SquarePen } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import ManageServices from '../components/ManageServices';
import ManageStaffs from '../components/ManageStaffs';
import AllLogs from '../components/AllLogs';
import AddServiceForm from '../components/forms/AddServiceForm';
import { deleteService, fetchAllLogs, fetchAllServices, fetchStatus } from '../APIs/admin';
import QuickStatus from '../components/QuickStatus';
import GenericTable from '../components/GenericTable';
import RecentLogs from '../components/RecentLogs';


const AdminDashboard = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [section, setSection] = useState('home');
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [serviceId, setServiceId] = useState(null);
    const [services, setServices] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [logs, setLogs] = useState([]);
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
            section: 'm-services',
            title: 'Manage Services',
            icon: <ListTodo strokeWidth={1.5} />
        },
        {
            id: 3,
            section: 'm-staffs',
            title: 'Manage Staffs',
            icon: <Users strokeWidth={1.5} />
        },
        {
            id: 4,
            section: 'logs',
            title: 'Logs',
            icon: <Logs strokeWidth={1.5} />
        }
    ];

    // Fetch services.
    const FetchServices = async () => {
        const { services } = await fetchAllServices(null, "", 3);
        setServices(services);
    };

    // Delete service.
    const DeleteService = async (id) => {
        setDisabled(true);
        await deleteService(id);
        setDisabled(false);
        // Reset.
        setServices([]);
        await FetchServices();
    };

    // Fetch logs.
    const FetchLogs = async () => {
        const result = await fetchAllLogs(null, 3);
        setLogs([...result.logs]);
    };

    // Fetch status.
    const FetchStatus = async () => {
        const result = await fetchStatus();
        setStatus(result);
    };

    // Fetch logs on load...
    useEffect(() => {
        FetchLogs();
    }, [])

    // Fetch limited services on load...
    useEffect(() => {
        FetchServices();
    }, [])

    // Fetch status on load...
    useEffect(() => {
        FetchStatus();
    }, [])


    return (
        <>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} setSection={setSection} sidebarItems={sidebarItems} />

            {/* Dashboard */}
            {section === 'home' &&
                <div className={`${isOpen ? 'sm:ml-64' : 'ml-0'} min-h-screen pt-14 px-6 max-sm:px-3 overflow-auto font-poppins text-[#4b5157] dark:text-zinc-50 bg-[#f1f1f0] dark:bg-zinc-900 transition-[margin] ease-in-out duration-300 `}>

                    <h1 className=" py-5 text-[1.2em] max-sm:text-[1.1em] font-bold ">Admin Dashboard</h1>

                    {/* Stats */}
                    <QuickStatus role={"admin"} status={status} />

                    {/* Manage Services Table */}
                    <div className="pt-6">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[1.2em] max-sm:text-[1.1em]  font-bold ">Manage Services</h2>
                            <button onClick={() =>{ setShowServiceForm(true); setServiceId(null)}} className="bg-white dark:bg-zinc-800 text-[#4b5157] dark:text-zinc-50 font-medium flex items-center justify-center gap-2 p-2 rounded shadow cursor-pointer"><Plus /> <p className='max-sm:hidden'>Add Service</p></button>
                        </div>

                        <div className="w-full overflow-x-auto scroll-smooth" >

                            <GenericTable
                                columns={["Title", "Description", "Actions"]}
                                rows={services}
                                renderRows={(service, idx, rowRef) => (
                                    <tr key={service.id || idx} ref={rowRef} className='text-base max-sm:text-sm not-last:border-b border-gray-400/20 ' >
                                        <td className="p-3 whitespace-normal ">{service.title}</td>
                                        <td className="p-3  whitespace-normal ">{service.description}</td>
                                        <td className="p-3 ">
                                            <div className='h-full flex flex-row flex-wrap items-center justify-start max-sm:justify-center gap-6'>
                                                <button onClick={() => { setShowServiceForm(true); setServiceId(service.id) }} className=" flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-green-100 text-green-700 hover:text-green-800  cursor-pointer "><SquarePen size={16} />Edit</button>
                                                <button onClick={() => DeleteService(service.id)} disabled={disabled} className=" flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-red-100 text-red-700 hover:text-red-800  cursor-pointer"><Trash2 size={16} />Delete </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            />

                        </div>

                    </div>

                    {/* Logs */}
                    <RecentLogs logs={logs} />

                </div>
            }
            {/* Manage services section */}
            {section === 'm-services' &&
                <ManageServices isOpen={isOpen} openForm={setShowServiceForm} setServiceId={setServiceId} />
            }
            {/* Manage staffs section */}
            {section === 'm-staffs' &&
                <ManageStaffs isOpen={isOpen} />
            }
            {/* All logs view section */}
            {section === 'logs' &&
                <AllLogs isOpen={isOpen} />
            }

            {/* Add service Form model */}
            {showServiceForm && <AddServiceForm close={setShowServiceForm} serviceId={serviceId} />}

        </>
    )
}

export default AdminDashboard