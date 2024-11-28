import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import EnhancedTableHead from "./components/TableHeader";
import { Delete, Visibility, Edit, Print } from "@mui/icons-material/";
import { IconButton } from "@mui/material";
import TableRowsLoader from "./components/TableSkeletonLoader";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable({
  headCells,
  loading,
  rows,
  toolbar,
  onPrint,
  onDelete,
  onEdit,
  onView,
  className,
  pageNumber,
  documentPerPage,
  setPageNumber,
  setDocumentPerPage,
  rowsCount,
}) {
  const [order, setOrder] = React.useState();
  const [orderBy, setOrderBy] = React.useState();
  const [page, setPage] = React.useState(pageNumber || 0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(documentPerPage || 5);
  if (!toolbar?.length) {
    toolbar = [];
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    if (pageNumber !== undefined && documentPerPage !== undefined) {
      setPageNumber(newPage);
      setPage(newPage);
    } else setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    if (pageNumber !== undefined && documentPerPage !== undefined) {
      setDocumentPerPage(parseInt(event.target.value, 10));
      setPageNumber(0);
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    } else {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    }
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box className={className}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
            <EnhancedTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rowsCount || rows?.length}
              toolbar={toolbar}
            />
            <TableBody>
              {loading ? (
                <TableRowsLoader
                  columNum={headCells?.length + toolbar?.length}
                  rowsNum={rowsPerPage}
                />
              ) : (
                visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id || index}
                      sx={{ cursor: "pointer" }}
                    >
                      {headCells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          component="th"
                          id={labelId}
                          scope="row"
                          align={cell.numeric ? "right" : "left"}
                        >
                          {row[cell.id]}
                        </TableCell>
                      ))}

                      {toolbar.includes("View") && (
                        <TableCell>
                          <IconButton
                            onClick={() => onView(row.id)}
                            aria-label="add to shopping cart"
                            className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white"
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      )}
                      {toolbar.includes("Edit") && (
                        <TableCell>
                          <IconButton
                            onClick={() => onEdit(row.id)}
                            color="primary"
                            aria-label="add to shopping cart"
                            className="text-white bg-[#21C55D] hover:text-[#21C55D] hover:bg-white"
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                      )}
                      {toolbar.includes("Delete") && (
                        <TableCell>
                          <IconButton
                            onClick={() => onDelete(row.id)}
                            color="primary"
                            aria-label="add to shopping cart"
                            className="text-white bg-[#F59E0B] hover:text-[#F59E0B] hover:bg-white"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      )}
                      {toolbar.includes("Print") && (
                        <TableCell>
                          <IconButton
                            onClick={() => onPrint(row.id)}
                            color="primary"
                            aria-label="add to shopping cart"
                            className="text-white bg-[#21C55D] hover:text-[#21C55D] hover:bg-white"
                          >
                            <Print />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

EnhancedTable.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  onPrint: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  toolbar: PropTypes.array,
  headCells: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};
