import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";

export default function ProductionOrderTab() {
  const [search, setSearch] = useState(" ");
  const [date, setDate] = useState(" ");
  const [selectValue, setSelectValue] = useState(" ");

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const headCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
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
  ];
  return (
    <>
      <p className="text-gray-700 font-semibold text-3xl ml-10 mt-10">
        BricksProductionOrders
      </p>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        date={date}
        dateChange={updateDates}
        dateExist
      />
      <EnhancedTable rows={[]} headCells={headCells} />

      <p className="text-gray-700 font-semibold text-3xl ml-10 mt-10">
        MortarPlasterProductionOrders
      </p>

      <EnhancedTable rows={[]} headCells={headCells} />
      <p className="text-gray-700 font-semibold text-3xl ml-10 mt-10">
        BricksCollections
      </p>

      <EnhancedTable rows={[]} headCells={headCells} />
    </>
  );
}
