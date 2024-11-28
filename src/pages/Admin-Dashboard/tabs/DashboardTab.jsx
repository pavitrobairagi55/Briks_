import EnhancedTable from '../../../components/tabel/Table';
import DashboardCard from '../../../components/cards/dashboardCard/dashboardCard';
import GroupIcon from '@mui/icons-material/Group';
import Modal from '../../../components/Modal';
import { useContext, useEffect, useState } from 'react';
import useFetch from '../../../shared/useFetch';
import { AuthContext } from '../../../shared/authContext';
import { formatDate, handleExcel, handlePrint } from '../../../utils';
import { sortArrOfObj, sliceTable } from '../../../utils/utils';
import { dashbCols1, headCells2, productOrder } from './dashboardConstants';
import { fetchDashboardData } from './dashboardFunctions';
import { Box, Button, Card, CardContent, TableContainer } from '@mui/material';
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
import CustomTableHeader from '../../../components/Table/TableHeader';
import CustomTableBody from '../../../components/Table/TableBody';
import CustomPagination from '../../../components/Table/CustomPagination';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const stylesBelow10Rows = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'stretch',
//   gap: '10px'
// };

export default function DashboardTab() {
  const [isModalOpen, setIsModalOpen] = useState();
  const { data } = useFetch('DashBoard/customer-stats');
  const { data: customerOrders } = useFetch('CustomerOrders');

  const [tableRows, setTableRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [productBalances, setProductBalances] = useState([]);
  const auth = useContext(AuthContext);

  const sortData = (sortVal) => {
    const sortedData = sortArrOfObj([...productBalances], sortVal);
    const slicedData = sliceTable(sortedData, page, rowsPerPage) ?? [];
    setTableRows(slicedData);
  };

  useEffect(() => {
    const slicedData = sliceTable(productBalances, page, rowsPerPage) ?? [];
    setTableRows(slicedData);
  }, [productBalances, page, rowsPerPage]);

  useEffect(() => {
    fetchDashboardData(setProductBalances, auth);
  }, [auth]);

  // Create a lookup map
  const productOrderMap = productOrder.reduce((map, product, index) => {
    map[product] = index;
    return map;
  }, {});

  const rows = productBalances
    ?.map((elem) => {
      return {
        id: elem.productId,
        Product: elem.productName,
        TotalQuantity: elem.totalQuantity,
        FreeQuantity: elem.freeQuantity,
        UnderProcessing: elem.underProcessingQuantity,
      };
    })
    ?.sort((a, b) => {
      const indexA = productOrderMap[a.Product];
      const indexB = productOrderMap[b.Product];

      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      }
      if (indexA !== undefined) {
        return -1;
      }
      if (indexB !== undefined) {
        return 1;
      }
      return a.Product.localeCompare(b.Product);
    });

  const rows2 = customerOrders?.map((elem) => {
    return {
      id: elem.id,
      CONumber: elem.id,
      CustomerName: elem.user?.firstName + ' ' + elem.user.lastName,
      Product: elem.product?.name,
      ExpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      OrderQty: elem.quantity.toFixed(2),
      QtyPerUnit: elem.quantityPerUnit,
      Status: elem.status?.name,
    };
  });

  const dataForChart = {
    labels: tableRows.map((itm) => itm.productName), // x-axis labels
    datasets: [
      {
        label: '',
        data: tableRows.map((itm) => itm.totalQuantity), // y-axis values
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
        text: 'Bar Chart Example',
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: Math.max(rows.map((itm) => itm.TotalQuantity)),
        ticks: {
          stepSize: Math.ceil(
            Math.max(rows.map((itm) => itm.TotalQuantity)) / 10
          ),
        },
      },
    },
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          // flexWrap: 'wrap',
          alignItems: 'stretch',
          gap: '20px',
          py: 2,
        }}
      >
        <DashboardCard
          title='Total Customers'
          value={data?.totalCustomers}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title='Total Customer Order'
          value={data?.totalCustomerOrders}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title='Total Customer Order In Progress'
          value={data?.totalCustomerOrdersInProgress}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title='Total Customer Order Rejected'
          value={data?.totalCustomerOrdersRejected}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title='Total Customer Order Delivered'
          value={data?.totalCustomerOrdersDelivered}
          icon={<GroupIcon />}
        />
      </Box>

      <Box sx={{ mb: 1 }}>
        <Box className='col-span-6 xl:col-span-3 2xl:col-span-1 '>
          <Button
            onClick={() =>
              handlePrint(
                'api/DashBoard/products-balance-report',
                `Products-Balance-report-${formatDate(new Date())}.pdf`,
                auth
              )
            }
            className='hover:text-white hover:bg-[#df4141] text-[#df4141]  text-4xl px-3 py-3'
          >
            <i className='fa fa-file-pdf-o'></i>
          </Button>
          <Button
            onClick={() =>
              handleExcel(
                'api/DashBoard/products-balance-excel',
                `Products-Balance-report-${formatDate(new Date())}.xlsx`,
                auth
              )
            }
            className='hover:text-white hover:bg-[#389f51] text-[#389f51]  text-4xl px-3 py-3'
          >
            <i className='fa fa-file-excel-o'></i>
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 5 }}>
        <Card>
          <TableContainer sx={{ width: '100%' }}>
            <CustomTableHeader
              columns={dashbCols1(true)}
              onSortClick={sortData}
            />
            <CustomTableBody
              data={tableRows}
              columns={dashbCols1(true)}
            />
            <CustomPagination
              totalCount={productBalances.length}
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

      <Box>
        <Button
          onClick={() =>
            handlePrint(
              'api/CustomerOrders/report',
              `Customer-order-report-${formatDate(new Date())}.pdf`,
              auth
            )
          }
          className='hover:text-white hover:bg-[#df4141] text-[#df4141]  text-4xl px-3 py-3'
        >
          <i className='fa fa-file-pdf-o'></i>
        </Button>
        <Button
          onClick={() =>
            handleExcel(
              'api/CustomerOrders/report-excel',
              `Customer-order-report-${formatDate(new Date())}.xlsx`,
              auth
            )
          }
          className='hover:text-white hover:bg-[#389f51] text-[#389f51]  text-4xl px-3 py-3'
        >
          <i className='fa fa-file-excel-o'></i>
        </Button>
      </Box>
      <EnhancedTable
        headCells={headCells2}
        rows={rows2 || []}
        onView={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <Modal
          showSave={true}
          closeModal={() => setIsModalOpen(false)}
        >
          hello
        </Modal>
      )}
    </>
  );
}
