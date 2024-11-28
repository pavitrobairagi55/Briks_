import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import AddTripModal from "../../Fleet-Management/Modals/AddTripModal";

export default function FleetManagementTab() {
  const [search, setSearch] = useState(" ");
  const [date, setDate] = useState(" ");
  const [selectValue, setSelectValue] = useState(" ");
  const [isModalOpen, setIsModalOpen] = useState();

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const headCells = [
    {
      id: "TripId",
      numeric: false,
      disablePadding: true,
      label: "Trip Id",
    },
    {
      id: "TripDate",
      numeric: true,
      disablePadding: false,
      label: "Trip Date",
    },
    {
      id: "VehiclePlateNumber",
      numeric: true,
      disablePadding: false,
      label: "Vehicle Plate Number",
    },
    {
      id: "DriverName",
      numeric: true,
      disablePadding: false,
      label: "Driver Name",
    },
    {
      id: "Vehicle Capacity",
      numeric: true,
      disablePadding: false,
      label: "VehicleCapacity",
    },
    {
      id: "Quantiity",
      numeric: true,
      disablePadding: false,
      label: "Quantiity",
    },
    {
      id: "Zone",
      numeric: true,
      disablePadding: false,
      label: "Zone",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
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
