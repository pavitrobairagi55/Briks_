import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate, handleExcel, handlePrint } from "../../../utils";

export default function InventoryAgingTabOption() {
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
    let urlapi = "api/Voucher/inventory-aging-report-data?";
    let urlPDFlink = "/api/Voucher/inventory-aging-report?";
    let urlEXCELlink = "/api/Voucher/inventory-aging-report-excel?";

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
      Category: elem.category,
      Product: elem.product,
      SlabOf1: elem.slab_1_15_Days,
      SlabOf16: elem.slab_16_30_Days,
      SlabOf31: elem.slab_31_45_Days,
      SlabOf46: elem.slab_46_60_Days,
      SlabOf61: elem.slab_61_75_Days,
      SlabOf76: elem.slab_75_90_Days,
      SlabOf91: elem.slab_91_120_Days,
      Over120: elem.over_120_Days,
    };
  });
  const headCells = [
    {
      id: "Category",
      numeric: false,
      disablePadding: false,
      label: "Category",
    },
    {
      id: "Product",
      numeric: false,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "SlabOf1",
      numeric: false,
      disablePadding: false,
      label: "Slab Of 1-15 days",
    },
    {
      id: "SlabOf16",
      numeric: false,
      disablePadding: false,
      label: "Slab Of 16-30 days",
    },
    {
      id: "SlabOf31",
      numeric: false,
      disablePadding: false,
      label: "Slab Of 31-45 days",
    },
    {
      id: "SlabOf46",
      numeric: false,
      disablePadding: false,
      label: "Slab Of 46-60 days",
    },
    {
      id: "SlabOf61",
      numeric: false,
      disablePadding: false,
      label: "Slab Of 61-75 days",
    },
    {
      id: "SlabOf76",
      numeric: false,
      disablePadding: false,
      label: "Slab Of 76-90 days",
    },
    {
      id: "SlabOf91",
      numeric: false,
      disablePadding: false,
      label: "Slab Of 91-120 days",
    },
    {
      id: "Over120",
      numeric: false,
      disablePadding: false,
      label: "Over 120 Days",
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
            `Agin-Inventory-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        print={true}
        onExport={() =>
          handleExcel(
            urlEXCEL,
            `Agin-Inventory-excel-report-${formatDate(new Date())}.xlsx`,
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
