import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import PropTypes from "prop-types";

export default function SimpleCharts({
  labels,
  chartId,
  chartType,
  data,
  width,
  height,
  className,
}) {
  return (
    <Box className={className} sx={{ boxShadow: 2, width: "100%" }}>
      <BarChart
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "white",
        }}
        xAxis={[
          {
            id: chartId || "barCategories",
            data: labels,
            scaleType: chartType || "band",
          },
        ]}
        series={[
          {
            data: data,
          },
        ]}
        width={width}
        height={height}
      />
    </Box>
  );
}

SimpleCharts.propTypes = {
  className: PropTypes.string,
  labels: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  chartType: PropTypes.string,
  chartId: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};
