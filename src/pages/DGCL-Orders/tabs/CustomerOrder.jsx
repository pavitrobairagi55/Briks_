import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import ApproveModal from "../Modals/ApproveModal";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { formatDate } from "../../../utils";
import ApprovedQuantityModal from "../Modals/ApprovedQuantityModal";
import UseFetchData from "../../../shared/useFetchData";

export default function CustomerOrder() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState("");
  const auth = useContext(AuthContext);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const horizontal = "center";
  const vertical = "top";
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isViewApprovedQuantityOpen, setIsViewApprovedQuantityOpen] =
    useState(false);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const getFilteredURL = () => {
    let urlapi = "/api/CustomerOrders?";

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
    if (selectValue?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "status=" +
        selectValue;
    }
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
    selectValue,
  ]);

  const handleOpenApproveModal = (id) => {
    setSelectedId(id);
    setApproveModalOpen(true);
  };
  const handleCloseApproveModal = () => {
    setApproveModalOpen(false);
  };

  const handleAddSnackBar = () => {
    setSnackMessage("Status Changed");
    setOpenSnackBar(true);
    handleCloseApproveModal();
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const statusresponse = await axios.get(
          "api/MasterStatusCustomerOrder",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const statusMap = statusresponse.data?.map((elem) => {
          return {
            id: elem.secretCode,
            value: elem.name,
          };
        });

        setStatusList(statusMap);
      } catch (error) {}
    };

    fetchStatus();
  }, []);

  const Buttons = ({ id, title, openModalFCN, isDisabled }) => {
    return (
      <IconButton
        disabled={isDisabled}
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-lg"
      >
        {title}
      </IconButton>
    );
  };

  const headCells = [
    {
      id: "OrderNumber",
      numeric: false,
      disablePadding: false,
      label: "Order Number",
    },
    {
      id: "CustomerName",
      numeric: false,
      disablePadding: true,
      label: "Customer Name",
    },
    {
      id: "Product",
      numeric: false,
      disablePadding: true,
      label: "Product",
    },
    {
      id: "CreatedDate",
      numeric: false,
      disablePadding: false,
      label: "Created Date",
    },

    {
      id: "ExpectedDeliveryDate",
      numeric: false,
      disablePadding: false,
      label: "Expected Delivery Date",
    },
    {
      id: "Priority",
      numeric: true,
      disablePadding: false,
      label: "Priority",
    },
    {
      id: "ApprovedQuantity",
      numeric: true,
      disablePadding: false,
      label: "Approved Quantity",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Requested Quantity",
    },

    {
      id: "OrderStatus",
      numeric: false,
      disablePadding: false,
      label: "Order Status",
    },
    /*    {
      id: "ApprovedQuantity",
      numeric: false,
      disablePadding: false,
      label: "Approved Quantity",
    }, */
    {
      id: "TripDetails",
      numeric: false,
      disablePadding: false,
      label: "Trip Details",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      CustomerName: elem.user?.firstName + " " + elem.user?.lastName,
      Product: elem.product?.name,
      Priority: elem.orderPriority,
      ApprovedQuantity: elem.approvedQuantity.toFixed(2),
      CreatedDate: formatDate(elem.createdDate),
      OrderNumber: elem.id,
      ExpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      Quantity: elem.quantity.toFixed(2),
      OrderStatus: elem.status?.name,
      /* ApprovedQuantity: (
        <Buttons
          id={1}
          title={"View"}
          openModalFCN={() => handleViewApprovedQuanity(elem.id)}
        />
      ), */
      TripDetails: (
        <Buttons
          id={1}
          title={"Approve"}
          isDisabled={
            elem.status.secretCode !== "Pending" &&
            elem.status.secretCode !== "setsVerified"
          }
          openModalFCN={() => handleOpenApproveModal(elem.id)}
        />
      ),
    };
  });
  const handleViewApprovedQuanity = (id) => {
    setSelectedId(id);
    setIsViewApprovedQuantityOpen(true);
  };

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
        searchPlaceHolder={"Order Number or Customer Name"}

        /* print={true}
        onPrint={() => null}
        export={true}
        onExport={() => null} */
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />

      {isApproveModalOpen && (
        <ApproveModal
          cancelFcn={handleCloseApproveModal}
          saveFcn={handleAddSnackBar}
          closeModal={handleCloseApproveModal}
          title={""}
          type={"Approve"}
          Editable={false}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
          statusList={statusList.filter(
            (elem) =>
              elem.id !== "setsVerified" &&
              elem.id !== "setsRejected" &&
              elem.id !== "finished" &&
              elem.id !== "Pending"
          )}
        />
      )}
      {isViewApprovedQuantityOpen && (
        <ApprovedQuantityModal
          cancelFcn={() => setIsViewApprovedQuantityOpen(false)}
          saveFcn={() => setIsViewApprovedQuantityOpen(false)}
          closeModal={() => setIsViewApprovedQuantityOpen(false)}
          title={""}
          type={"Close"}
          withCancel={false}
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
