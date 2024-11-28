import { Box } from "@mui/material";
import EnhancedTable from "../../../components/tabel/Table";
import DashboardCard from "../../../components/cards/dashboardCard/dashboardCard";
import SimpleCharts from "../../../components/charts/chart";
import GroupIcon from "@mui/icons-material/Group";

import Modal from "../../../components/Modal";
import { useContext, useEffect, useState } from "react";
import useFetch from "../../../shared/useFetch";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import HeaderFilter from "../../../components/filters/HeaderFilter";
export default function DashboardTab() {
  const [isModalOpen, setIsModalOpen] = useState();
  const { data } = useFetch("DashBoard/customer-stats");
  const { data: customerOrders } = useFetch("CustomerOrders");

  const [productBalances, setProductBalances] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`api/dashboard/products-balance`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setProductBalances(response.data);
    } catch (error) {
      setProductBalances([]);
    }
  };

  const productOrder = [
    "40*20*10",
    "Plaster Dry mix",
    "Mortar Dry Mix",
    "Ready made mud plaster",
    "Athel A1 125 -150 mm",
    "Athel A2 125 -150 mm",
    "Athel A3 150-250 mm",
    "Athel B1 75-100 mm",
    "Athel B1 100-125 mm",
    "Athel B2 75-100 mm",
    "Athel B2 100-125 mm",
    "Athel B3 50-75mm",
    "Mortar",
  ];

  const rows = productBalances
    ?.map((elem) => {
      return {
        id: elem.productId,
        Product: elem.productName,
        TotalQuantity: elem.totalQuantity,
        FreeQuantity: elem.freeQuantity,
        UnderProcessing: elem.underProcessingQuantity,
      };
    })
    ?.sort((a, b) => {
      const indexA = productOrder.indexOf(a.Product);
      const indexB = productOrder.indexOf(b.Product);
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) {
        return -1;
      }
      if (indexB !== -1) {
        return 1;
      }
      return a.Product.localeCompare(b.Product);
    });
  const labels = productBalances?.map((elem) => elem.productName);

  const labelsData = productBalances?.map((elem) => elem.totalQuantity);
  const headCells = [
    {
      id: "Product",
      numeric: false,
      disablePadding: true,
      label: "Product",
    },
    {
      id: "TotalQuantity",
      numeric: true,
      disablePadding: false,
      label: "Total Quantity",
    },
    {
      id: "FreeQuantity",
      numeric: true,
      disablePadding: false,
      label: "Free Quantity",
    },
    {
      id: "UnderProcessing",
      numeric: true,
      disablePadding: false,
      label: "Under Processing",
    },
  ];

  const headCells2 = [
    {
      id: "CONumber",
      numeric: false,
      disablePadding: true,
      label: "CO Number",
    },
    {
      id: "CustomerName",
      numeric: true,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "ExpectedDeliveryDate",
      numeric: true,
      disablePadding: false,
      label: "Expected Delivery Date",
    },
    {
      id: "OrderQty",
      numeric: true,
      disablePadding: false,
      label: "Order Qty",
    },
    {
      id: "QtyPerUnit",
      numeric: true,
      disablePadding: false,
      label: "Qty Per Unit",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
  ];
  const rows2 = customerOrders?.map((elem) => {
    return {
      id: elem.id,
      CONumber: elem.id,
      CustomerName: elem.user?.firstName + " " + elem.user.lastName,
      Product: elem.product?.name,
      ExpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      OrderQty: elem.quantity.toFixed(2),
      QtyPerUnit: elem.quantityPerUnit,
      Status: elem.status?.name,
    };
  });

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

      <Box className="grid grid-cols-5 gap-4 mb-20">
        <Box className="col-span-5 xl:col-span-3">
          <Box className="col-span-6 xl:col-span-3 2xl:col-span-1 ">
            <button
              onClick={() =>
                handlePrint(
                  "api/DashBoard/products-balance-report",
                  `Products-Balance-report-${formatDate(new Date())}.pdf`,
                  auth
                )
              }
              className="hover:text-white hover:bg-[#df4141] text-[#df4141]  text-4xl px-3 py-3"
            >
              <i className="fa fa-file-pdf-o"></i>
            </button>
            <button
              onClick={() =>
                handleExcel(
                  "api/DashBoard/products-balance-excel",
                  `Products-Balance-report-${formatDate(new Date())}.xlsx`,
                  auth
                )
              }
              className="hover:text-white hover:bg-[#389f51] text-[#389f51]  text-4xl px-3 py-3"
            >
              <i className="fa fa-file-excel-o"></i>
            </button>
          </Box>
          <EnhancedTable
            headCells={headCells}
            rows={rows || []}
            className="col-span-5 xl:col-span-3"
          />
        </Box>
        {productBalances?.length && (
          <SimpleCharts
            className="col-span-5 xl:col-span-2"
            labels={labels || []}
            data={labelsData || []}
          />
        )}
      </Box>
      <Box className="col-span-6 xl:col-span-3 2xl:col-span-1 ">
        <button
          onClick={() =>
            handlePrint(
              "api/CustomerOrders/report",
              `Customer-order-report-${formatDate(new Date())}.pdf`,
              auth
            )
          }
          className="hover:text-white hover:bg-[#df4141] text-[#df4141]  text-4xl px-3 py-3"
        >
          <i className="fa fa-file-pdf-o"></i>
        </button>
        <button
          onClick={() =>
            handleExcel(
              "api/CustomerOrders/report-excel",
              `Customer-order-report-${formatDate(new Date())}.xlsx`,
              auth
            )
          }
          className="hover:text-white hover:bg-[#389f51] text-[#389f51]  text-4xl px-3 py-3"
        >
          <i className="fa fa-file-excel-o"></i>
        </button>
      </Box>
      <EnhancedTable
        headCells={headCells2}
        rows={rows2 || []}
        onView={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <Modal showSave={true} closeModal={() => setIsModalOpen(false)}>
          hello
        </Modal>
      )}
    </>
  );
}
