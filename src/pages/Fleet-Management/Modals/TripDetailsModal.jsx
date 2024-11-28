import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import QRCode from "react-qr-code";
import Modal from "../../../components/Modal";
import { formatDate } from "../../../utils";
import { APP_URL } from "../../../envirement";
import EnhancedTable from "../../../components/tabel/Table";

export default function TripDetailsModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const headCells = [
    {
      id: "jubilaEntryTime",
      numeric: true,
      disablePadding: false,
      label: "Jubila Entry Time",
    },
    {
      id: "jubilaExitTime",
      numeric: true,
      disablePadding: false,
      label: "Jubila Exit Time",
    },
    {
      id: "alQasabEntryTime",
      numeric: true,
      disablePadding: false,
      label: "Al Qasab Entry Time",
    },

    {
      id: "alQasabExitTime",
      numeric: true,
      disablePadding: false,
      label: "Al Qasab Exit Time",
    },
  ];
  const rows = [data]?.map((elem) => {
    return {
      id: elem.id,
      jubilaExitTime: formatDate(elem.jubilaExitTime),
      jubilaEntryTime: formatDate(elem.jubilaEntryTime),
      alQasabExitTime: formatDate(elem.alQasabExitTime),
      alQasabEntryTime: formatDate(elem.alQasabEntryTime),
    };
  });
  return (
    <>
      <Modal
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
      >
        <EnhancedTable rows={rows || []} headCells={headCells} />
      </Modal>
    </>
  );
}
