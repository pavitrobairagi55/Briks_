import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
export default function OrderSheetTabOption() {
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
    let urlapi = "api/CustomerTrips/daily-order-sheet-report-data?";
    let urlPDFlink = "api/CustomerTrips/daily-order-sheet-report?";
    let urlEXCELlink = "api/CustomerTrips/daily-order-sheet-report-excel?";
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
      CustomerName: elem.customerName,
      Product: elem.product,
      ProductSubCategory: elem.category,
      Quantity: elem.quantity,
      Unit: elem.unit,
      PriorityLevel: elem.priority,
      ArrivalTimeSlot: elem.arrivalTime,
      Status: elem.status,
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
      id: "CustomerName",
      numeric: true,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "ProductSubCategory",
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
    {
      id: "PriorityLevel",
      numeric: true,
      disablePadding: false,
      label: "Priority Level",
    },
    {
      id: "ArrivalTimeSlot",
      numeric: true,
      disablePadding: false,
      label: "Arrival Time Slot",
    },
    /* {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    }, */
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
            `Orders-Sheet-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        print={true}
        onExport={() =>
          handleExcel(
            urlEXCEL,
            `Orders-Sheet-excel-report-${formatDate(new Date())}.xlsx`,
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
