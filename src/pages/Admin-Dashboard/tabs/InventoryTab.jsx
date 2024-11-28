import { Box } from "@mui/material";
import DashboardCard from "../../../components/cards/dashboardCard/dashboardCard";
import SimpleCharts from "../../../components/charts/chart";

import Modal from "../../../components/Modal";
import { useState } from "react";
import useFetch from "../../../shared/useFetch";
import PieStats from "../../../components/stats/PieStats";
export default function InventoryTab() {
  const { data } = useFetch("DashBoard/inventory");

  const mortarData = [
    {
      id: 0,
      value: data?.mortar?.freeQuantity,
      label: `Free Quantity ( ${data?.mortar?.freeQuantity}) `,
    },
    {
      id: 1,
      value: data?.mortar?.capacity,
      label: `Capacity ( ${data?.mortar?.capacity}) `,
    },
  ];
  const plasterData = [
    {
      id: 0,
      value: data?.plaster?.freeQuantity,
      label: `Free Quantity ( ${data?.plaster?.freeQuantity} )`,
    },
    {
      id: 1,
      value: data?.plaster?.capacity,
      label: `Capacity ( ${data?.plaster?.capacity} )`,
    },
  ];
  return (
    <>
      <Box className="mb-6">
        <h1 className="mb-4">Athel</h1>
        <DashboardCard title="Total Quantity" value={`${data?.athel} LM`} />
      </Box>
      <Box className="mb-6">
        <h1 className="mb-6">Straw</h1>
        <DashboardCard
          title="Total Quantity"
          value={`${data?.straw} Kilograms`}
        />
      </Box>
      <Box className="mb-6">
        <h1 className="mb-4">Mortar</h1>
        <PieStats data={mortarData} width={600} height={300} />
      </Box>
      <Box className="mb-6">
        <h1 className="mb-4">Plaster</h1>
        <PieStats data={plasterData} width={600} height={300} />
      </Box>
      <Box className="mb-6">
        <h1 className="mb-4">Red Clay</h1>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            padding: "30px 10px",
            width: "100%",
          }}
        >
          <DashboardCard
            title="redClay UnCrushed"
            value={data?.redClayUnCrushed}
          />
          <DashboardCard title="redClay Crushed" value={data?.redClayCrushed} />
          <DashboardCard
            title="TotalQuantity"
            value={data?.redClayUnCrushed + data?.redClayCrushed + " M3"}
          />
        </Box>
      </Box>
    </>
  );
}
