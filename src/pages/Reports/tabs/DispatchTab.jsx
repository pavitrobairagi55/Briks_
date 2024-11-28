import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

export default function DispatchTab() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [data, setData] = useState();

  const [selectValue, setSelectValue] = useState();
  const auth = useContext(AuthContext);
  const [url, setUrl] = useState();
  const [excelUrl, setExcelUrl] = useState();

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const headCells = [
    {
      id: "TripId",
      numeric: false,
      disablePadding: false,
      label: "TripID",
    },
    {
      id: "Date",
      numeric: false,
      disablePadding: true,
      label: "Date",
    },
    {
      id: "DN",
      numeric: true,
      disablePadding: false,
      label: "DN#",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "WareHouseName",
      numeric: true,
      disablePadding: false,
      label: "WareHouse Name",
    },
    {
      id: "Zone",
      numeric: true,
      disablePadding: false,
      label: "Zone",
    },
  ];

  const rows = data?.map((elem) => {
    return {
      TripId: elem.tripId,
      Date: formatDate(elem.dispatchDate),
      DN: elem.dispatchNumber,
      Product: elem.productName,
      Quantity: elem.quantity.toFixed(2),
      WareHouseName: elem.warehouseName,
      Zone: elem.zoneName,
    };
  });
  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setData(response.data?.data || response.data);
    } catch (error) {
      console.log(
        "🚀 ~ file: CustomerOrderTab.jsx:60 ~ fetchCustomerOrders ~ error:",
        error
      );
    }
  };
  useEffect(() => {
    getFilteredURL();
  }, [selectValue, date, search]);
  const getFilteredURL = () => {
    let urlapi = "/api/CustomerTrips/dispatch-report?";

    let endpoint = "/api/CustomerTrips/dispatch-report-data?";
    let excelurl = "/api/CustomerTrips/dispatch-excel-report?";

    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (endpoint[endpoint.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
      endpoint += "From=" + date[0] + "&To=" + date[1];
      excelurl +=
        (excelurl[excelurl.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
    }
    fetchData(endpoint);
    setExcelUrl(excelurl);

    setUrl(urlapi);
  };
  return (
    <>
      <HeaderFilter
        date={date}
        dateChange={updateDates}
        dateExist
        print={true}
        onPrint={() =>
          handlePrint(
            url,
            `Dispatch-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        onExport={() =>
          handleExcel(
            excelUrl,
            `Dispatch-report-report-${formatDate(new Date())}.xlsx`,
            auth
          )
        }
      />
      <EnhancedTable rows={rows || []} headCells={headCells} loading={!data} />
    </>
  );
}
