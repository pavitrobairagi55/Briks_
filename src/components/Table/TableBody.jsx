import { TableCell, TableRow, TableBody } from '@mui/material';
import { elipses } from '../../utils/globalCommonStyles';
import PropTypes from 'prop-types';

const CustomTableBody = ({ data, columns }) => {
  const columnsdata = columns.map((col) => ({
    key: col.sort.key,
    width: col.width,
    align: col.align,
  }));
  return (
    <TableBody>
      {data.map((row, i) => (
        <TableRow key={i}>
          {columnsdata.map((col, j) => (
            <TableCell
              align={col.align}
              sx={{ maxWidth: col.width, minWidth: col.width, ...elipses }}
              key={`${i}-${j}`}
            >
              {' '}
              {row[col.key]}{' '}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default CustomTableBody;

CustomTableBody.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
};
