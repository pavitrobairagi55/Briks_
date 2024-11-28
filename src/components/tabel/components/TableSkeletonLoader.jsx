import { Skeleton, TableCell, TableRow } from "@mui/material";

const TableRowsLoader = ({ rowsNum, columNum }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      {[...Array(columNum)].map((colum, i) => (
        <TableCell key={i} component="th" scope="row">
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableRowsLoader;
