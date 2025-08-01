import { ArrowLeftToLine, Eye, EyeClosed, Loader, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { auth, db } from '../../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const Register = ({ isRole, closeForm }) => {

    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // Handle register.
    const submit = async (data) => {
        const { username, email, password } = data;

        try {
            setLoading(true);

            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            //Add user data in firestore,
            await setDoc(doc(db, 'users', user.uid), {
                username,
                email,
                role: isRole ? isRole : 'user',
                createdAt: serverTimestamp(),
            });
            setMsg('Successfully Registered!');
            reset({}); // reset form.
            setLoading(false);
            navigate('/'); // navigate to home.

        } catch (error) {
            setLoading(false);
            reset({});
            const errorCode = error.code;
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    setMsg("Someone already has an account with that email.");
                    break;
                case 'auth/invalid-email':
                    setMsg(" The email address doesn't look right.");
                    break;
                default:
                    console.error(error.message);
                    break;
            }
        }

    };


    return (
        <section className="register relative h-screen w-full flex justify-center items-center p-3 font-poppins bg-blue-50 dark:bg-zinc-900">

            <form onSubmit={handleSubmit(submit)} className="relative w-sm rounded-2xl p-5 flex flex-col items-center bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-50">
                <h2 className="pb-8 pt-5 text-xl font-medium">Welcome</h2>

                <p className="p-2 font-mono text-red-600 dark:text-red-400">{msg || errors.email?.message || errors.password?.message}</p>

                <div className="relative w-full py-3">
                    <label htmlFor="username" className="absolute top-0.5 left-3 px-1 text-sm bg-white dark:bg-zinc-800 ">Name</label>
                    <input className={`w-full p-2.5 rounded-lg border outline-4 ${errors.username ? 'border-red-400 outline-red-400/10' : 'border-blue-400 outline-blue-400/10'}`} type="text" id="username" {...register('username', { required: true })} />
                </div>

                <div className="relative w-full py-3">
                    <label htmlFor="email" className="absolute top-0.5 left-3 px-1 text-sm bg-white dark:bg-zinc-800" >Email</label>
                    <input className={`w-full p-2.5 rounded-lg outline-4 border  ${errors.email ? 'border-red-400 outline-red-400/10' : 'border-blue-400 outline-blue-400/10'}`} type="text" id="email" {...register('email', { required: true, pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Please enter your email!' } })} />
                </div>

                <div className="relative w-full py-3">
                    <label htmlFor="pwd" className="absolute top-0.5 left-3 px-1 text-sm bg-white dark:bg-zinc-800 ">Password</label>
                    <input className={`w-full p-2.5 rounded-lg outline-4 border ${errors.password ? 'border-red-400 outline-red-400/10' : 'border-blue-400 outline-blue-400/10'}`} type={showPwd ? "text" : "password"} id="pwd" {...register('password', { required: true, pattern: { value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, message: 'Must contain 8 or more characters and one number and uppercase,lowercase letter.' } })} />
                    <button className="absolute bottom-5.5 right-2 cursor-pointer" type="button" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <Eye strokeWidth={1} /> : <EyeClosed strokeWidth={1} />} </button>
                </div>

                <button disabled={loading} className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg mt-6 mb-4 font-medium text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 cursor-pointer " type="submit">{!loading ? 'Register' : <Loader2 className='animate-spin' />}</button>

                {!isRole ?
                    <p className="text-sm py-2 opacity-70">Already have an account? <Link to={'/login'} className="font-medium opacity-100">Log In </Link></p> :
                    <button onClick={() => closeForm(false)} type='button' className='w-full flex justify-center items-center gap-2 font-medium text-zinc-900  cursor-pointer '>Back <ArrowLeftToLine size={18} /> </button>
                }

            </form>

        </section>
    )
}

export default Register