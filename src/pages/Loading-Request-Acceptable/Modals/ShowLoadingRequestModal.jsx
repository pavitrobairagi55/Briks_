import { useState } from "react";

import Modal from "../../../components/Modal";
import EnhancedTable from "../../../components/tabel/Table";
import ShowLoadingRequestApproveModal from "./ShowLoadingRequestApproveModal";
import { IconButton } from "@mui/material";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";

export default function ShowLoadingRequestModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  openSecondFCN,
  selectedId,
  setApprovalData,
}) {
  const { isLoading, data, refetch } = UseFetchData(
    `api/CustomerTrips/${selectedId}/dispatches`,
    []
  );
  const handleOpenSecondModal = (data) => {
    setApprovalData(data);
    openSecondFCN();
  };
  const ButtonsApprove = ({ data }) => {
    return (
      <IconButton
        onClick={() => handleOpenSecondModal(data)}
        className="text-white bg-[#132950] hover:text-[#132950] rounded-none hover:bg-white text-sm"
      >
        Approve
      </IconButton>
    );
  };
  const headCells = [
    {
      id: "Id",
      numeric: false,
      disablePadding: true,
      label: "Id",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "WareHouseName",
      numeric: true,
      disablePadding: false,
      label: "WareHouse Name",
    },
    {
      id: "ZoneName",
      numeric: true,
      disablePadding: false,
      label: "Zone Name",
    },

    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      Id: elem.id,
      Quantity: elem.quantity.toFixed(2),
      WareHouseName: elem.warehouse,
      ZoneName: elem.zoneName,
      Status: elem.approved ? (
        <span className="text-green-500 font-semibold">Approved</span>
      ) : (
        <ButtonsApprove data={elem} />
      ),
    };
  });
  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
      >
        <div>
          <EnhancedTable
            rows={rows || []}
            headCells={headCells}
            loading={isLoading}
          />
        </div>
      </Modal>
    </>
  );
}
