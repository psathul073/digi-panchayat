import { useEffect, useState, lazy, Suspense } from "react";
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Spinner from '../components/Spinner';
import { Navigate } from "react-router";

// Lazy loaded pages.
const Dashboard = lazy(() => import('../pages/Dashboard'));
const StaffDashboard = lazy(() => import('../pages/StaffDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

const PrivateRouter = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setRole(userDoc.data().role);
        setUser(currentUser);
      } else {
        setRole(null);
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return null;

  if (!user) return <Navigate to="/landing" replace />;

  if (role === 'user') return <Suspense fallback={<Loader />} > <Dashboard /> </Suspense>;
  if (role === 'staff') return <Suspense fallback={<Loader />} > <StaffDashboard /> </Suspense>;
  if (role === 'admin') return <Suspense fallback={<Loader />} > <AdminDashboard /> </Suspense>;

  // Fallback
  return <Navigate to={'/landing'} />

};

const Loader = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-zinc-800 dark:text-zinc-50">
      <Spinner />
    </div>
  )
};

export default PrivateRouter;
