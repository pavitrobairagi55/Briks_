import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function OrderRejectedTAB() {
  const [data, setData] = useState([]);
  const auth = useContext(AuthContext);

  const headCells = [
    {
      id: "CustomerName",
      numeric: false,
      disablePadding: true,
      label: "Customer Name",
    },
    {
      id: "OrderNumber",
      numeric: true,
      disablePadding: false,
      label: "Order Number",
    },
    {
      id: "Notes",
      numeric: true,
      disablePadding: false,
      label: "Notes",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
  ];
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "api/CustomerOrders/status/setsRejected",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setData(response.data.data);
    } catch (error) {}
  };

  const rows = data.map((elem) => {
    return {
      id: elem.id,
      CustomerName: elem.user?.firstName + " " + elem.user?.lastName,
      OrderNumber: elem.id,
      Notes: elem.setsRejectionNote,
      Quantity: elem.quantity.toFixed(2),
    };
  });
  return (
    <>
      <HeaderFilter />
      <EnhancedTable rows={rows} headCells={headCells} />
    </>
  );
}
