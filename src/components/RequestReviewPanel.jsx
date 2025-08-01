import { Loader2, ScanEye, X } from "lucide-react"
import { useEffect, useState } from "react"
import { approveRequest, fetchUsersReqDetails, rejectedRequest } from "../APIs/staff";
import formatTime from "../Utils/format-time";
import FileViewer from "./FileViewer";

const RequestReviewPanel = ({ requestId, close, }) => {

    const [request, setRequest] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [rejectMsg, setRejectMsg] = useState("");
    const [rejectInput, setRejectInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    // Approve service request.
    const ApproveRequest = async (reqId) => {
        setLoading(true);
        await approveRequest(reqId);
        setLoading(false);
        close(false);
    };

    // Reject service request.
    const RejectRequest = async (reqId) => {

        setDisabled(true);
        if (!rejectMsg) return;

        const formData = new FormData();
        formData.append('requestId', reqId);
        formData.append('message', rejectMsg);

        await rejectedRequest(formData);
        setDisabled(false);
        close(false);
    };

    // Fetch user pending request..
    useEffect(() => {
        const FetchUsersReqDetails = async () => {
            const result = await fetchUsersReqDetails(requestId);
            result.type && setRequest(result?.userReq);
        }
        FetchUsersReqDetails();

    }, [requestId])


    return (

        <div className="absolute top-0 left-0 min-h-full w-full flex justify-center p-3 overflow-y-auto z-50 text-[#4b5157] dark:text-zinc-50 bg-[#f1f1f0] dark:bg-zinc-900">

            {/* Model container */}
            <div className=" w-5xl p-4 rounded-3xl bg-white dark:bg-zinc-800 shadow">

                <h1 className=" pb-4 pt-2 text-[1.2em] max-sm:text-[1.1em] flex justify-between items-center font-bold">
                    Application details
                    <button onClick={() => { setRequest({}); close(false) }} className="transition-colors hover:text-red-500 cursor-pointer"><X /></button>
                </h1>

                {/* Details */}
                <div className=" flex flex-col gap-5">

                    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 p-2 border rounded-md">
                        <p> <strong>Application Id :</strong> {requestId}</p>
                        <p> <strong>Applied Date : </strong>{request && formatTime(request?.createdAt, "D")}</p>
                        <p> <strong>Username :</strong> {request?.citizen}</p>
                        <p> <strong>Current Status :</strong> {request?.status}</p>
                    </div>

                    {/* Form data */}
                    <ul className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 p-2 border rounded-md">
                        {request?.formData &&
                            Object.keys(request?.formData).map((key, idx) => {
                                if (key !== 'files') {
                                    return <li key={idx}> <strong>{key} :</strong> {request?.formData[key]}</li>
                                }
                            })}
                    </ul>

                </div>

                {/* Docs */}
                <div className="flex flex-col gap-2 border p-2 mt-5 rounded-md">
                    <h3 className="font-semibold pb-2">Supporting Documents</h3>

                    <div className="flex flex-wrap gap-3 mb-2 ">
                        {
                            request?.formData &&
                            request.formData.files.map((file, idx) => {
                                return <button key={idx} onClick={() => setFileUrl(file?.url)} className="flex flex-row justify-center items-center gap-2 text-blue-600 cursor-pointer ">Doc 1 </button>
                            })
                        }

                    </div>

                    {/* Doc view */}
                    {fileUrl && <FileViewer fileUrl={fileUrl} />}

                </div>

                {/* Actions */}
                {rejectInput && <textarea onChange={(e) => setRejectMsg(e.target.value)} value={rejectMsg} className="w-full mt-5 p-2 border focus:outline-3 outline-zinc-200 " type="text" rows={4} maxLength={60} placeholder="Reason for reject..." />}

                <div className=" my-5 flex flex-row justify-center items-center flex-wrap gap-4">
                    <button disabled={loading} onClick={() => ApproveRequest(requestId)} className="w-64 flex justify-center items-center gap-2 text-base py-2 px-2.5 bg-green-100 text-green-700 rounded-md font-medium hover:bg-green-200/70 cursor-pointer ">Approve {loading && <Loader2 size={18} className='animate-spin' />} </button>
                    <button disabled={disabled} onClick={() => { rejectInput ? RejectRequest(requestId) : setRejectInput(true) }} className="w-64 flex justify-center items-center gap-2 text-base py-2 px-2.5 bg-red-100 text-red-700 font-medium rounded-md hover:bg-red-200/70 cursor-pointer ">{rejectInput ? "Submit" : "Reject"}</button>
                </div>

            </div>


        </div>

    )
}

export default RequestReviewPanel