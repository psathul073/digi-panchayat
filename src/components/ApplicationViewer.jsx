import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router'
import { fetchRequest } from '../APIs/user';
import Spinner from './Spinner';
import { auth } from '../config/firebase';
import { Download, PrinterCheckIcon } from 'lucide-react';
import generatePDF from 'react-to-pdf';

const ApplicationViewer = () => {

    const [reqData, setReqData] = useState([]);
    const { reqId } = useParams();
    const contentRef = useRef();

    const options = { orientation: 'portrait', unit: 'mm', format: 'a4' }


    useEffect(() => {

        const FetchUserReq = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.warn("User not ready");
                    return;
                }
                const token = await user.getIdToken();
                const result = await fetchRequest(reqId, token);

                if (result?.type && result.userReq) setReqData(result.userReq);

            } catch (error) {
                console.error("Error fetching request!", error);
            }
        };

        if (reqId) FetchUserReq();

    }, [reqId]);

    return (
        <section className=" h-screen w-screen p-2.5 font-poppins text-[#4b5157] dark:text-zinc-50 bg-[#f1f1f0] dark:bg-zinc-900 overflow-y-scroll ">

            <div className="bg-white dark:bg-zinc-800 max-w-2xl mx-auto text-center p-2.5 shadow">
                {reqData.length !== 0 ?
                    <>
                        <div ref={contentRef} className=' relative border-2 px-2 py-4 bg-[#fff] text-[#000]'>

                            {reqData.status === "Approved" &&
                                <>
                                    <h1 className='font-medium text-lg underline mb-2.5'>{reqData?.formData?.service}</h1>

                                    <div className='flex flex-col items-start gap-2 p-2.5'>
                                        {
                                            reqData.formData &&
                                            Object.keys(reqData.formData).map((key, idx) => {

                                                if (key !== "service" && key !== "files") {
                                                    return (
                                                        <p className='font-semibold ' key={idx}>{key} : <span className='ml-2 font-normal'>{reqData.formData[key]}</span></p>
                                                    )
                                                }
                                            })

                                        }
                                    </div>
                                </>
                            }

                            {/* Reject reason */}
                            {reqData?.message &&
                                <div className='w-full text-left px-2 py-4 '>
                                    <h2 className='font-semibold'>Reason for rejection.</h2>
                                    <q className='font-light'>{reqData?.message}</q>
                                </div>
                            }
                            {/* Status */}
                            <p className='text-right underline px-2 py-4'>{reqData?.status}</p>

                        </div>
                        <button onClick={() => generatePDF(contentRef, options)} className=' py-2 hover:scale-105 transition-transform cursor-pointer'><Download /></button>
                    </> :
                    <Spinner />
                }
            </div>

        </section>
    )
}

export default ApplicationViewer