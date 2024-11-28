/* eslint-disable react/prop-types */
import { Box, Button, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import BasicSelect from "./components/Select";
import Search from "./components/search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Print } from "@mui/icons-material";
import dayjs from "dayjs";

const HeaderFilter = (props) => {
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {props.button && (
          <Button
            size="large"
            variant="outlined"
            onClick={props.buttonClick}
            sx={{
              alignSelf: "end",
              width: "20%",
              maxWidth: "250px",
            }}
            endIcon={<AddBoxIcon />}
            className="bg-[#3B81F6] text-white hover:text-[#3B81F6]"
          >
            {props.button}
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "30px 15px",
          }}
          className="grid grid-cols-6 gap-4 mb-20 flex justify-between"
        >
          {(props.dateExist || props.date) && (
            <Box className="col-span-6 xl:col-span-3 2xl:col-span-2">
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "start",
                }}
              >
                <DatePicker
                  label="Start Date"
                  value={props.date ? props.date[0] : null}
                  onChange={(val) =>
                    props.dateChange(
                      dayjs(val).format("YYYY-MM-DD"),
                      props.date ? props.date[1] : null
                    )
                  }
                />
                <DatePicker
                  label="End Date"
                  value={props.date ? props.date[1] : null}
                  onChange={(val) =>
                    props.dateChange(
                      props.date ? props.date[0] : null,
                      dayjs(val).format("YYYY-MM-DD")
                    )
                  }
                />
              </Box>
            </Box>
          )}

          {(props.print || props.export) && (
            <Box className="col-span-6 xl:col-span-3 2xl:col-span-1">
              {props.print && (
                <button
                  onClick={() => props.onPrint()}
                  className="hover:text-white hover:bg-[#df4141] text-[#df4141]  text-4xl px-3 py-3"
                >
                  <i className="fa fa-file-pdf-o"></i>
                </button>
              )}
              {props.export && (
                <button
                  onClick={() => props.onExport()}
                  className="hover:text-white hover:bg-[#389f51] text-[#389f51]  text-4xl px-3 py-3"
                >
                  <i className="fa fa-file-excel-o"></i>
                </button>
              )}
            </Box>
          )}
          {props.selectExists && (
            <Box className="col-span-6 sm:col-span-3 xl:col-span-3 2xl:col-span-2">
              <BasicSelect
                value={props.selectValue}
                handleChange={props.selectChange}
                options={props.selectOptions}
              />
            </Box>
          )}
          {props.searchExist && (
            <Box className="col-span-6 sm:col-span-3 xl:col-span-2 md:flex">
              <Search
                value={props.search}
                onChange={props.seachChange}
                placeholder={props.searchPlaceHolder}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default HeaderFilter;
