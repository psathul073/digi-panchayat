import { Eye, EyeClosed, Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form";
import { auth } from "../../config/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"


const Login = () => {

    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // Handle login.
    const submit = async (data) => {
        try {
            setLoading(true);
            const { email, password } = data;

            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            reset({});
            navigate('/');

        } catch (error) {
            setLoading(false);
            reset({});
            switch (error.code) {
                case 'auth/user-not-found':
                    setMsg('No account found with this email.');
                    break;
                case 'auth/invalid-credential':
                    setMsg("Invalid email or password");
                    break;
                case 'auth/wrong-password':
                    setMsg("Incorrect password. Please try again.");
                    break;
                case 'auth/too-many-requests':
                    setMsg("Too many failed login attempts. Please try again later.");
                    break;
                default:
                    console.error(error.message);
                    break;
            }
        }

    };

    return (
        <section className="login relative h-screen w-screen flex justify-center items-center p-3 font-poppins bg-blue-50 dark:bg-zinc-900">

            <form onSubmit={handleSubmit(submit)} className="w-sm rounded-2xl p-5 flex flex-col items-center bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-50">
                <h2 className="pb-8 pt-5 text-xl font-medium">Welcome back</h2>

                <p className="p-2 font-mono text-red-600 dark:text-red-400">{msg || errors.email?.message || errors.password?.message}</p>


                <div className="relative w-full py-3">
                    <label htmlFor="email" className="absolute top-0.5 left-3 px-1 text-sm bg-white dark:bg-zinc-800" >Email</label>
                    <input className={`w-full p-2.5 rounded-lg border outline-4 ${errors.email ? 'border-red-400 outline-red-400/10' : 'border-blue-400 outline-blue-400/10'}`} type="text" id="email" {...register('email', { required: true, pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Please enter your email!' } })} />
                </div>

                <div className="relative w-full py-3">
                    <label htmlFor="pwd" className="absolute top-0.5 left-3 px-1 text-sm bg-white dark:bg-zinc-800 ">Password</label>
                    <input className={`w-full p-2.5 rounded-lg border outline-4 ${errors.password ? 'border-red-400 outline-red-400/10' : 'border-blue-400 outline-blue-400/10'}`} type={showPwd ? "text" : "password"} id="pwd" {...register('password', { required: true, pattern: { value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, message: 'Must contain 8 or more characters and one number and uppercase,lowercase letter.' } })} />
                    <button className="absolute bottom-5.5 right-2 z-10 cursor-pointer" type="button" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <Eye strokeWidth={1} /> : <EyeClosed strokeWidth={1} />} </button>
                </div>

                <Link to={'/reset-password'} className="self-end text-sm opacity-70">Forgot password?</Link>

                <button disabled={loading} className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg mt-6 mb-4 font-medium text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 cursor-pointer " type="submit">{!loading ? 'Log In' : <Loader2 className='animate-spin' />}</button>

                <p className="text-sm py-2 opacity-70">Don`t have an account? <Link to={'/register'} className="font-medium opacity-100">Register</Link></p>
            </form>

        </section>
    )
}

export default Login