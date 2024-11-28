import { PieChart } from "@mui/x-charts/PieChart";

export default function PieStats({ data, width, height }) {
  return (
    <PieChart
      series={[
        {
          data: data,
        },
      ]}
      width={width}
      height={height}
      skipAnimation
    />
  );
}
