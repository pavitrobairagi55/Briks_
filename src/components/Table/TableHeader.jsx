import { useState } from 'react';
import {
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { flexStyles } from '../../utils/flexStyles';
import PropTypes from 'prop-types';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    '&:hover': {
      '& .icon': {
        visibility: 'visible',
      },
    },
  },
}));

/**
 * Table header component with sortable columns and icons that are displayed
 * when the user hovers over the respective column.
 *
 * @param {TableHeaderProps} props - The component props.
 * @returns {ReactElement} The rendered table header component.
 */
const CustomTableHeader = ({ columns, onSortClick }) => {
  const [localColumns, setLocalColumns] = useState([...columns]);

  const sortColumns = (sortVals) => {
    const lColumns = [...columns];
    lColumns.forEach((col, i) => {
      if (col.sort.key === sortVals.key) {
        lColumns[i] = { ...col, sort: sortVals };
        onSortClick(sortVals);
      } else {
        lColumns[i] = {
          ...col,
          sort: { key: col.sort.key, value: 1, sorted: false },
        };
      }
    });
    setLocalColumns(lColumns);
  };

  return (
    <TableHead>
      <TableRow sx={{ height: '44px' }}>
        {localColumns.map((column) => (
          <StyledTableCell
            key={column.id}
            sx={{
              minWidth: column.width,
              p: 0,
              pl: '10px',
            }}
          >
            <Box
              sx={{
                ...flexStyles.flexRowJustifyStart,
                justifyContent: column.align,
              }}
            >
              <Typography
                variant={'body2'}
                sx={{ fontWeight: 500 }}
              >
                {column.label}
              </Typography>
              {column?.sort && (
                <IconButton
                  className='icon'
                  sx={{
                    ml: 0.5,
                    visibility: column.sort.sorted ? 'visible' : 'hidden',
                    opacity: column.sort.sorted ? '1' : '0.5',
                  }}
                  size='small'
                >
                  {column.sort.sorted ? (
                    <>
                      {column.sort.value === -1 ? (
                        <NorthIcon
                          sx={{
                            height: '12px',
                            width: '12px',
                          }}
                          onClick={() => {
                            sortColumns({
                              ...column.sort,
                              value: 1,
                              sorted: true,
                            });
                          }}
                        />
                      ) : (
                        <SouthIcon
                          sx={{
                            height: '12px',
                            width: '12px',
                          }}
                          onClick={() => {
                            sortColumns({
                              ...column.sort,
                              value: -1,
                              sorted: true,
                            });
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {column.sort.value === -1 ? (
                        <NorthIcon
                          sx={{
                            height: '12px',
                            width: '12px',
                          }}
                          onClick={() => {
                            sortColumns({
                              ...column.sort,
                              value: 1,
                              sorted: true,
                            });
                          }}
                        />
                      ) : (
                        <SouthIcon
                          sx={{
                            height: '12px',
                            width: '12px',
                          }}
                          onClick={() => {
                            sortColumns({
                              ...column.sort,
                              value: -1,
                              sorted: true,
                            });
                          }}
                        />
                      )}
                    </>
                  )}
                </IconButton>
              )}
            </Box>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CustomTableHeader;

CustomTableHeader.propTypes = {
  onSortClick: PropTypes.func,
  columns: PropTypes.array,
};
