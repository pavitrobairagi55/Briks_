import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import { Snackbar, SnackbarContent } from "@mui/material";
import EditProductionOrderModal from "../Modals/EditProductionOrderModal";
import DeleteModal from "../../../components/DeleteModal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function ProductionBricksRequestsTAB() {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();

  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getFilteredURL = () => {
    let urlapi = "api/BricksProductionOrder?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "Search=" + search;
    }
    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
    }
    if (selectValue?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "Status=" +
        selectValue;
    }
    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
    selectValue,
  ]);
  const horizontal = "center";
  const vertical = "top";
  const statusList = [
    { id: "Pending", value: "Pending" },
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
  ];
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "BricksType",
      numeric: false,
      disablePadding: true,
      label: "Bricks Type",
    },
    {
      id: "FermintationRequest",
      numeric: false,
      disablePadding: false,
      label: "Fermintation Request",
    },
    {
      id: "BricksQty",
      numeric: false,
      disablePadding: false,
      label: "Bricks Qty",
    },
    {
      id: "MoldingArea",
      numeric: true,
      disablePadding: false,
      label: "Molding Area",
    },
    {
      id: "MudStock",
      numeric: true,
      disablePadding: false,
      label: "Mud Stock",
    },
    {
      id: "ProductionDate",
      numeric: true,
      disablePadding: false,
      label: "Production Date",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      BricksType: elem.bricksType.name,
      FermintationRequest: elem.fermentationRequest.id,
      BricksQty: elem.bricksQuantity,
      MoldingArea: elem.moldingArea.name,
      MudStock: elem.mudStockPan,
      ProductionDate: formatDate(elem.prodcutionOrderDate),
    };
  });
  const handleOpenDeleteodal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const handleOpenEditeodal = (id) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };
  const handleOpenVieweodal = (id) => {
    setSelectedId(id);
    setIsViewModalOpen(true);
  };
  const handleSubmitEditModal = () => {
    setSnackMessage("Updated Successfully");
    setOpenSnackBar(true);
    setIsEditModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleCloseDeleteModal = () => {
    setError(null);
    setIsDeleteModalOpen(false);
  };
  const deleteRequest = async () => {
    try {
      await axios.delete(`api/BricksProductionOrder/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return true;
    } catch (error) {
      setError(error.response?.data);

      return false;
    }
  };
  const handleDeleteSnackBar = async (
    message,
    deleteFCN,
    closeFCN,
    refetchFCN
  ) => {
    const isDeleted = await deleteFCN();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      closeFCN(false);
      refetchFCN();
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 2000);
    }
  };
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        date={date}
        dateChange={updateDates}
        dateExist
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["View", "Edit", "Delete"]}
        loading={isLoading}
        onEdit={handleOpenEditeodal}
        onView={handleOpenVieweodal}
        onDelete={handleOpenDeleteodal}
      />

      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Item Deleted Successfully!",
              deleteRequest,
              handleCloseDeleteModal,
              refetch
            )
          }
          closeModal={handleCloseDeleteModal}
          title={"Delete Item"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}
      {isEditModalOpen && (
        <EditProductionOrderModal
          title="Edit"
          withCancel
          cancelFcn={() => setIsEditModalOpen(false)}
          type="Edit"
          closeModal={() => setIsEditModalOpen(false)}
          saveFcn={handleSubmitEditModal}
          Editable={true}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isViewModalOpen && (
        <EditProductionOrderModal
          title="View"
          withCancel={false}
          cancelFcn={() => setIsViewModalOpen(false)}
          type="Close"
          closeModal={() => setIsViewModalOpen(false)}
          saveFcn={() => setIsViewModalOpen(false)}
          Editable={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}

      {openSnackBar && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={() => setOpenSnackBar(false)}
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
