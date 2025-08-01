
const RecentLogs = ({ logs }) => {
    

    return (
        <div className='pt-5'>
            <h2 className="text-[1.2em] max-sm:text-[1.1em] font-bold">Recent Logs</h2>
            <ul className="list-disc pl-5 py-2">
                {
                    logs?.map(log => (
                        <li key={log.id} className='py-2 text-[1em] max-sm:text-[0.9em] animate-pulse text-slate-500'>{`${log.details?.status}, ${log.details?.serviceTitle || log.details?.serviceId}`}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default RecentLogs