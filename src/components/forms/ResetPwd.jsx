import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { auth } from "../../config/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const ResetPwd = () => {

    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    // Handle password reset form.
    const submit = async ({email}) => {
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            setMsg("Password reset email sent! Check your inbox.");
            setLoading(false);
            reset({});

        } catch (error) {
            setLoading(false);
            reset({});
            console.error("Error sending password reset email:", error.code, error.message);
            if (error.code == "auth / invalid - email") {
                setMsg("The email address is not valid.")
            };
        }
    };


    return (
        <section className=" relative h-screen w-screen flex justify-center items-center p-3 font-poppins bg-blue-50 dark:bg-zinc-900">

            <form onSubmit={handleSubmit(submit)} className="w-sm rounded-2xl p-5 flex flex-col items-center bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-50">
                <h2 className="pb-8 pt-5 text-xl font-medium">Reset your password!</h2>

                <p className="p-2 font-mono text-red-600 dark:text-red-400">{msg || errors.email?.message}</p>


                <div className="relative w-full py-3">
                    <label htmlFor="email" className="absolute top-0.5 left-3 px-1 text-sm bg-white dark:bg-zinc-800" >Email</label>
                    <input className={`w-full p-2.5 rounded-lg border outline-4 ${errors.email ? 'border-red-400 outline-red-400/10' : 'border-blue-400 outline-blue-400/10'} `} type="text" id="email" {...register('email', { required: true, pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Please enter your email!' } })} />
                </div>


                <button disabled={loading} className="w-full flex justify-center items-center py-2.5 rounded-lg mt-6 mb-4 font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 cursor-pointer " type="submit">{!loading ? 'Send Reset Email' : <Loader2 className='animate-spin' />}</button>

                <Link to={'/login'} className="self-center text-sm font-medium opacity-70">Log In</Link>

            </form>

        </section>
    )
}

export default ResetPwd