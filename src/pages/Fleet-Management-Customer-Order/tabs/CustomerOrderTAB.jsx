import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate } from "../../../utils";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import AddTripModal from "../Modals/AddTripModal";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";

export default function CustomerOrderTAB() {
  const auth = useContext(AuthContext);

  const [search, setSearch] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "/api/CustomerOrders?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const horizontal = "center";
  const vertical = "top";
  const handleOpenModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddSnackBar = () => {
    setSnackMessage("Trip Added Successfully");
    setOpenSnackBar(true);
    handleCloseModal();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const Buttons = ({ id, title, handleOpenModal }) => {
    return (
      <IconButton
        onClick={() => handleOpenModal(id)}
        className="text-white bg-[#21C55D] hover:text-[#21C55D] hover:bg-white px-4   text-2xl"
      >
        {title}
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      CustomerName: elem?.user?.firstName + " " + elem?.user?.lastName,
      CONumber: elem.id,
      Product: elem.product?.name,
      EpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      RequestedQuantity: elem.quantity.toFixed(2),
      ApprovedQuantity: elem.approvedQuantity.toFixed(2),
      RemainingQuantity: elem.remainingQuantity?.toFixed(2),
      OrderStatus: elem.status?.name,
      AddTrips: (
        <Buttons id={elem.id} title={"+"} handleOpenModal={handleOpenModal} />
      ),
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
      id: "CustomerName",
      numeric: false,
      disablePadding: true,
      label: "Customer Name",
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
      id: "RequestedQuantity",
      numeric: true,
      disablePadding: false,
      label: "Requested Quantity",
    },
    {
      id: "ApprovedQuantity",
      numeric: true,
      disablePadding: false,
      label: "Approved Quantity",
    },
    {
      id: "RemainingQuantity",
      numeric: true,
      disablePadding: false,
      label: "Remaining Quantity",
    },
    {
      id: "OrderStatus",
      numeric: false,
      disablePadding: false,
      label: "Order Status",
    },
    {
      id: "AddTrips",
      numeric: false,
      disablePadding: false,
      label: "Add Trips",
    },
  ];
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Order Number or Product Name"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddTripModal
          cancelFcn={handleCloseModal}
          saveFcn={handleAddSnackBar}
          closeModal={handleCloseModal}
          title={"Add Trip"}
          type={"Save"}
          withCancel={true}
          id={selectedId}
          expectedDate={
            data.find((elem) => elem.id === selectedId)?.expectedDeliveryDate
          }
        />
      )}
      {openSnackBar && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={() => false}
          key={vertical + horizontal}
        >
          <SnackbarContent
            style={{ backgroundColor: "green" }}
            message={<span>{snackMessage}</span>}
          />
        </Snackbar>
      )}
    </>
  );
}
