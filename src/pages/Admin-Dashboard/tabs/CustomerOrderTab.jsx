import { Box } from "@mui/material";
import DashboardCard from "../../../components/cards/dashboardCard/dashboardCard";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import useFetch from "../../../shared/useFetch";
export default function CustomerOrderTab() {
  const { data } = useFetch("DashBoard/customer-stats");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "30px 10px",
          width: "100%",
        }}
      >
        <DashboardCard
          title="Total Customers"
          value={data?.totalCustomers}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title="Total Customer Order"
          value={data?.totalCustomerOrders}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title="Total Customer Order In Progress"
          value={data?.totalCustomerOrdersInProgress}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title="Total Customer Order Rejected"
          value={data?.totalCustomerOrdersRejected}
          icon={<GroupIcon />}
        />
        <DashboardCard
          title="Total Customer Order Delivered"
          value={data?.totalCustomerOrdersDelivered}
          icon={<GroupIcon />}
        />
      </Box>
    </>
  );
}
