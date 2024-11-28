import { Box, Card, TableContainer } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import CustomTableHeader from '../../../components/Table/TableHeader';
import { dashbCols1 } from '../../Admin-Dashboard/tabs/dashboardConstants';
import CustomTableBody from '../../../components/Table/TableBody';
import CustomPagination from '../../../components/Table/CustomPagination';
import { sliceTable, sortArrOfObj } from '../../../utils/utils';
import { AuthContext } from '../../../shared/authContext';
import { fetchDashboardData } from '../../Admin-Dashboard/tabs/dashboardFunctions';

const InventoryByWareHouseReport = () => {
  const [date, setDate] = useState({ start: null, end: null });
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

  return (
    <Box>
      <Box sx={{display: 'flex', gap: 5}}>
        <DatePicker
          label='Start Date'
          value={date.start}
          onChange={(val) =>
            setDate((state) => ({
              ...state,
              start: dayjs(val).format('YYYY-MM-DD'),
            }))
          }
        />
        <DatePicker
          label='End Date'
          value={date.end}
          onChange={(val) =>
            setDate((state) => ({
              ...state,
              end: dayjs(val).format('YYYY-MM-DD'),
            }))
          }
        />
      </Box>
      <Card sx={{ mt: 3 }}>
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
    </Box>
  );
};

export default InventoryByWareHouseReport;
