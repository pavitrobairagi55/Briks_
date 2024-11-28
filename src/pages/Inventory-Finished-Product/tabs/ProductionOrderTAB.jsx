import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";

export default function ProductionOrderTAB() {
  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "Unite",
      numeric: true,
      disablePadding: false,
      label: "Unite",
    },
    {
      id: "QuantityPerUnit",
      numeric: true,
      disablePadding: false,
      label: "Quantity Per Unit",
    },
    {
      id: "Total",
      numeric: true,
      disablePadding: false,
      label: "Total",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Store",
      numeric: true,
      disablePadding: false,
      label: "Store",
    },
  ];

  return (
    <>
      <HeaderFilter />
      <EnhancedTable rows={[]} headCells={headCells} />
    </>
  );
}
