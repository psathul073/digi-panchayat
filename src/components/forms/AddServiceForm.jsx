import { Loader2, PlusSquare, SaveAll, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { addService, editService, fetchService } from "../../APIs/admin";

const AddServiceForm = ({ close, serviceId }) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fields, setFields] = useState([{ name: "", type: "text", required: true }]);
    const [alert, setAlert] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Add  new field.
    const addNewField = () => {
        setFields([...fields, { name: "", type: "text", required: true }]);
    };
    // Remove field.
    const removeField = (index) => {
        setFields(fields.filter((_, idx) => index !== idx)); // filter fields.
    }

    // Handle field change.
    const handleFieldChange = (index, field, value) => {
        const newFields = [...fields]; // make a copy of the array.
        newFields[index][field] = value; // update the specific property.
        setFields(newFields); // update state with new array.
    };

    // Handle submit for Add service and Edit service.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert("");

        try {

            if (!title && !description & fields.length === 0) return;

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('fields', JSON.stringify(fields));
            formData.append('serviceId', serviceId);

            if (serviceId) {
                // Update existing service.
                const res = await editService(formData);
                setAlert(res.message)
                setLoading(false);
                setTitle("");
                setDescription("");
                setFields([{ name: "", type: "text", required: true }]);

                setTimeout(() => {
                    close(false); // close form after 1s.
                }, 1000);


            } else {
                // Add new service.
                const res = await addService(formData);
                setAlert(res.message)
                setLoading(false);
                setTitle("");
                setDescription("");
                setFields([{ name: "", type: "text", required: true }]);
            }

        } catch (error) {
            console.error(error)
            setLoading(false);
            setTitle("");
            setDescription("");
            setFields([{ name: "", type: "text", required: true }]);

        }

    };


    // Fetch single service and fill form.
    useEffect(() => {

        const FetchService = async () => {
            const result = await fetchService(serviceId);

            if (result) {
                setTitle(result.title ?? "");
                setDescription(result.description ?? "");
                setFields(result.fields ?? [{ name: "", type: "text", required: true }]);
            }
        };

        serviceId ? FetchService() : null; // call only if service id true.

    }, [serviceId])


    // Auto scroll to bottom when new field added.
    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [fields])


    return (
        <div className="backdrop fixed top-0 w-full h-full z-30 flex justify-center items-center bg-zinc-500/50 backdrop:blur-lg">

            <form onSubmit={handleSubmit} className=" bg-blue-50 dark:bg-zinc-800 dark:text-zinc-50 w-lg flex flex-col items-center rounded-xl p-6 space-y-4 font-poppins shadow animate-popIn">

                <h1 className="w-full flex justify-between items-center text-lg font-semibold text-zinc-700">{ serviceId ? "Edit Service" : "Add New Service"}
                    <button onClick={() => close(false)} type="button" className=" p-1 rounded-full text-zinc-700 hover:bg-zinc-500/20 hover:text-red-700 cursor-pointer"><X /></button>
                </h1>
                <p className="text-green-700 dark:text-green-500 animate-popIn">{alert}</p>

                {/* Inputs */}
                <input className="w-full p-2 border outline-4 border-blue-700 outline-blue-400/10 rounded" type="text" placeholder="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea className="w-full p-2 border outline-4 border-blue-700 outline-blue-400/10 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                {/* Field container */}
                <div className="w-full h-full space-y-4 ">

                    <h2 className="text-lg font-semibold">Fields</h2>

                    <div className=" h-60 overflow-y-scroll scroll-smooth space-y-4">

                        {/* Dynamically add fields */}
                        {fields?.map((field, index) => (
                            <div key={index} className="border-2 border-dashed border-blue-600/50 rounded-md p-2 flex flex-col gap-3 ">
                                {/* Field name */}
                                <input className=" border outline-4 border-blue-600 outline-blue-400/10 rounded p-2 w-full" type="text" placeholder="Field Name" value={field.name} onChange={(e) => handleFieldChange(index, "name", e.target.value)} required />
                                {/* Field type */}
                                <select className="border outline-4 border-blue-600 outline-blue-400/10  rounded p-2 w-full dark:bg-zinc-800" value={field.type} onChange={(e) => handleFieldChange(index, "type", e.target.value)} >
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date</option>
                                    <option value="file">File</option>
                                </select>
                                {/* Field required */}
                                <label className=" border outline-4 border-blue-600 outline-blue-400/10  rounded p-2 flex items-center space-x-2">
                                    <input type="checkbox" checked={field.required} onChange={(e) => handleFieldChange(index, "required", e.target.checked)} />
                                    <span>Required</span>
                                </label>
                                <button className=" bg-red-100 text-red-700 p-2 rounded w-full flex justify-center items-center gap-1 hover:bg-red-200 cursor-pointer" onClick={() => removeField(index)}><Trash2 size={18} /> Remove </button>

                            </div>
                        ))}
                        <div ref={scrollRef}></div>
                    </div>

                </div>
                {/* Actions */}
                <div className=" flex flex-row justify-between items-center gap-3">
                    <button className="bg-blue-100 text-blue-700 flex justify-center items-center gap-2 font-medium p-2.5 rounded-md hover:bg-blue-200 cursor-pointer " type="button" onClick={addNewField}><PlusSquare size={18} /> Add Field</button>
                    <button className="bg-green-100 text-green-700 flex justify-center items-center gap-2 font-medium p-2.5 rounded-md hover:bg-green-200 cursor-pointer " type="submit"> {loading ? <Loader2 size={18} className='animate-spin' /> : <SaveAll size={18} />}{serviceId ? 'Edit' : 'Save'} Service</button>
                </div>


            </form>

        </div>
    )
}

export default AddServiceForm