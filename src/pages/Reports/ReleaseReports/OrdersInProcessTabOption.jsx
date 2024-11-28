import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
export default function OrdersInProcessTabOption() {
  const [date, setDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [urlAPI, setUrlAPI] = useState();
  const [urlPDF, setUrlPDF] = useState();
  const [urlEXCEL, setUrlEXCEL] = useState();

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const auth = useContext(AuthContext);

  useEffect(() => {
    let urlapi = "api/CustomerOrders/in-process-orders-report-data?";
    let urlPDFlink = "/api/CustomerOrders/in-process-orders-report?";
    let urlEXCELlink = "/api/CustomerOrders/in-process-orders-report-excel?";

    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
      urlPDFlink +=
        (urlPDFlink[urlPDFlink.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
      urlEXCELlink +=
        (urlEXCELlink[urlEXCELlink.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
    }
    setUrlAPI(urlapi);
    setUrlPDF(urlPDFlink);
    setUrlEXCEL(urlEXCELlink);
    fetchData(urlapi);
  }, [date]);
  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setData(response.data);
    } catch (error) {}
    setIsLoading(false);
  };
  const rows = data?.map((elem) => {
    return {
      Date: formatDate(elem.date),
      DGCLAssetContractorName: elem.customerName,
      Product: elem.product,
      Quantity: elem.quantity,
      Unit: elem.unit,
      Subcategory: elem.category,
    };
  });

  const headCells = [
    {
      id: "Date",
      numeric: false,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "DGCLAssetContractorName",
      numeric: true,
      disablePadding: false,
      label: "DGCL Asset Contractor Name",
    },
    {
      id: "Subcategory",
      numeric: true,
      disablePadding: false,
      label: "Category",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },

    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "Unit",
      numeric: true,
      disablePadding: false,
      label: "Unit",
    },
  ];
  return (
    <>
      <HeaderFilter
        date={date}
        dateChange={updateDates}
        dateExist
        onPrint={() =>
          handlePrint(
            urlPDF,
            `Orders-In-Process-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        print={true}
        onExport={() =>
          handleExcel(
            urlEXCEL,
            `Orders-In-Process-excel-report-${formatDate(new Date())}.xlsx`,
            auth
          )
        }
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
    </>
  );
}
