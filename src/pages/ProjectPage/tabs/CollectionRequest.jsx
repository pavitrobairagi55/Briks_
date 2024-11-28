import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";

export default function CollectionRequest() {
  const [search, setSearch] = useState(" ");
  const [date, setDate] = useState(" ");
  const [selectValue, setSelectValue] = useState(" ");

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  function createData(id, name, calories, fat, carbs, protein) {
    return {
      id,
      name,
      calories,
      fat,
      carbs,
      protein,
    };
  }

  const rows = [];

  const headCells = [
    {
      id: "CO Number",
      numeric: false,
      disablePadding: true,
      label: "CO Number",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "Expected Delivery Date",
      numeric: true,
      disablePadding: false,
      label: "Expected Delivery Date",
    },
    {
      id: "Created Date",
      numeric: true,
      disablePadding: false,
      label: "Created Date",
    },
    {
      id: "Delivery Date",
      numeric: true,
      disablePadding: false,
      label: "Delivery Date",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "Order Status",
      numeric: true,
      disablePadding: false,
      label: "Order Status",
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
      <EnhancedTable headCells={headCells} rows={rows} />
    </>
  );
}
