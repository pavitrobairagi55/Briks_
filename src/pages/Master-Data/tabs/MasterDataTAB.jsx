import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import AddUnitMasterModal from "../Modals/AddUnitMasterModal";
import AddLocationMasterModal from "../Modals/AddLocationMasterModal";
import AddRoleMasterModal from "../Modals/AddRoleMasterModal";
import AddTonToQbmMasterModal from "../Modals/AddTonToQbmMasterModal";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { Snackbar, SnackbarContent } from "@mui/material";
import EditUnitMasterModal from "../Modals/EditUnitMasterModal";
import DeleteModal from "../../../components/DeleteModal";
import EditLocationMasterModal from "../Modals/EditLocationMasterModal";
import EditRoleMasterModal from "../Modals/EditRoleMasterModal";
import EditCustomerOrderStatusModal from "../Modals/EditCustomerOrderStatusModal";
import EditCustomerOrderTripStatusModal from "../Modals/EditCustomerOrderTripStatusModal";
import EditTripStatusModal from "../Modals/EditTripStatusModal";

export default function MasterDataTAB() {
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState();
  const [selectValue, setSelectValue] = useState();
  const [unitsList, setUnitsList] = useState();
  const [locationsList, setLocationsList] = useState();
  const [rolesList, setRolesList] = useState();
  const [itemsList, setItemsList] = useState();
  const [customerOrderStatusList, setCustomerOrderStatusList] = useState();
  const [customerOrderTripStatusList, setCustomerOrderTripStatusList] =
    useState();
  const [tripStatusList, setTripStatusList] = useState();
  const [error, setError] = useState();

  const [isAddUnitMasterModalOpen, setIsAddUnitMasterModalOpen] =
    useState(false);
  const [isEditUnitMasterModalOpen, setIsEditUnitMasterModalOpen] =
    useState(false);
  const [isViewUnitMasterModalOpen, setIsViewUnitMasterModalOpen] =
    useState(false);
  const [isDeleteUnitMasterModalOpen, setIsDeleteUnitMasterModalOpen] =
    useState(false);
  const [isEditLocationMasterModalOpen, setIsEditLocationMasterModalOpen] =
    useState(false);
  const [isViewLocationMasterModalOpen, setIsViewLocationMasterModalOpen] =
    useState(false);
  const [isDeleteLocationMasterModalOpen, setIsDeleteLocationMasterModalOpen] =
    useState(false);

  const [isAddLocationMasterModalOpen, setIsAddLocationMasterModalOpen] =
    useState(false);
  const [isAddRoleMasterModalOpen, setIsAddRoleMasterModalOpen] =
    useState(false);
  const [isEditRoleMasterModalOpen, setIsEditRoleMasterModalOpen] =
    useState(false);
  const [isViewRoleMasterModalOpen, setIsViewRoleMasterModalOpen] =
    useState(false);
  const [
    isEditCustomerOrderStatusModalOpen,
    setIsEditCustomerOrderStatusModalOpen,
  ] = useState(false);
  const [
    isViewCustomerOrderStatusModalOpen,
    setIsViewCustomerOrderStatusModalOpen,
  ] = useState(false);
  const [
    isEditCustomerOrderTripStatusModalOpen,
    setIsEditCustomerOrderTripStatusModalOpen,
  ] = useState(false);
  const [
    isViewCustomerOrderTripStatusModalOpen,
    setIsViewCustomerOrderTripStatusModalOpen,
  ] = useState(false);
  const [isEditTripStatusModalOpen, setIsEditTripStatusModalOpen] =
    useState(false);
  const [isViewTripStatusModalOpen, setIsViewTripStatusModalOpen] =
    useState(false);
  const [isDeleteRoleMasterModalOpen, setIsDeleteRoleMasterModalOpen] =
    useState(false);
  const [isAddTonToQbmMasterModalOpen, setIsAddTonToQbmMasterModalpen] =
    useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const optionsList = [
    { id: "UNIT", value: "Unit Master" },
    { id: "LOCATION", value: "Location Master" },
    /* { id: "ROLES", value: "Role Master" },
    { id: "ITEMS", value: "Item Types(Raw, Finished)" },
    { id: "CUSTOMER_ORDER_STATUS", value: "Customer Order Status" },
    { id: "CUSTOMER_ORDER_TRIP_STATUS", value: "Cusomter Order Trip Status" },
    { id: "TRIP_STATUS", value: "Trip Status Master" }, */
  ];
  const withoutAddList = [
    "ITEMS",
    "CUSTOMER_ORDER_STATUS",
    "CUSTOMER_ORDER_TRIP_STATUS",
    "TRIP_STATUS",
  ];
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const horizontal = "center";
  const vertical = "top";

  useEffect(() => {
    if (selectValue === "UNIT") {
      fetchUnits();
    } else if (selectValue === "LOCATION") {
      fetchLocations();
    } else if (selectValue === "ROLES") {
      fetchRoles();
    } else if (selectValue === "ITEMS") {
      fetchItems();
    } else if (selectValue === "CUSTOMER_ORDER_STATUS") {
      fetchCustomerOrderStatus();
    } else if (selectValue === "CUSTOMER_ORDER_TRIP_STATUS") {
      fetchCustomerOrderTripStatus();
    } else if (selectValue === "TRIP_STATUS") {
      fetchTripStatus();
    }
  }, [selectValue, search]);

  const fetchUnits = async () => {
    try {
      let urlapi = "api/units?";

      if (search?.length) {
        urlapi +=
          (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
      }
      const response = await axios.get(urlapi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setUnitsList(response.data);
    } catch (error) {
      setUnitsList([]);
    }
  };
  useEffect(() => {
    setSearch("");
  }, [selectValue]);
  const unitsRows = unitsList?.map((elem) => {
    return {
      id: elem.id,
      Name: elem.name,
    };
  });
  const unitsHeadCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
  ];

  const fetchLocations = async () => {
    try {
      let urlapi = "api/locations?";

      if (search?.length) {
        urlapi +=
          (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
      }
      const response = await axios.get(urlapi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setLocationsList(response.data);
    } catch (error) {
      setLocationsList([]);
    }
  };

  const locationsRows = locationsList?.map((elem) => {
    return {
      id: elem.id,
      Name: elem.name,
    };
  });
  const locationsHeadCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
  ];
  const fetchRoles = async () => {
    try {
      const response = await axios.get("api/role", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setRolesList(response.data);
    } catch (error) {
      setRolesList([]);
    }
  };
  const rolesRows = rolesList?.map((elem) => {
    return {
      id: elem.id,
      Name: elem.name,
    };
  });
  const rolesHeadCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
  ];
  const fetchItems = async () => {
    try {
      const response = await axios.get("api/itemtypes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setItemsList(response.data);
    } catch (error) {
      setItemsList([]);
    }
  };
  const itemsRows = itemsList?.map((elem) => {
    return {
      id: elem.id,
      Name: elem.name,
    };
  });
  const itemsHeadCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
  ];
  const fetchCustomerOrderStatus = async () => {
    try {
      const response = await axios.get("api/CustomerOrderStatus", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setCustomerOrderStatusList(response.data);
    } catch (error) {
      setCustomerOrderStatusList([]);
    }
  };
  const customerOrderStatusRows = customerOrderStatusList?.map((elem) => {
    return {
      id: elem.id,
      Name: elem.name,
    };
  });
  const customerOrderStatusHeadCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
  ];
  const fetchCustomerOrderTripStatus = async () => {
    try {
      const response = await axios.get("api/CustomerOrderTripStatus", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setCustomerOrderTripStatusList(response.data);
    } catch (error) {
      setCustomerOrderTripStatusList([]);
    }
  };
  const customerOrderTripStatusRows = customerOrderTripStatusList?.map(
    (elem) => {
      return {
        id: elem.id,
        Name: elem.name,
        Color: <span className={"text-[" + elem.color + "]"}>{elem.name}</span>,
      };
    }
  );

  const customerOrderTripStatusHeadCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "Color",
      numeric: false,
      disablePadding: true,
      label: "Color",
    },
  ];
  const fetchTripStatus = async () => {
    try {
      const response = await axios.get("api/TripStatus", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setTripStatusList(response.data);
    } catch (error) {
      setTripStatusList([]);
    }
  };
  const tripStatusRows = tripStatusList?.map((elem) => {
    return {
      id: elem.id,
      Name: elem.name,
      Color: <span className={"text-[" + elem.color + "]"}>{elem.name}</span>,
    };
  });

  const tripStatusHeadCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "Color",
      numeric: false,
      disablePadding: true,
      label: "Color",
    },
  ];

  const handleOpenViewUnitModal = (id) => {
    setSelectedId(id);
    setIsViewUnitMasterModalOpen(true);
  };
  const handleOpenEditUnitModal = (id) => {
    setSelectedId(id);
    setIsEditUnitMasterModalOpen(true);
  };
  const handleOpenDeleteUnitModal = (id) => {
    setSelectedId(id);
    setIsDeleteUnitMasterModalOpen(true);
  };
  const handleOpenViewRoleModal = (id) => {
    setSelectedId(id);
    setIsViewRoleMasterModalOpen(true);
  };
  const handleOpenEditRoleModal = (id) => {
    setSelectedId(id);
    setIsEditRoleMasterModalOpen(true);
  };
  const handleOpenDeleteRoleModal = (id) => {
    setSelectedId(id);
    setIsDeleteRoleMasterModalOpen(true);
  };
  const handleOpenViewLocationModal = (id) => {
    setSelectedId(id);
    setIsViewLocationMasterModalOpen(true);
  };
  const handleOpenEditLocationModal = (id) => {
    setSelectedId(id);
    setIsEditLocationMasterModalOpen(true);
  };
  const handleOpenDeleteLocationModal = (id) => {
    setSelectedId(id);
    setIsDeleteLocationMasterModalOpen(true);
  };
  const handleOpenViewCustomerOrderStatusModal = (id) => {
    setSelectedId(id);
    setIsViewCustomerOrderStatusModalOpen(true);
  };
  const handleOpenEditCustomerOrderStatusModal = (id) => {
    setSelectedId(id);
    setIsEditCustomerOrderStatusModalOpen(true);
  };
  const handleOpenViewCustomerOrderTripStatusModal = (id) => {
    setSelectedId(id);
    setIsViewCustomerOrderTripStatusModalOpen(true);
  };
  const handleOpenEditCustomerOrderTripStatusModal = (id) => {
    setSelectedId(id);
    setIsEditCustomerOrderTripStatusModalOpen(true);
  };
  const handleOpenViewTripStatusModal = (id) => {
    setSelectedId(id);
    setIsViewTripStatusModalOpen(true);
  };
  const handleOpenEditTripStatusModal = (id) => {
    setSelectedId(id);
    setIsEditTripStatusModalOpen(true);
  };

  const handleSnackBar = (message, handleSaveFCN, refetchFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    handleSaveFCN(false);
    refetchFCN();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const deleteUnit = async () => {
    try {
      await axios.delete(`api/units/${selectedId}`, {
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
  const deleteLocation = async () => {
    try {
      await axios.delete(`api/locations/${selectedId}`, {
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

  useEffect(() => {
    if (!isDeleteUnitMasterModalOpen) {
      setError(null);
    }
    if (!isDeleteLocationMasterModalOpen) {
      setError(null);
    }
  }, [
    isDeleteUnitMasterModalOpen,
    isDeleteLocationMasterModalOpen,
    isDeleteRoleMasterModalOpen,
  ]);

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        selectExists
        selectValue={selectValue}
        selectOptions={optionsList}
        searchPlaceHolder={"Name"}
        selectChange={(val) => setSelectValue(val.target.value)}
        button={!withoutAddList.includes(selectValue) ? "New" : null}
        buttonClick={() =>
          selectValue === "UNIT"
            ? setIsAddUnitMasterModalOpen(true)
            : selectValue === "LOCATION"
            ? setIsAddLocationMasterModalOpen(true)
            : selectValue === "ROLES"
            ? setIsAddRoleMasterModalOpen(true)
            : null
        }
      />
      {/* Unit modals  */}
      {selectValue === "UNIT" && (
        <EnhancedTable
          rows={unitsRows || []}
          headCells={unitsHeadCells}
          toolbar={["View", "Edit", "Delete"]}
          onEdit={handleOpenEditUnitModal}
          onView={handleOpenViewUnitModal}
          onDelete={handleOpenDeleteUnitModal}
          loading={!unitsList}
        />
      )}

      {isAddUnitMasterModalOpen && (
        <AddUnitMasterModal
          saveFcn={() =>
            handleSnackBar(
              "Unit Added Successfully!",
              setIsAddUnitMasterModalOpen,
              fetchUnits
            )
          }
          withCancel
          cancelFcn={() => setIsAddUnitMasterModalOpen(false)}
          closeModal={() => setIsAddUnitMasterModalOpen(false)}
          type="Save"
          title="Add a Unit "
        />
      )}
      {isViewUnitMasterModalOpen && (
        <EditUnitMasterModal
          saveFcn={() => setIsViewUnitMasterModalOpen(false)}
          withCancel={false}
          cancelFcn={() => setIsViewUnitMasterModalOpen(false)}
          closeModal={() => setIsViewUnitMasterModalOpen(false)}
          type="Close"
          title="View"
          data={unitsList?.find((elem) => elem.id === selectedId)}
          editable={false}
        />
      )}
      {isEditUnitMasterModalOpen && (
        <EditUnitMasterModal
          saveFcn={() =>
            handleSnackBar(
              "Unit Updated Successfully!",
              setIsEditUnitMasterModalOpen,
              fetchUnits
            )
          }
          withCancel
          cancelFcn={() => setIsEditUnitMasterModalOpen(false)}
          closeModal={() => setIsEditUnitMasterModalOpen(false)}
          type="Save"
          title="Edit a Unit "
          data={unitsList?.find((elem) => elem.id === selectedId)}
          editable={true}
        />
      )}
      {isDeleteUnitMasterModalOpen && (
        <DeleteModal
          cancelFcn={() => setIsDeleteUnitMasterModalOpen(false)}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Unit Deleted Successfully!",
              deleteUnit,
              setIsDeleteUnitMasterModalOpen,
              fetchUnits
            )
          }
          closeModal={() => setIsDeleteUnitMasterModalOpen(false)}
          title={"Delete Unit"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}
      {/* Unit modals  */}
      {/* location modals */}
      {selectValue === "LOCATION" && (
        <EnhancedTable
          rows={locationsRows || []}
          headCells={locationsHeadCells}
          toolbar={["View", "Edit", "Delete"]}
          onEdit={handleOpenEditLocationModal}
          onView={handleOpenViewLocationModal}
          onDelete={handleOpenDeleteLocationModal}
          loading={!locationsList}
        />
      )}
      {isAddLocationMasterModalOpen && (
        <AddLocationMasterModal
          saveFcn={() =>
            handleSnackBar(
              "Location Added Successfully!",
              setIsAddLocationMasterModalOpen,
              fetchLocations
            )
          }
          withCancel
          cancelFcn={() => setIsAddLocationMasterModalOpen(false)}
          closeModal={() => setIsAddLocationMasterModalOpen(false)}
          type="Save"
          title="Add Location Master"
        />
      )}
      {isViewLocationMasterModalOpen && (
        <EditLocationMasterModal
          saveFcn={() => setIsViewLocationMasterModalOpen(false)}
          withCancel={false}
          cancelFcn={() => setIsViewLocationMasterModalOpen(false)}
          closeModal={() => setIsViewLocationMasterModalOpen(false)}
          type="Close"
          title="View"
          data={locationsList?.find((elem) => elem.id === selectedId)}
          editable={false}
        />
      )}
      {isEditLocationMasterModalOpen && (
        <EditLocationMasterModal
          saveFcn={() =>
            handleSnackBar(
              "Location Updated Successfully!",
              setIsEditLocationMasterModalOpen,
              fetchLocations
            )
          }
          withCancel
          cancelFcn={() => setIsEditLocationMasterModalOpen(false)}
          closeModal={() => setIsEditLocationMasterModalOpen(false)}
          type="Save"
          title="Edit a Location "
          data={locationsList?.find((elem) => elem.id === selectedId)}
          editable={true}
        />
      )}
      {isDeleteLocationMasterModalOpen && (
        <DeleteModal
          cancelFcn={() => setIsDeleteLocationMasterModalOpen(false)}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Location Deleted Successfully!",
              deleteLocation,
              setIsDeleteLocationMasterModalOpen,
              fetchLocations
            )
          }
          closeModal={() => setIsDeleteLocationMasterModalOpen(false)}
          title={"Delete Location"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}

      {/* location modals */}
      {/* Roles modals */}

      {selectValue === "ROLES" && (
        <EnhancedTable
          rows={rolesRows || []}
          headCells={rolesHeadCells}
          toolbar={["View", "Edit", "Delete"]}
          onEdit={handleOpenEditRoleModal}
          onView={handleOpenViewRoleModal}
          onDelete={handleOpenDeleteRoleModal}
          loading={!rolesList}
        />
      )}
      {isAddRoleMasterModalOpen && (
        <AddRoleMasterModal
          saveFcn={() => setIsAddRoleMasterModalOpen(false)}
          withCancel
          cancelFcn={() => setIsAddRoleMasterModalOpen(false)}
          closeModal={() => setIsAddRoleMasterModalOpen(false)}
          type="Save"
          title="Add Role Master"
        />
      )}
      {isViewRoleMasterModalOpen && (
        <EditRoleMasterModal
          saveFcn={() => setIsViewRoleMasterModalOpen(false)}
          withCancel={false}
          cancelFcn={() => setIsViewRoleMasterModalOpen(false)}
          closeModal={() => setIsViewRoleMasterModalOpen(false)}
          type="Close"
          title="View"
          data={rolesList?.find((elem) => elem.id === selectedId)}
          editable={false}
        />
      )}
      {isEditRoleMasterModalOpen && (
        <EditRoleMasterModal
          saveFcn={() =>
            handleSnackBar(
              "Role Updated Successfully!",
              setIsEditRoleMasterModalOpen,
              fetchRoles
            )
          }
          withCancel
          cancelFcn={() => setIsEditRoleMasterModalOpen(false)}
          closeModal={() => setIsEditRoleMasterModalOpen(false)}
          type="Save"
          title="Edit a Role "
          data={rolesList?.find((elem) => elem.id === selectedId)}
          editable={true}
        />
      )}
      {isDeleteRoleMasterModalOpen && (
        <DeleteModal
          cancelFcn={() => setIsDeleteRoleMasterModalOpen(false)}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Role Deleted Successfully!",
              deleteRole,
              setIsDeleteRoleMasterModalOpen,
              fetchRoles
            )
          }
          closeModal={() => setIsDeleteRoleMasterModalOpen(false)}
          title={"Delete Role"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}

      {/* Roles modals */}
      {/* Items modals */}
      {selectValue === "ITEMS" && (
        <EnhancedTable
          rows={itemsRows || []}
          headCells={itemsHeadCells}
          toolbar={["View", "Edit"]}
          onEdit={handleOpenEditRoleModal}
          onView={handleOpenViewRoleModal}
          loading={!itemsList}
        />
      )}
      {isViewRoleMasterModalOpen && (
        <EditRoleMasterModal
          saveFcn={() => setIsViewRoleMasterModalOpen(false)}
          withCancel={false}
          cancelFcn={() => setIsViewRoleMasterModalOpen(false)}
          closeModal={() => setIsViewRoleMasterModalOpen(false)}
          type="Close"
          title="View"
          data={rolesList?.find((elem) => elem.id === selectedId)}
          editable={false}
        />
      )}
      {isEditRoleMasterModalOpen && (
        <EditRoleMasterModal
          saveFcn={() =>
            handleSnackBar(
              "Role Updated Successfully!",
              setIsEditRoleMasterModalOpen,
              fetchRoles
            )
          }
          withCancel
          cancelFcn={() => setIsEditRoleMasterModalOpen(false)}
          closeModal={() => setIsEditRoleMasterModalOpen(false)}
          type="Save"
          title="Edit an Item"
          data={rolesList?.find((elem) => elem.id === selectedId)}
          editable={true}
        />
      )}
      {/* Items modals */}

      {/* CUSTOMER_ORDER_STATUS modals */}
      {selectValue === "CUSTOMER_ORDER_STATUS" && (
        <EnhancedTable
          rows={customerOrderStatusRows || []}
          headCells={customerOrderStatusHeadCells}
          toolbar={["View", "Edit"]}
          onEdit={handleOpenEditCustomerOrderStatusModal}
          onView={handleOpenViewCustomerOrderStatusModal}
          loading={!customerOrderStatusList}
        />
      )}
      {isViewCustomerOrderStatusModalOpen && (
        <EditCustomerOrderStatusModal
          saveFcn={() => setIsViewCustomerOrderStatusModalOpen(false)}
          withCancel={false}
          cancelFcn={() => setIsViewCustomerOrderStatusModalOpen(false)}
          closeModal={() => setIsViewCustomerOrderStatusModalOpen(false)}
          type="Close"
          title="View"
          data={rolesList?.find((elem) => elem.id === selectedId)}
          editable={false}
        />
      )}
      {isEditCustomerOrderStatusModalOpen && (
        <EditCustomerOrderStatusModal
          saveFcn={() =>
            handleSnackBar(
              "Status Updated Successfully!",
              setIsEditCustomerOrderStatusModalOpen,
              fetchRoles
            )
          }
          withCancel
          cancelFcn={() => setIsEditCustomerOrderStatusModalOpen(false)}
          closeModal={() => setIsEditCustomerOrderStatusModalOpen(false)}
          type="Save"
          title="Edit an Status"
          data={rolesList?.find((elem) => elem.id === selectedId)}
          editable={true}
        />
      )}
      {/* CUSTOMER_ORDER_STATUS modals */}
      {/* CUSTOMER_ORDER_TRIP_STATUS modals */}
      {selectValue === "CUSTOMER_ORDER_TRIP_STATUS" && (
        <EnhancedTable
          rows={customerOrderTripStatusRows || []}
          headCells={customerOrderTripStatusHeadCells}
          toolbar={["View", "Edit"]}
          onEdit={handleOpenEditCustomerOrderTripStatusModal}
          onView={handleOpenViewCustomerOrderTripStatusModal}
          loading={!customerOrderTripStatusList}
        />
      )}
      {isViewCustomerOrderTripStatusModalOpen && (
        <EditCustomerOrderTripStatusModal
          saveFcn={() => setIsViewCustomerOrderTripStatusModalOpen(false)}
          withCancel={false}
          cancelFcn={() => setIsViewCustomerOrderTripStatusModalOpen(false)}
          closeModal={() => setIsViewCustomerOrderTripStatusModalOpen(false)}
          type="Close"
          title="View"
          data={customerOrderTripStatusList?.find(
            (elem) => elem.id === selectedId
          )}
          editable={false}
        />
      )}
      {isEditCustomerOrderTripStatusModalOpen && (
        <EditCustomerOrderTripStatusModal
          saveFcn={() =>
            handleSnackBar(
              "TripStatus Updated Successfully!",
              setIsEditCustomerOrderTripStatusModalOpen,
              fetchRoles
            )
          }
          withCancel
          cancelFcn={() => setIsEditCustomerOrderTripStatusModalOpen(false)}
          closeModal={() => setIsEditCustomerOrderTripStatusModalOpen(false)}
          type="Save"
          title="Edit a Trip Status"
          data={customerOrderTripStatusList?.find(
            (elem) => elem.id === selectedId
          )}
          editable={true}
        />
      )}
      {/* CUSTOMER_ORDER_TRIP_STATUS modals */}

      {/* TRIP_STATUS modals */}
      {selectValue === "TRIP_STATUS" && (
        <EnhancedTable
          rows={tripStatusRows || []}
          headCells={tripStatusHeadCells}
          toolbar={["View", "Edit"]}
          onEdit={handleOpenEditTripStatusModal}
          onView={handleOpenViewTripStatusModal}
          loading={!tripStatusList}
        />
      )}
      {isViewTripStatusModalOpen && (
        <EditTripStatusModal
          saveFcn={() => setIsViewTripStatusModalOpen(false)}
          withCancel={false}
          cancelFcn={() => setIsViewTripStatusModalOpen(false)}
          closeModal={() => setIsViewTripStatusModalOpen(false)}
          type="Close"
          title="View"
          data={tripStatusList?.find((elem) => elem.id === selectedId)}
          editable={false}
        />
      )}
      {isEditTripStatusModalOpen && (
        <EditTripStatusModal
          saveFcn={() =>
            handleSnackBar(
              "TripStatus Updated Successfully!",
              setIsEditTripStatusModalOpen,
              fetchRoles
            )
          }
          withCancel
          cancelFcn={() => setIsEditTripStatusModalOpen(false)}
          closeModal={() => setIsEditTripStatusModalOpen(false)}
          type="Save"
          title="Edit a Trip Status"
          data={tripStatusList?.find((elem) => elem.id === selectedId)}
          editable={true}
        />
      )}
      {/* TRIP_STATUS modals */}

      {isAddTonToQbmMasterModalOpen && (
        <AddTonToQbmMasterModal
          saveFcn={() => setIsAddTonToQbmMasterModalpen(false)}
          withCancel
          cancelFcn={() => setIsAddTonToQbmMasterModalpen(false)}
          closeModal={() => setIsAddTonToQbmMasterModalpen(false)}
          type="Save"
          title="Add TonToQbm"
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
