import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate } from "../../../utils";
import UseFetchData from "../../../shared/useFetchData";

export default function RejectedCustomerOderTAB() {
  const [search, setSearch] = useState();
  const getFilteredURL = () => {
    let urlapi = "/api/CustomerOrders/status/rejected?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }
    return urlapi;
  };
  const { isLoading, data } = UseFetchData(getFilteredURL(), [search]);

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      CONumber: elem.id,
      Notes: elem.setsRejectionNote,
      Product: elem.product?.name,
      EpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      CreatedDate: formatDate(elem.createdDate),
      Quantity: elem.quantity.toFixed(2),
      OrderStatus: elem.status.name,
    };
  });

  const headCells = [
    {
      id: "CONumber",
      numeric: false,
      disablePadding: true,
      label: "CO Number",
    },
    {
      id: "Notes",
      numeric: true,
      disablePadding: false,
      label: "Notes",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "EpectedDeliveryDate",
      numeric: true,
      disablePadding: false,
      label: "Expected Delivery Date",
    },
    {
      id: "CreatedDate",
      numeric: true,
      disablePadding: false,
      label: "Created Date",
    },

    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "OrderStatus",
      numeric: false,
      disablePadding: false,
      label: "Order Status",
    },
  ];

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Order Number"}
      />
      <EnhancedTable
        headCells={headCells}
        rows={rows || []}
        loading={isLoading}
      />
    </>
  );
}
