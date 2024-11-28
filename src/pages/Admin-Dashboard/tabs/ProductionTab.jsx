import { Box, Card, CardContent, Typography } from '@mui/material';
import EnhancedTable from '../../../components/tabel/Table';
import DashboardCard from '../../../components/cards/dashboardCard/dashboardCard';

import useFetch from '../../../shared/useFetch';
// import PieStats from '../../../components/stats/PieStats';
import { Pie } from 'react-chartjs-2';
export default function ProductionTab() {
  const { data } = useFetch('DashBoard/pans-aging');
  const { data: collection } = useFetch('Collection/stats');
  const { data: storage } = useFetch('Storage/stats');
  const { data: molding } = useFetch('Molding/stats');

  const headCells = [
    {
      id: 'ModilngArea',
      numeric: false,
      disablePadding: true,
      label: 'Modilng Area',
    },
    {
      id: 'NoBricks',
      numeric: true,
      disablePadding: false,
      label: 'No Bricks',
    },
  ];

  const rows = molding?.items.map((elem) => {
    return {
      ModilngArea: elem.moldingArea,
      NoBricks: elem.quantity,
    };
  });

  const collectionData = {
    labels:
      [
        `Collected ( ${collection?.collected || 0} )`,
        `Storage ( ${collection?.storage || 0} )`,
        `Wastage ( ${collection?.wastage || 0} ) `,
      ] ?? [], // x-axis labels
    datasets: [
      {
        label: '',
        data:
          [
            collection?.collected || 0,
            collection?.storage || 0,
            collection?.wastage || 0,
          ] ?? [], // y-axis values
        backgroundColor: ['#33ccff', '#6666ff', '#ff99cc'],
        hoverOffset: 4,
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
        text: 'Mortar',
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <>
      <Box sx={{ marginBottom: '1rem' }}>
        <Typography
          variant='body'
          sx={{ marginBottom: '0.5rem' }}
        >
          Fermentation Pans
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'start',
            gap: '20px',
            padding: '20px 0px',
            width: '100%',
          }}
        >
          <DashboardCard
            title='1-14 Days'
            value={data?.pansAging1_14Count || 0}
          />
          <DashboardCard
            title='15-21 Days'
            value={data?.pansAging15_21Count || 0}
          />
          <DashboardCard
            title='Over 21 Days'
            value={data?.pansAgingOver21Count || 0}
          />
        </Box>
      </Box>

      <Box sx={{ marginBottom: '1rem' }}>
        <Typography variant='body'>Collection</Typography>
        <Card
          sx={{
            width: '400px',
            height: '400px',
            padding: '10px',
            marginTop: '0.5rem',
          }}
        >
          <CardContent>
            <Pie
              data={collectionData}
              options={options}
            />
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ marginBottom: '1rem' }}>
        <Typography
          variant='body1'
          sx={{ marginBottom: '0.5rem' }}
        >
          Storage
        </Typography>
        <Box>
          {storage?.items.map((elem, index) => (
            <DashboardCard
              title={elem.zone}
              value={elem.count}
              key={index}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ marginBottom: '1rem' }}>
        <Box sx={{ mb: '0.5rem' }}>
          <Typography variant='body'>Molding area</Typography>
        </Box>
        <EnhancedTable
          headCells={headCells}
          rows={rows || []}
        />
      </Box>
    </>
  );
}
