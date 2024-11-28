/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import AddTripModal from "../Modals/AddTripModal";
import { AuthContext } from "../../../shared/authContext";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";

export default function SoilRequestTAB() {
  const auth = useContext(AuthContext);

  const [error, setError] = useState();
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/ProductionOrders?";
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), []);

  const handleOpenModal = (id) => {
    setIsModalOpen(true);
    setSelectedId(id);
  };

  const Buttons = ({ id, title, handleOpenModal, className }) => {
    return (
      <IconButton
        onClick={() => handleOpenModal(id)}
        className="text-white bg-[#21C55D] hover:text-[#21C55D] hover:bg-white px-4   text-2xl"
      >
        {title}
      </IconButton>
    );
  };

  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "#ID",
    },
    {
      id: "ProductName",
      numeric: true,
      disablePadding: false,
      label: "ProductName",
    },
    {
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Straw",
      numeric: true,
      disablePadding: false,
      label: "Straw",
    },
    {
      id: "Water",
      numeric: true,
      disablePadding: false,
      label: "Water",
    },
    {
      id: "Soil",
      numeric: true,
      disablePadding: false,
      label: "Soil",
    },
    {
      id: "RemainingQuantity",
      numeric: true,
      disablePadding: false,
      label: "Remaining Quantity",
    },
    {
      id: "AddTrip",
      numeric: true,
      disablePadding: false,
      label: "Add Trip",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      ProductName: elem.product?.name,
      Date: formatDate(elem.productionDate),
      Quantity: elem.quantity.toFixed(2),
      Status: elem.status?.name,
      Straw: elem.neededStraw,
      Water: elem.neededWater,
      Soil: elem.neededSoil,
      RemainingQuantity: elem.remainingQuantity?.toFixed(2),
      AddTrip: (
        <Buttons id={elem.id} title={"+"} handleOpenModal={handleOpenModal} />
      ),
    };
  });
  const handleAddSnackBar = () => {
    setSnackMessage("Trip Added Successfully");
    setOpenSnackBar(true);
    setIsModalOpen(false);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  return (
    <>
      <HeaderFilter />
      <EnhancedTable rows={rows} headCells={headCells} loading={isLoading} />
      {isModalOpen && (
        <AddTripModal
          cancelFcn={() => setIsModalOpen(false)}
          saveFcn={handleAddSnackBar}
          closeModal={() => setIsModalOpen(false)}
          title={"Add Trip"}
          type={"Save"}
          withCancel={true}
          data={data.find(
            (elem) => elem.id.toString() === selectedId.toString()
          )}
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
