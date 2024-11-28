import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate } from "../../../utils";
import UseFetchData from "../../../shared/useFetchData";

export default function OrderAcceptedTAB() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const getFilteredURL = () => {
    let urlapi = "api/CustomerOrders/status/setsVerified?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }
    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
    }
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
  ]);
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const auth = useContext(AuthContext);

  const headCells = [
    {
      id: "CustomerID",
      numeric: false,
      disablePadding: true,
      label: "CustomerID",
    },
    {
      id: "CustomerName",
      numeric: true,
      disablePadding: false,
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
      id: "ExpectedDeliveryDate",
      numeric: true,
      disablePadding: false,
      label: "Expected Delivery Date",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "OrderStatus",
      numeric: true,
      disablePadding: false,
      label: "Order Status",
    },
  ];

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      CustomerID: elem.user?.id,
      CustomerName: elem.user?.firstName + " " + elem.user?.lastName,
      OrderNumber: elem.id,
      Notes: " ",
      ExpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      Quantity: elem.quantity.toFixed(2),
      OrderStatus: elem.status?.name,
    };
  });

  return (
    <>
      <HeaderFilter
        date={date}
        dateChange={updateDates}
        dateExist
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Order Number Or Customer Name"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
    </>
  );
}
