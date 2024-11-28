import { useState } from "react";

import Modal from "../../../components/Modal";
import EnhancedTable from "../../../components/tabel/Table";
import useFetch from "../../../shared/useFetch";

export default function DetailsModal({
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
  ];
  const rows = [data];
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
          <EnhancedTable rows={rows || []} headCells={headCells} />
        </div>
      </Modal>
    </>
  );
}
