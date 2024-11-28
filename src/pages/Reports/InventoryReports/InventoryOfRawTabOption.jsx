import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import useFetch from "../../../shared/useFetch";

export default function InventoryOfRawTabOption() {
  const [date, setDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [urlAPI, setUrlAPI] = useState();
  const [urlPDF, setUrlPDF] = useState();
  const [urlEXCEL, setUrlEXCEL] = useState();

  const [selectValue, setSelectValue] = useState();

  const { data: subItems } = useFetch("SubItems?isFinished=false");
  const subItemsList = subItems?.map((elem) => ({
    id: elem.id,
    value: elem.name,
  }));

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const auth = useContext(AuthContext);

  useEffect(() => {
    let urlapi = `api/Voucher/raw-materials-inventory-report-data?ProductId=${selectValue}`;
    let urlPDFlink = `/api/Voucher/raw-materials-inventory-report?ProductId=${selectValue}`;
    let urlEXCELlink = `/api/Voucher/raw-materials-inventory-report-excel?ProductId=${selectValue}`;
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
    if (selectValue) fetchData(urlapi);
  }, [date, selectValue]);
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
      Description: elem.description,
      DocumentNumber: elem.documentNumber,
      QuantityIn: elem.quantityIn,
      QuantityOut: elem.quantityOut,
      Balance: elem.balance,
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
      id: "Description",
      numeric: true,
      disablePadding: false,
      label: "Description",
    },
    {
      id: "DocumentNumber",
      numeric: true,
      disablePadding: false,
      label: "Document Number",
    },
    {
      id: "QuantityIn",
      numeric: true,
      disablePadding: false,
      label: "Quantity In",
    },
    {
      id: "QuantityOut",
      numeric: true,
      disablePadding: false,
      label: "Quantity Out",
    },
    {
      id: "Balance",
      numeric: true,
      disablePadding: false,
      label: "Balance",
    },
  ];
  return (
    <>
      <HeaderFilter
        selectExists
        selectValue={selectValue}
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={subItemsList || []}
        date={date}
        dateChange={updateDates}
        dateExist
        onPrint={() =>
          handlePrint(
            urlPDF,
            `Raw-Material-Inventory-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        print={true}
        onExport={() =>
          handleExcel(
            urlEXCEL,
            `Raw-Material-Inventory-excel-report-${formatDate(
              new Date()
            )}.xlsx`,
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
