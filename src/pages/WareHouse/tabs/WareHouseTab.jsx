import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import useFetch from "../../../shared/useFetch";
import AddWareHouseModal from "../Modals/AddWareHouse";
import ViewWareHouseModal from "../Modals/ViewWareHouse";
import EditWareHouseModal from "../Modals/EditWareHouse";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { Snackbar, SnackbarContent } from "@mui/material";
import DeleteModal from "../../../components/DeleteModal";
import UseFetchData from "../../../shared/useFetchData";

export default function WareHouseTab() {
  const [search, setSearch] = useState();
  const [selectedId, setSelectedId] = useState();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const { data: locationList } = useFetch("locations");
  const { data: materialTypesList } = useFetch("itemtypes");
  const [error, setError] = useState();

  const getFilteredURL = () => {
    let urlapi = "api/warehouses?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const auth = useContext(AuthContext);

  const deleteWareHouse = async () => {
    try {
      await axios.delete(`api/warehouses/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return true;
    } catch (error) {
      setError(JSON.parse(error.request.response).title);

      return false;
    }
  };
  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };
  const handleOpenViewModal = (id) => {
    setSelectedId(id);
    setIsViewModalOpen(true);
  };
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const rows = data?.map((elem) => ({
    id: elem.id,
    WareHouseName: elem.name,
    StorageKeeperSupervisor: elem.storeKeeperName,
    MaterialType: elem.masterItemType,
    Location: elem.location,
    Address: elem.address,
  }));

  const headCells = [
    {
      id: "WareHouseName",
      numeric: false,
      disablePadding: true,
      label: "WareHouse Name",
    },
    {
      id: "StorageKeeperSupervisor",
      numeric: true,
      disablePadding: false,
      label: "Storage Keeper/Supervisor",
    },
    {
      id: "MaterialType",
      numeric: false,
      disablePadding: false,
      label: "Material Type",
    },
    {
      id: "Location",
      numeric: false,
      disablePadding: false,
      label: "Location",
    },
    {
      id: "Address",
      numeric: false,
      disablePadding: false,
      label: "Address",
    },
  ];
  const handleAddSnackBar = (message) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    setIsModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleUpdateSnackBar = (message) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    setIsEditModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const handleDeleteSnackBar = async (message) => {
    const isDeleted = await deleteWareHouse();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      setIsDeleteModalOpen(false);
      refetch();
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 2000);
    }
  };
  useEffect(() => {
    if (!isDeleteModalOpen) {
      setError(null);
    }
  }, [isDeleteModalOpen]);
  const horizontal = "center";
  const vertical = "top";
  return (
    <>
      <HeaderFilter
        button={"New"}
        buttonClick={() => setIsModalOpen(true)}
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Warehouse, StoreKeeper Or Location name"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["View", "Edit", "Delete"]}
        onEdit={handleOpenEditModal}
        onView={handleOpenViewModal}
        onDelete={handleOpenDeleteModal}
        loading={isLoading}
      />
      {isViewModalOpen && (
        <ViewWareHouseModal
          saveFcn={() => setIsViewModalOpen(false)}
          closeModal={() => setIsViewModalOpen(false)}
          type="Close"
          title="View Warehouse"
          data={data?.find((elem) => elem.id === selectedId)}
          locationList={locationList}
          materialTypesList={materialTypesList}
        />
      )}
      {isEditModalOpen && (
        <EditWareHouseModal
          withCancel={true}
          saveFcn={() => handleUpdateSnackBar("WareHouse Updated Successfully")}
          cancelFcn={() => setIsEditModalOpen(false)}
          closeModal={() => setIsEditModalOpen(false)}
          type="Edit"
          title="Edit Warehouse"
          data={data?.find((elem) => elem.id === selectedId)}
          locationList={locationList}
          materialTypesList={materialTypesList}
        />
      )}

      {isModalOpen && (
        <AddWareHouseModal
          saveFcn={() =>
            handleAddSnackBar(
              "WareHouse Added Successfully",
              setIsModalOpen(false)
            )
          }
          withCancel
          cancelFcn={() => setIsModalOpen(false)}
          closeModal={() => setIsModalOpen(false)}
          type="Add"
          title="Add a Warehouse"
          locationList={locationList}
          materialTypesList={materialTypesList}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("WareHouse Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete WareHouse"}
          type={"Yes"}
          withCancel={true}
          error={error}
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
