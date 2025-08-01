import { Loader2, Upload, X } from "lucide-react"
import { useEffect, useState } from "react";
import { fetchService } from "../../APIs/admin";
import { useForm } from "react-hook-form";
import { submitRequest } from "../../APIs/user";


const ApplyServiceForm = ({ closeForm, serviceId }) => {

    const [title, setTitle] = useState("");
    const [fields, setFields] = useState([]);
    const [msg, setMsg] = useState("");
    const { register, reset, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);


    // Handle form submit.
    const formSubmit = async (data) => {

        setLoading(true);
        const maxFileSize = 1.5 * 1024 * 1024; // 1.5Mb in bytes
        const formData = new FormData();

        formData.append('service', title);
        // Form field data...
        Object.keys(data).forEach(key => {
            const file = data[key][0];
            // Check file size...
            if (data[key] instanceof FileList) {
                if (file && file.size > maxFileSize) {
                    setMsg('Maximum file size is 1.5MB!');
                    setLoading(false);
                    return;
                }
                formData.append(key, file) // append file input fields.
            } else {
                formData.append(key, data[key]); // normal fields.
            }
        });

        const res = await submitRequest(formData, serviceId); // submit form data.
        setMsg(res.message);
        reset({});
        setLoading(false);
        setTimeout(() => {
            closeForm(false);
        }, 2000);
    };

    // Fetch single service on load.
    useEffect(() => {

        const FetchService = async () => {
            setLoading(true);
            const result = await fetchService(serviceId);
            
            if (result) {
                setLoading(false);
                setTitle(result.title ?? '');
                setFields(result.fields ?? [{ name: "", type: "text", required: true }]);
            }
        };

        serviceId ? FetchService() : null; // call only if service id true.

    }, [serviceId])

    return (
        <div className="backdrop fixed top-0 w-full h-full z-30 flex justify-center items-center bg-zinc-500/50 backdrop:blur-lg">

            <form onSubmit={handleSubmit(formSubmit)} className=" bg-blue-50 dark:bg-zinc-800 dark:text-zinc-50 w-lg flex flex-col items-center rounded-xl p-6 space-y-4 font-poppins shadow animate-popIn">

                <h1 className="w-full flex justify-between items-center text-lg font-semibold">Apply for : {title ?? ''}
                    <button onClick={() => closeForm(false)} type="button" className=" p-1 rounded-full hover:bg-zinc-500/20 hover:text-red-700 cursor-pointer"><X /></button>
                </h1>
                {msg && <p className="text-green-700 dark:text-green-500 animate-popIn">{msg}</p>}
                {/* Inputs container */}
                <div className="py-2 min-w-full h-lg overflow-y-auto scroll-smooth">

                    {
                        fields?.map((field, idx) => {
                            const safeName = field.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') || `field_${idx}`;

                            return (
                                <div key={idx} className="p-2">
                                    <label className="block mb-2 text-zinc-600 dark:text-zinc-400">{field.name}</label>
                                    <input className=" w-full rounded-md p-2 border border-blue-700 outline-4 outline-blue-100 invalid:border-red-700 invalid:outline-red-100 " type={field.type} required={field.required} {...register(safeName)} />
                                </div>
                            )
                        })
                    }

                </div>

                {/* Action */}
                <button disabled={loading} className="bg-blue-100 text-blue-700/80 flex justify-center items-center gap-2 font-medium p-2.5 rounded-md hover:bg-blue-200 cursor-pointer " type="submit"> {loading ? <Loader2 size={18} className='animate-spin' /> : <Upload size={18} />} Submit Request </button>
            </form>

        </div>
    )
}

export default ApplyServiceForm