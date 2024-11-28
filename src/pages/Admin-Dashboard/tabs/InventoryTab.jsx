import { Box, Card, CardContent, Typography } from '@mui/material';
import DashboardCard from '../../../components/cards/dashboardCard/dashboardCard';
import { AuthContext } from '../../../shared/authContext';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { fetchInventoryData } from './dashboardFunctions';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function InventoryTab() {
  const [data, setData] = useState({});
  const auth = useContext(AuthContext);

  const mortalFreeQuantityPercentage =
    data?.mortar?.freeQuantity / (data?.mortar?.capacity / 100);
  const mortalTotalCapacity = 100 - mortalFreeQuantityPercentage;

  const morData = {
    labels: [
      `Free Quantity (${data?.mortar?.freeQuantity.toFixed()})`,
      `Capacity (${data?.mortar?.capacity.toFixed()})`,
      `Free Quantity Percentage (${Math.round(mortalFreeQuantityPercentage)}%)`,
    ],
    data: [
      Math.round(mortalFreeQuantityPercentage) ?? 0,
      Math.round(mortalTotalCapacity) ?? 0,
      0,
    ],
  };

  const palFreeQuantityPercentage =
    data?.plaster?.freeQuantity / (data?.plaster?.capacity / 100);
  const palTotalCapacity = 100 - palFreeQuantityPercentage;

  const plaData = {
    labels: [
      `Free Quantity (${data?.plaster?.freeQuantity.toFixed()})`,
      `Capacity (${data?.plaster?.capacity.toFixed()})`,
      `Free Quantity Percentage (${Math.round(palFreeQuantityPercentage)}%)`,
    ],
    data: [
      Math.round(palFreeQuantityPercentage) ?? 0,
      Math.round(palTotalCapacity) ?? 0,
      0,
    ],
  };

  const dataForMortar = {
    labels: morData.labels ?? [], // x-axis labels
    datasets: [
      {
        label: '',
        data: morData.data ?? [], // y-axis values
        backgroundColor: ['#02B2AF', '#6666ff', '#99cc00'],
        hoverOffset: 4,
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgb(0, 51, 102)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsForMortar = {
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
        callbacks: {
          label: function (context) {
            // Return only the label (e.g., dataset label)
            return context.dataset.label || '';
          },
        },
      },
      datalabels: {
        display: false, // Disable data labels
      },
    },
  };

  const dataForPlaster = {
    labels: plaData.labels ?? [], // x-axis labels
    datasets: [
      {
        label: '',
        data: plaData.data ?? [], // y-axis values
        backgroundColor: ['#02B2AF', '#6666ff', '#99cc00'],
        hoverOffset: 4,
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgb(0, 51, 102)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsForPlaster = {
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
        callbacks: {
          label: function (context) {
            // Return only the label (e.g., dataset label)
            return context.dataset.label || '';
          },
        },
      },
      datalabels: {
        display: false, // Disable data labels
      },
    },
  };

  useEffect(() => {
    fetchInventoryData(setData, auth);
  }, [auth]);

  console.log(data);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', height: '250px' }}>
        <Box sx={{ marginRight: 2 }}>
          <Typography
            variant='subtitle1'
            gutterBottom
          >
            Athel
          </Typography>
          <DashboardCard
            title='Total Quantity'
            value={`${data?.athel} LM`}
          />
        </Box>
        <Box>
          <Typography
            variant='subtitle1'
            gutterBottom
          >
            Straw
          </Typography>
          <DashboardCard
            title='Total Quantity'
            value={`${data?.straw} Kilograms`}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', height: '450px' }}>
        <Box>
          <Typography
            sx={{ pl: 2 }}
            variant='subtitle1'
            gutterBottom
          >
            Mortar
          </Typography>
          <Box sx={{ p: 2 }}>
            <Card sx={{ width: '400px', height: '400px', padding: '10px' }}>
              <CardContent>
                <Pie
                  data={dataForMortar}
                  options={optionsForMortar}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{ pl: 2 }}
            variant='subtitle1'
            gutterBottom
          >
            Plaster
          </Typography>
          <Box sx={{ p: 2 }}>
            <Card sx={{ width: '400px', height: '400px', padding: '10px' }}>
              <CardContent>
                <Pie
                  data={dataForPlaster}
                  options={optionsForPlaster}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{ pl: 2 }}
          variant='subtitle1'
          gutterBottom
        >
          Red Clay
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '20px',
            p: 2,
          }}
        >
          <DashboardCard
            title='redClay UnCrushed'
            value={data?.redClayUnCrushed}
          />
          <DashboardCard
            title='redClay Crushed'
            value={data?.redClayCrushed}
          />
          <DashboardCard
            title='TotalQuantity'
            value={data?.redClayUnCrushed + data?.redClayCrushed + ' M3'}
          />
        </Box>
      </Box>
    </>
  );
}
