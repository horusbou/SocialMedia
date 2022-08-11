import { useState, useEffect } from "react";

import Client from '../services/Client'
const useFetchUsers = () => {
  const [data, setData] = useState({
    slug: "",
    results: [],
  });
  const [loading,setLoading]=useState(true)


  useEffect(() => {

    if (data.slug !== "") {
        setLoading(true)
      const timeoutId = setTimeout(() => {
        const fetch = async () => {
          try {
            const res = await Client.searchForUser(data.slug)
            setData(e=>({
                slug:e.slug,
                results:res.data
            }))
        } catch (err) {
            console.error(err);
        }
    };
    fetch();
    setLoading(false)
      }, 1000);
      return () => clearTimeout(timeoutId);
    }else {
        setLoading(false);
    }
  }, [data.slug]);

  return { loading,data, setData };
};

export default useFetchUsers;
