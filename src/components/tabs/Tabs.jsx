/* eslint-disable react/prop-types */
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export default function LabTabs({ tabsOptions }) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue.toString());
  };

  return (
    <Box className="w-full h-[calc(100vh-72px)] overflow-scroll bg-[#F8F9FB]">
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "white",
          }}
        >
          <TabList className={'scroll-tab-mob'} onChange={handleChange} aria-label="lab API tabs example">
            {tabsOptions.map(({ label }, i) => (
              <Tab key={i} label={label} value={(i + 1).toString()} />
            ))}
          </TabList>
        </Box>
        {tabsOptions.map(({ value }, i) => (
          <TabPanel className={'tabs-content'} key={i} value={(i + 1).toString()}>
            {value}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
