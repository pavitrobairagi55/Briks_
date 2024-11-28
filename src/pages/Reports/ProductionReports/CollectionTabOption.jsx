import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate, handleExcel, handlePrint } from "../../../utils";

export default function CollectionTabOption() {
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
    let urlapi = "api/Collection/collection-report-data?";
    let urlPDFlink = "/api/Collection/collection-report?";
    let urlEXCELlink = "/api/Collection/collection-report-excel?";

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
      Product: elem.product,
      ProductSubCategory: elem.category,
      Quantity: elem.quantity,
      Warehouse: elem.warehouse,
      Zone: elem.zone,
      Unit: elem.unit,
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
      id: "Warehouse",
      numeric: true,
      disablePadding: false,
      label: "Warehouse",
    },
    {
      id: "Zone",
      numeric: true,
      disablePadding: false,
      label: "Zone",
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
            `Collection-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        print={true}
        onExport={() =>
          handleExcel(
            urlEXCEL,
            `Collection-excel-report-${formatDate(new Date())}.xlsx`,
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
