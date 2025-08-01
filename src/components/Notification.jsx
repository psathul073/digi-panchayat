import { useEffect, useState } from "react";
import { fetchUpdates } from "../APIs/user";
import { BellRing } from "lucide-react";

const Notification = () => {

  const [update, setUpdate] = useState({});

  // Fetch important updates.
  useEffect(() => {
    const FetchUpdate = async () => {
      const res = await fetchUpdates();
      if (res) setUpdate(res);
    };
    FetchUpdate();
  }, []);


  return (
    <div className="flex items-center gap-2">
      <BellRing size={44} className="animate-pulse bg-yellow-100 text-yellow-500 rounded-full p-2.5" />
      <p className="animate-bounce">{update?.message}</p>
    </div>
  )
}

export default Notification