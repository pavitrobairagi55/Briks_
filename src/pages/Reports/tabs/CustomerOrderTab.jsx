import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import useFetch from "../../../shared/useFetch";
import { formatDate, handlePrint } from "../../../utils";
import { IconButton } from "@mui/material";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import DetailsModal from "../Modals/DetailsModal";

export default function CustomerOrderTab() {
  const auth = useContext(AuthContext);

  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [selectedId, setSelectedId] = useState();
  const [url, setUrl] = useState();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [customerOrders, setCustomerOrders] = useState();

  const statusList = [
    { id: "Pending", value: "Pending" },
    { id: "InProgress", value: "InProgress" },
    { id: "Rejected", value: "Rejected" },
  ];

  const handleOpenDetailsModal = (id) => {
    setSelectedId(id);
    setIsDetailsModalOpen(true);
  };
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const fetchCustomerOrders = async (endpoint) => {
    try {
      const response = await axios.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setCustomerOrders(response.data.data || response.data);
    } catch (error) {
      console.log(
        "🚀 ~ file: CustomerOrderTab.jsx:60 ~ fetchCustomerOrders ~ error:",
        error
      );
    }
  };

  const headCells = [
    {
      id: "COID",
      numeric: false,
      disablePadding: true,
      label: "CO ID",
    },
    {
      id: "CustomerName",
      numeric: true,
      disablePadding: false,
      label: "Customer Name",
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
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },

    {
      id: "Details",
      numeric: true,
      disablePadding: false,
      label: "Trip Details",
    },
  ];
  const ButtonsDetails = ({ id }) => {
    return (
      <IconButton
        onClick={() => handleOpenDetailsModal(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm"
      >
        Details
      </IconButton>
    );
  };
  useEffect(() => {
    getFilteredURL();
  }, [selectValue, date, search]);
  const getFilteredURL = () => {
    let urlapi = "/api/CustomerOrders/report?";
    let endpoint = "api/CustomerOrders/report-data?";
    if (selectValue?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "status=" +
        selectValue;
      endpoint +=
        (endpoint[endpoint.length - 1] === "?" ? "" : "&") +
        "status=" +
        selectValue;
    }
    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "customerName=" +
        search;
      endpoint +=
        (endpoint[endpoint.length - 1] === "?" ? "" : "&") +
        "customerName=" +
        search;
    }
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
    }
    fetchCustomerOrders(endpoint);
    setUrl(urlapi);
  };
  const rows = customerOrders?.map((elem) => {
    return {
      id: elem.id,
      COID: elem.id,
      CustomerName: elem.customerName,
      Product: elem.product,
      Category: elem.productCategory,
      Quantity: elem.quantity.toFixed(2),
      Date: formatDate(elem.date),
      Status: elem.status,
      Details: <ButtonsDetails id={elem.id} />,
    };
  });
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        selectExists
        selectValue={selectValue}
        date={date}
        dateChange={updateDates}
        dateExist
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={statusList}
        print={true}
        onPrint={() =>
          handlePrint(
            url,
            `CustomerOrderReport-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        /* export={true}
        onExport={() => console.log("ppp")} */
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={!customerOrders}
      />
      {isDetailsModalOpen && (
        <DetailsModal
          cancelFcn={() => setIsDetailsModalOpen(false)}
          saveFcn={() => setIsDetailsModalOpen(false)}
          closeModal={() => setIsDetailsModalOpen(false)}
          title={"Details"}
          type={"Close"}
          withCancel={false}
          data={rows?.find((elem) => elem.id === selectedId)}
        />
      )}
    </>
  );
}
