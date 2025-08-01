import React, { useCallback, useRef } from 'react'
import Header from '../components/Header'
import { BellRing, LaptopMinimalCheck, Mail, MoveRight, NotebookPen, PhoneCall, ShieldCheck, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

const LandingPage = () => {

  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // On about click.
  const handleAboutClick = useCallback(() => {
    navigate('#about', { replace: false });
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [navigate]);

  // On contact click.
  const handleContactClick = useCallback(() => {
    navigate('#contact', { replace: false });
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [navigate]);


  return (
    <>
      {/* Landing page Header */}
      <Header aboutClick={handleAboutClick} contactClick={handleContactClick} />

      {/* Hero section */}
      <section className='hero flex flex-row max-md:flex-col-reverse items-center justify-between px-10 mt-11 max-md:px-2.5 font-poppins bg-blue-50/50 dark:bg-zinc-900'>

        <div className='box-a w-2/2 dark:text-white'>

          <h1 className='text-3xl max-sm:text-xl font-bold py-1.5'>Digital E-Gram Panchayat</h1>
          <h2 className='text-[1.15em] max-sm:text-[1em] font-medium pb-5 opacity-80'>Access Gram Panchayat services online</h2>
          <p className='pb-3 dark:text-gray-300 leading-loose'>Forget the old ways of long trips and endless paperwork. Now, you can apply for services like birth certificates or welfare schemes with a few clicks. Plus, you can track your application's progress in real-time, so you're always in the loop.</p>
          <p className='pb-3 dark:text-gray-300 leading-loose'>It's all about making village-level activities simple, transparent, and convenient for you</p>

          <div className='CTA w-full flex items-center max-sm:justify-center sm:ml-10 gap-5 my-10'>
            <Link to={'/login'} className='w-28 px-2.5 py-2 text-center font-medium rounded-md border-2 border-blue-700 text-blue-700 hover:border-blue-700 dark:border-blue-500 dark:text-blue-500 cursor-pointer'>Log In</Link>
            <Link to={'/register'} className='w-28 px-2.5 py-2 text-center font-medium rounded-md border-2 border-blue-700 bg-blue-700 text-white hover:bg-blue-800 dark:border-blue-600 dark:bg-blue-600 cursor-pointer'>Register</Link>
          </div>

        </div>

        <div className='box-b w-2/2 h-2/2'>
          <img className='mx-auto object-center object-cover' src="./two-person.webp" alt="" />
        </div>

      </section>

      {/* About section */}
      <section ref={aboutRef} id='about' className='about px-10 pb-5 max-md:px-2.5 bg-blue-50/50 dark:bg-zinc-900 dark:text-gray-300 font-poppins'>

        <h2 className='text-xl max-sm:text-lg font-bold py-3 text-gray-900 dark:text-gray-50'> ABOUT </h2>
        <p className='text-balance pb-3 leading-loose'>The  Digital E-Gram Panchayat platform is all about making government services for villages simple, secure, and accessible from anywhere.  Our main goal? To deliver services that are fast, transparent, and truly citizen-friendly. </p>
        <p className='text-balance pb-3 leading-loose'>This initiative tackles the old problems of slow, complicated rural services. Now, instead of long trips and endless paperwork, villagers can access crucial services — like birth certificates, property records, and welfare applications — right from home. This saves a lot of time and cuts down on delays.</p>
        <p className='text-balance pb-3 leading-loose'>We've made security a top priority. Your information is protected with strong encryption, so you can trust the platform. Transparency  is key too. Every transaction is trackable, helping to prevent corruption and keep things accountable. You'll always know the status of your applications, without any guesswork.</p>
        <p className='text-balance pb-3 leading-loose'>Ultimately, the Digital E-Gram Panchayat isn't just technology; it's about empowering rural communities. By making government services easy to use and readily available, we're helping to bridge the digital divide and build a more efficient, responsive local government for everyone. It's a big step towards a digitally empowered India.</p>

      </section>

      {/* Features section */}
      <section className='features px-10 pb-5 max-md:px-2.5  bg-blue-50/50 dark:bg-zinc-900 dark:text-white font-poppins'>

        <h2 className='text-xl max-sm:text-lg font-bold py-3'>FEATURES</h2>

        <ul className=' grid grid-cols-2 max-sm:grid-cols-1 justify-center'>
          <li className='flex items-center gap-3 text-xl max-sm:text-lg font-medium py-5 max-sm:py-3 '><NotebookPen size={44} strokeWidth={1} className=' p-2 rounded-full text-amber-600 border-2 border-amber-600 bg-amber-600/20' /> Apply for services online</li>
          <li className='flex items-center gap-3 text-xl max-sm:text-lg font-medium py-5 max-sm:py-3 '><LaptopMinimalCheck size={44} strokeWidth={1} className=' p-2 rounded-full text-blue-600 border-2 border-blue-600 bg-blue-600/20' />Track your requests anytime</li>
          <li className='flex items-center gap-3 text-xl max-sm:text-lg font-medium py-5 max-sm:py-3 '><BellRing size={44} strokeWidth={1} className=' p-2 rounded-full text-red-600 border-2 border-red-600 bg-red-600/20' /> Transparent status updates</li>
          <li className='flex items-center gap-3 text-xl max-sm:text-lg font-medium py-5 max-sm:py-3 '><ShieldCheck size={44} strokeWidth={1} className=' p-2 rounded-full text-green-600 border-2 border-green-600 bg-green-600/20' /> Secure and easy to use </li>
        </ul>

      </section>

      {/* Working explain section */}
      <section className='working px-10 pb-5 max-md:px-2.5  bg-blue-50/50 dark:bg-zinc-900 dark:text-white font-poppins'>

        <h2 className='text-xl max-sm:text-lg font-bold py-3 text-gray-900 dark:text-gray-50'>HOW IT WORKS</h2>

        <div className='flex flex-row items-center justify-center max-sm:flex-col gap-5 my-10'>

          <div className='flex flex-col items-center justify-center gap-3'>
            <UserRound size={64} strokeWidth={1} className=' p-3 rounded-full text-green-600 border-2 border-green-600 bg-green-600/20' />
            <p>Register your account</p>
          </div>

          <MoveRight className='max-sm:rotate-90' />

          <div className='flex flex-col items-center justify-center gap-3'>
            <NotebookPen size={64} strokeWidth={1} className=' p-3 rounded-full text-amber-600 border-2 border-amber-600 bg-amber-600/20' />
            <p> Apply for available services </p>
          </div>

          <MoveRight className='max-sm:rotate-90' />

          <div className='flex flex-col items-center justify-center gap-3'>
            <LaptopMinimalCheck size={64} strokeWidth={1} className=' p-3 rounded-full text-blue-600 border-2 border-blue-600 bg-blue-600/20' />
            <p> Track application status online</p>
          </div>


        </div>

      </section>

      {/* Contact section */}
      <section ref={contactRef} id='contact' className='contact px-10 pb-10 max-md:px-2.5  bg-blue-50/50 dark:bg-zinc-900 dark:text-white font-poppins'>

        <h2 className='text-xl max-sm:text-lg font-bold py-3 text-gray-900 dark:text-gray-50'>CONTACT / HELP </h2>
        <p className='text-balance max-sm:text-base pb-3 leading-loose'>Need help? 📞 Contact your Panchayat office or email us. </p>
        <h3 className='flex items-center gap-2 pt-5'><PhoneCall strokeWidth={1} /> <strong>Phone :</strong> +91 9876543210</h3>
        <h3 className='flex items-center gap-2 pt-5'><Mail strokeWidth={1} /> <strong> Email :</strong> support@gram.gov.in</h3>

      </section>

      {/* Footer */}
      <footer className='flex justify-between items-center gap-3 max-sm:flex-col px-10 py-8 max-md:px-2.5 border-t border-slate-500/20 bg-blue-50/50 dark:bg-zinc-900 dark:text-white font-poppins'>
        <h3 className='max-sm:text-base'>Copyright: © {new Date().getFullYear()} DigiPanchayat</h3>
        <div className='flex gap-4 max-sm:text-sm opacity-80'>
          <Link >Privacy Policy</Link>
          <Link >Terms of Condition</Link>
          <Link >Contact</Link>
        </div>
      </footer>
    </>
  )
}

export default LandingPage