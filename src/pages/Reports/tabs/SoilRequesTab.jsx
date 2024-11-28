import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";

export default function SoilRequesTab() {
  const [search, setSearch] = useState(" ");
  const [date, setDate] = useState(" ");
  const [selectValue, setSelectValue] = useState(" ");

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
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Details",
      numeric: true,
      disablePadding: false,
      label: "Details",
    },
  ];
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
        selectOptions={["React", "Vue"]}
      />
      <EnhancedTable rows={[]} headCells={headCells} />
    </>
  );
}
