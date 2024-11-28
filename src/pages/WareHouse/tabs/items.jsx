import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import DeleteModal from "../../../components/DeleteModal";
import EditItem from "../Modals/EditItem";
import useFetch from "../../../shared/useFetch";
import AddItem from "../Modals/AddItem";
import { Snackbar, SnackbarContent } from "@mui/material";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import UseFetchData from "../../../shared/useFetchData";

export default function ItemsTab() {
  const [search, setSearch] = useState();

  const [selectedId, setSelectedId] = useState();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setisViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useContext(AuthContext);

  const { data: itemTypes } = useFetch("itemtypes");
  const { data: unitsList } = useFetch("units");
  const { data: wareHouseList } = useFetch("warehouses");
  const getFilteredURL = () => {
    let urlapi = "api/items?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const [error, setError] = useState();

  const horizontal = "center";
  const vertical = "top";

  const handleSnackBar = (message, handleSaveFCN, refetchFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    handleSaveFCN(false);
    refetchFCN();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const headCells = [
    {
      id: "ProductCategory",
      numeric: false,
      disablePadding: true,
      label: "Product Category",
    },
    {
      id: "ItemStorageWarehouse",
      numeric: true,
      disablePadding: false,
      label: "Item-Storage Warehouse",
    },
    {
      id: "ItemType",
      numeric: false,
      disablePadding: false,
      label: "Item Type",
    },
  ];
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setisDeleteModalOpen(true);
  };
  const deleteItem = async () => {
    try {
      await axios.delete(`api/items/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return true;
    } catch (error) {
      console.log("🚀 ~ file: items.jsx:71 ~ deleteItem ~ error:", error);
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
    setisViewModalOpen(true);
  };

  const handleDeleteSnackBar = async (message) => {
    const isDeleted = await deleteItem();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      setisDeleteModalOpen(false);
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

  const row = data?.map((elem) => {
    return {
      id: elem.id,
      ProductCategory: elem.name,
      ItemStorageWarehouse: elem.warehouseName,
      ItemType: elem.itemType,
    };
  });

  const fetchData = async (urlapi) => {
    setIsLoading(true);
    try {
      const response = await axios.get(urlapi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.log("🚀 ~ file: WareHouseTab.jsx:40 ~ fetchData ~ error:", error);
    }
    setIsLoading(false);
  };
  return (
    <>
      <HeaderFilter
        button={"New"}
        buttonClick={() => setIsModalOpen(true)}
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Item Name Or Warehouse Name"}
      />
      <EnhancedTable
        onEdit={handleOpenEditModal}
        rows={row || []}
        headCells={headCells}
        toolbar={["View", "Edit", "Delete"]}
        onView={handleOpenViewModal}
        onDelete={handleOpenDeleteModal}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddItem
          saveFcn={() =>
            handleSnackBar("Item Added Successfully!", setIsModalOpen, refetch)
          }
          cancelFcn={() => setIsModalOpen(false)}
          closeModal={() => setIsModalOpen(false)}
          type="Save"
          withCancel={true}
          title="Add Product Category"
          itemTypes={itemTypes}
          wareHouseList={wareHouseList}
          unitsList={unitsList}
        />
      )}
      {isViewModalOpen && (
        <EditItem
          saveFcn={() => setisViewModalOpen(false)}
          cancelFcn={() => setisViewModalOpen(false)}
          closeModal={() => setisViewModalOpen(false)}
          type="Close"
          withCancel={false}
          title="View Product Category"
          itemTypes={itemTypes}
          wareHouseList={wareHouseList}
          unitsList={unitsList}
          selectedId={selectedId}
          editable={false}
        />
      )}
      {isEditModalOpen && (
        <EditItem
          saveFcn={() =>
            handleSnackBar(
              "Item Updated Successfully!",
              setIsEditModalOpen,
              refetch
            )
          }
          cancelFcn={() => setIsEditModalOpen(false)}
          closeModal={() => setIsEditModalOpen(false)}
          type="Save"
          withCancel={true}
          title="Edit Product Category"
          itemTypes={itemTypes}
          wareHouseList={wareHouseList}
          unitsList={unitsList}
          selectedId={selectedId}
          editable={true}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={() => setisDeleteModalOpen(false)}
          saveFcn={() => handleDeleteSnackBar("Item Deleted Successfully")}
          closeModal={() => {
            setisDeleteModalOpen(false);
            setError(null);
          }}
          title={"Delete Item"}
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
