
const GenericTable = ({
    columns, // Array of header names..
    rows,   // Array of  data.
    renderRows, // Function that builds each <tr>.
    lastRowRef = null // Optionally to use the infinite scroll (put on the last <tr>).
}) => {

    return (
        <table className="w-full bg-white dark:bg-zinc-800 rounded-md">

            <thead className="text-base max-sm:text-sm text-left">
                <tr className="border-b border-gray-400/20 ">
                    {
                        columns?.map((col, idx) => (
                            <th key={idx} className="p-3.5">{col}</th>
                        ))
                    }
                </tr>

            </thead>
            <tbody>
                {
                    rows?.map((row, idx) => {
                        const isLastRow = idx === (rows.length - 1) && rows.length > 0; // detect last row.

                        return (
                            renderRows(row, idx, isLastRow ? lastRowRef : null)
                        )
                    })
                }
            </tbody>

        </table>
    )
}

export default GenericTable