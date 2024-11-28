import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import { AuthContext } from "../../../shared/authContext";
import useFetch from "../../../shared/useFetch";
import axios from "../../../api/axios";

export default function InventoryTab() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const auth = useContext(AuthContext);
  const [url, setUrl] = useState();
  const [excelUrl, setExcelUrl] = useState();

  const [data, setData] = useState();

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const headCells = [
    {
      id: "Type",
      numeric: false,
      disablePadding: true,
      label: "Type",
    },
    {
      id: "Category",
      numeric: true,
      disablePadding: false,
      label: "Category",
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
      id: "WareHouse",
      numeric: true,
      disablePadding: false,
      label: "WareHouse",
    },
    {
      id: "Zone",
      numeric: true,
      disablePadding: false,
      label: "Zone",
    },
    {
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      Type: elem.type,
      Category: elem.category,
      Product: elem.product,
      Quantity: elem.quantity.toFixed(2),
      WareHouse: elem.warehouse,
      Zone: elem.zone,
      Date: formatDate(elem.date),
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
    let urlapi = "/api/Voucher/inventory-report?";
    let endpoint = "api/Voucher/inventory-report-data?";
    let excelurl = "/api/Voucher/inventory-report-excel?";

    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
      endpoint +=
        (endpoint[endpoint.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
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
            `Inventory-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        onExport={() =>
          handleExcel(
            excelUrl,
            `Inventory-excel-report-${formatDate(new Date())}.xlsx`,
            auth
          )
        }
      />
      <EnhancedTable rows={rows || []} headCells={headCells} loading={!data} />
    </>
  );
}
