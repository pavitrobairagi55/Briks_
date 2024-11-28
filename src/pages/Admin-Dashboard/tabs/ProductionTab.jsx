import { Box } from "@mui/material";
import EnhancedTable from "../../../components/tabel/Table";
import DashboardCard from "../../../components/cards/dashboardCard/dashboardCard";

import useFetch from "../../../shared/useFetch";
import PieStats from "../../../components/stats/PieStats";
export default function ProductionTab() {
  const { data } = useFetch("DashBoard/pans-aging");
  const { data: collection } = useFetch("Collection/stats");
  const { data: storage } = useFetch("Storage/stats");
  const { data: molding } = useFetch("Molding/stats");

  const headCells = [
    {
      id: "ModilngArea",
      numeric: false,
      disablePadding: true,
      label: "Modilng Area",
    },
    {
      id: "NoBricks",
      numeric: true,
      disablePadding: false,
      label: "No Bricks",
    },
    /*     {
      id: "BricksCapacity",
      numeric: true,
      disablePadding: false,
      label: "Bricks Capacity",
    },
    {
      id: "CapacityPercentage",
      numeric: true,
      disablePadding: false,
      label: "Capacity Percentage",
    }, */
  ];

  const rows = molding?.items.map((elem) => {
    return {
      ModilngArea: elem.moldingArea,
      NoBricks: elem.quantity,
      /* BricksCapacity
CapacityPercentage */
    };
  });
  const collectionData = [
    {
      id: 0,
      value: collection?.collected || 0,
      label: `Collected ( ${collection?.collected || 0} ) `,
    },
    {
      id: 1,
      value: collection?.storage || 0,
      label: `Storage ( ${collection?.storage || 0} ) `,
    },
    {
      id: 1,
      value: collection?.wastage || 0,
      label: `Wastage ( ${collection?.wastage || 0} ) `,
    },
  ];

  return (
    <>
      <Box>
        <h1 className="mb-3">Fermentation Pans</h1>
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
            title="1-14 Days"
            value={data?.pansAging1_14Count || 0}
          />
          <DashboardCard
            title="15-21 Days"
            value={data?.pansAging15_21Count || 0}
          />
          <DashboardCard
            title="Over 21 Days"
            value={data?.pansAgingOver21Count || 0}
          />
        </Box>
      </Box>
      ,
      <Box className="mb-8">
        <h1 className="mb-5">Collection</h1>
        <PieStats data={collectionData} width={600} height={300} />
      </Box>
      <Box>
        <h1 className="mb-3">Storage</h1>
        <Box className="flex justify-center flex-wrap gap-4	">
          {storage?.items.map((elem, index) => (
            <DashboardCard title={elem.zone} value={elem.count} key={index} />
          ))}
        </Box>
      </Box>
      <Box>
        <h1 className="mb-5">Molding area</h1>
        <EnhancedTable headCells={headCells} rows={rows || []} />
      </Box>
    </>
  );
}
