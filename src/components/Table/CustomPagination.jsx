import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import {
  rowsPerPageOptions,
  typographyKeys,
} from '../../utils/commonConstants';
import { flexStyles } from '../../utils/flexStyles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronRightSharpIcon from '@mui/icons-material/ChevronRightSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';

const styles = {
  rowsPerPageBox: {
    height: '30px',
    minWidth: '30px',
    border: '1px solid',
    borderColor: '#999999',
    p: '8px',
    backgroundColor: '#ffffff',
    gap: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

/**
 * CustomPagination component for managing pagination functionality.
 *
 * @component
 * @param {CustomPaginationProps} props - The props for the CustomPagination component.
 * @returns {React.ReactElement} React element representing the CustomPagination component.
 */
const CustomPagination = ({
  totalCount,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const [pageAnchorEl, setPageAnchorEl] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const pageMenuOpen = pageAnchorEl;

  /**
   * Handle page change when navigating to the previous or next page.
   * @param {number} page - The target page.
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**
   * Close the rows per page menu.
   */
  const handleMenuClose = () => {
    setPageAnchorEl(null);
  };

  /**
   * Handle click on the number of rows per page box to open the menu.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - The click event.
   */
  const handleNorOfRowsClick = (e) => {
    setPageAnchorEl(e.currentTarget);
  };

  /**
   * Handle click on a menu item to change the number of rows per page.
   * @param {React.MouseEvent<HTMLLIElement, MouseEvent>} e - The click event.
   * @param {RowsPerPageProps} item - The selected rows per page item.
   */
  const handleMenuItemClick = (e, item) => {
    setRowsPerPage(item);
    handleMenuClose();
  };

  useEffect(() => {
    // Calculate the number of pages
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    setTotalPages(totalPages);
    setCurrentPage(0);
  }, [rowsPerPage, totalCount]);

  return (
    <Box sx={{ ...flexStyles.flexRowFlexEnd, mt: 5, mb: 2 }}>
      <Box sx={{ ...flexStyles.flexAlignCenter, gap: '16px' }}>
        <Box
          sx={flexStyles.flexAlignCenter}
          gap='10px'
        >
          <Typography variant={typographyKeys.body2}>
            {'Rows per page'}
          </Typography>

          <Box
            sx={{ ...flexStyles.flexAlignCenter, ...styles.rowsPerPageBox }}
            onClick={(e) => handleNorOfRowsClick(e)}
          >
            <Typography
              variant={typographyKeys.body1}
              sx={{ color: '#58858D' }}
            >
              {rowsPerPage}
            </Typography>
            <ArrowDropDownIcon />
          </Box>

          <Menu
            anchorEl={pageAnchorEl}
            open={pageMenuOpen}
            onClose={handleMenuClose}
          >
            {rowsPerPageOptions.map((item) => {
              return (
                <MenuItem
                  key={item.value}
                  onClick={(e) => handleMenuItemClick(e, item.value)}
                  value={item.value}
                >
                  <Typography variant={typographyKeys.body2}>
                    {item.text}
                  </Typography>
                </MenuItem>
              );
            })}
          </Menu>
        </Box>

        <Box
          sx={flexStyles.flexAlignCenter}
          gap='10px'
        >
          <Typography
            variant={typographyKeys.body2}
            sx={{ width: '75px', display: 'flex', justifyContent: 'end' }}
          >
            {
              // eslint-disable-next-line no-mixed-operators
              currentPage * rowsPerPage +
                1 +
                '-' +
                `${
                  +currentPage * +rowsPerPage + +rowsPerPage > +totalCount
                    ? totalCount
                    : currentPage * rowsPerPage + rowsPerPage
                }` +
                ' of ' +
                totalCount
            }
          </Typography>

          <IconButton
            size='small'
            sx={{
              height: '30px',
              width: '30px',
            }}
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeftSharpIcon
              sx={{
                height: '30px',
                width: '30px',
              }}
            />
          </IconButton>

          <IconButton
            size='small'
            sx={{
              height: '30px',
              width: '30px',
            }}
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRightSharpIcon
              sx={{
                height: '30px',
                width: '30px',
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomPagination;

CustomPagination.propTypes = {
  totalCount: PropTypes.number,
  rowsPerPage: PropTypes.number,
  setRowsPerPage: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};
