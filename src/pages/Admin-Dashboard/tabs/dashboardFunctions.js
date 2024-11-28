import axios from "../../../api/axios";

export const fetchDashboardData = async (setProductBalances, auth) => {
    try {
      const response = await axios.get(`api/dashboard/products-balance`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setProductBalances(response.data);
    } catch (error) {
      setProductBalances([]);
    }
  };

export const fetchInventoryData = async (setData, auth) => {
    try {
      const response = await axios.get(`api/DashBoard/inventory`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setData(response.data.data);
    } catch (error) {
      setData({});
    }
  };