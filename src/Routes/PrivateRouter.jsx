import { useEffect, useState } from "react";
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Dashboard from "../pages/Dashboard";
import StaffDashboard from "../pages/StaffDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import { Navigate } from "react-router";


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

  if (role === 'user') return <Dashboard />;
  if (role === 'staff') return <StaffDashboard />;
  if (role === 'admin') return <AdminDashboard />;

  // Fallback
  return <Navigate to={'/landing'} />

};


export default PrivateRouter;
