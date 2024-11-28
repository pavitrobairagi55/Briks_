import { Box, CardContent, TableContainer } from '@mui/material';
// import EnhancedTable from '../../../components/tabel/Table';
import DashboardCard from '../../../components/cards/dashboardCard/dashboardCard';
import GroupIcon from '@mui/icons-material/Group';
import useFetch from '../../../shared/useFetch';
import Card from '@mui/material/Card';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { sliceTable, sortArrOfObj } from '../../../utils/utils';
import CustomTableHeader from '../../../components/Table/TableHeader';
import CustomTableBody from '../../../components/Table/TableBody';
import { AlQasabCols } from './dashboardConstants';
import CustomPagination from '../../../components/Table/CustomPagination';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function AlQasabTab() {
  let { data } = useFetch('DashBoard/al-qasab');
  data = data?.soilStorage ?? [];
  const [tableRows, setTableRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const rows = data?.map((elem) => {
    return {
      ZoneName: elem.zoneName,
      Quantity: elem.quantity,
      Capacity: elem.capacity,
      CapacityPercentage: ((+elem.quantity / +elem.capacity) * 100).toFixed(2),
    };
  });

  const sortData = (sortVal) => {
    const sortedData = sortArrOfObj([...rows], sortVal);
    const slicedData = sliceTable(sortedData, page, rowsPerPage) ?? [];
    setTableRows(slicedData);
  };

  useEffect(() => {
    const slicedData = sliceTable(rows, page, rowsPerPage) ?? [];
    setTableRows(slicedData);
  }, [data, page, rowsPerPage]);

  const dataForChart = {
    labels: tableRows?.map((elem) => elem.ZoneName) ?? [], // x-axis labels
    datasets: [
      {
        label: '',
        data: tableRows.map((elem) => elem.Capacity) ?? [], // y-axis values
        backgroundColor: '#02B2AF',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: false,
        text: 'Zonewise Capacity',
      },
      datalabels: {
        display: false, // Disable data labels
      },
    },
    scales: {
      y: {
        min: 0,
        max: Math.max(data?.map((elem) => elem.capacity)),
        ticks: {
          stepSize: Math.ceil(
            Math.max(data?.map((elem) => elem.capacity)) / 10
          ),
        },
      },
    },
  };

  return (
    <Box className='flex flex-col gap-y-10'>
      <Box className>
        <h1 className='mb2'>Al Qasab</h1>
        <Box className='flex justify-center gap-x-10'>
          <DashboardCard
            title='Soli Production Area'
            value={data?.alQasabSotrage?.productionArea}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title='Storage'
            value={data?.alQasabSotrage?.storage}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title='Total'
            value={
              data?.alQasabSotrage?.productionArea +
              data?.alQasabSotrage?.storage
            }
            icon={<GroupIcon />}
          />
        </Box>

        <h1 className='mb2'>Soil Intransite</h1>
        <Box className='flex justify-center gap-x-10'>
          <DashboardCard
            title='Gate Out'
            value={data?.soilTransportToJubail?.gateOut}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title='Reached Al Jubaila'
            value={data?.soilTransportToJubail?.reachedJubila}
            icon={<GroupIcon />}
          />
          <DashboardCard
            title='In Transit'
            value={data?.soilTransportToJubail?.intransit}
            icon={<GroupIcon />}
          />
        </Box>
      </Box>

      <Box>
        <Card>
          <TableContainer sx={{ width: '100%' }}>
            <CustomTableHeader
              columns={AlQasabCols}
              onSortClick={sortData}
            />
            <CustomTableBody
              data={tableRows}
              columns={AlQasabCols}
            />
            <CustomPagination
              totalCount={rows.length ?? 0}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              currentPage={page}
              setCurrentPage={setPage}
            />
          </TableContainer>
        </Card>

        <Card
          sx={{
            minWidth: 275,
            p: 1,
            mt: 2,
          }}
        >
          <CardContent>
            <Bar
              data={dataForChart}
              options={options}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
