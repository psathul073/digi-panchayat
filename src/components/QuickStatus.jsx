
const QuickStatus = ({ role, status }) => {

    const statusConfig = {

        user: [
            { title: "Total Requests", value: status?.totalRequests || 0, bg: "bg-blue-100", text: "text-blue-900" },
            { title: "Pending", value: status?.totalPending || 0, bg: "bg-yellow-100", text: "text-yellow-900" },
            { title: "Approved", value: status?.totalApproved || 0, bg: "bg-green-100", text: "text-green-900" }
        ],
        staff: [
            { title: "Pending Requests", value: status?.pendingRequests || 0, bg: "bg-yellow-100", text: "text-yellow-900" },
            { title: "Approved Requests", value: status?.approvedRequests || 0, bg: "bg-green-100", text: "text-green-900" },
            { title: "Rejected Requests", value: status?.rejectedRequests || 0, bg: "bg-red-100", text: "text-red-900" }
        ],
        admin: [
            { title: "Total Users", value: status?.totalUsers || 0, bg: "bg-green-100", text: "text-green-900" },
            { title: "Total Services", value: status?.totalServices || 0, bg: "bg-blue-100", text: "text-blue-900" },
            { title: "Total Requests", value: status?.totalRequests || 0, bg: "bg-yellow-100", text: "text-yellow-900" }
        ]
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 dark:text-zinc-900">

            {
                statusConfig[role].map((item, idx) => (
                    <div key={idx} className={`${item.bg} p-4 rounded-md shadow`}>
                        <h2 className={`text-[1.2em] max-sm:text-[1.1em] font-semibold ${item.text}`}>{item.title}</h2>
                        <p className="text-[1.2em] max-sm:text-[1.1em]">{item.value}</p>
                    </div>

                ))
            }

        </div>
    )

}

export default QuickStatus