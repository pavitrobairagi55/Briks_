import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import axios from "../api/axios";

const useFetch = (endPoint) => {
  const auth = useContext(AuthContext);
  const [data, setData] = useState();
  const [isLoading, setisLoading] = useState(false);
  const fetchData = async () => {
    setisLoading(true);

    const response = await axios.get("api/" + endPoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setData(response.data.data || response.data);
    setisLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return { data, isLoading, fetchData };
};

export default useFetch;
