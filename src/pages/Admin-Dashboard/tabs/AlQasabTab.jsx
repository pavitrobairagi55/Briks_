import { Box } from "@mui/material";
import EnhancedTable from "../../../components/tabel/Table";
import DashboardCard from "../../../components/cards/dashboardCard/dashboardCard";
import SimpleCharts from "../../../components/charts/chart";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "../../../components/Modal";
import { useState } from "react";
import useFetch from "../../../shared/useFetch";
export default function AlQasabTab() {
  const [isModalOpen, setIsModalOpen] = useState();
  const { data } = useFetch("DashBoard/al-qasab");

  const rows = data?.soilStorage?.map((elem) => {
    return {
      ZoneName: elem.zoneName,
      Quantity: elem.quantity,
      Capacity: elem.capacity,
      CapacityPercentage: ((+elem.quantity / +elem.capacity) * 100).toFixed(2),
    };
  });

  const headCells = [
    {
      id: "ZoneName",
      numeric: false,
      disablePadding: true,
      label: "ZoneName",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "Capacity",
      numeric: true,
      disablePadding: false,
      label: "Capacity",
    },
    {
      id: "CapacityPercentage",
      numeric: true,
      disablePadding: false,
      label: "Capacity Percentage",
    },
  ];

  const labels = data?.soilStorage?.map((elem) => elem.zoneName);
  const labelsData = data?.soilStorage?.map((elem) => elem.capacity);

  return (
    <Box className="flex flex-col gap-y-10">
      <Box className>
        <h1 className="mb2">Al Qasab</h1>
        <Box className="flex justify-center gap-x-10">
          <DashboardCard
            title="Soli Production Area"
            value={data?.alQasabSotrage?.productionArea}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title="Storage"
            value={data?.alQasabSotrage?.storage}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title="Total"
            value={
              data?.alQasabSotrage?.productionArea +
              data?.alQasabSotrage?.storage
            }
            icon={<GroupIcon />}
          />
        </Box>

        <h1 className="mb2">Soil Intransite</h1>
        <Box className="flex justify-center gap-x-10">
          <DashboardCard
            title="Gate Out"
            value={data?.soilTransportToJubail?.gateOut}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title="Reached Al Jubaila"
            value={data?.soilTransportToJubail?.reachedJubila}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title="In Transit"
            value={data?.soilTransportToJubail?.intransit}
            icon={<GroupIcon />}
          />
        </Box>
      </Box>
      <SimpleCharts
        className="h-96 max-h-96"
        labels={labels?.length ? labels : [" "]}
        data={labelsData?.length ? labelsData : [" "]}
      />
      <EnhancedTable headCells={headCells} rows={rows || []} />,
    </Box>
  );
}
