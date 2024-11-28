import axios from "../../../api/axios";

export const fetchWarehouses = async (auth) => {
  let response = [];
  try {
    const res = await axios.get(`api/warehouses`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });
    response = res.data;
  } catch (error) {
    throw new Error(error.message);
  }

  return response;
};
