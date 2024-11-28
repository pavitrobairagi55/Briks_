import { useContext, useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { AuthContext } from "./authContext";

const UseFetchData = (url, dependencies) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const auth = useContext(AuthContext);
  const refetch = useRef(() => {});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setData(response.data?.data || response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("🚀 ~ fetchData ~ error:", error);
        // Handle error
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    refetch.current = fetchData;

    let searchTimeout;

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchData();
    }, 400);

    return () => {
      setIsMounted(false);
      clearTimeout(searchTimeout);
    };
  }, dependencies);

  return { isLoading, data, refetch: refetch.current };
};

export default UseFetchData;
