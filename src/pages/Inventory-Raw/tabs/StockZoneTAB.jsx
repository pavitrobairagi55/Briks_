import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import useFetch from "../../../shared/useFetch";

export default function StockZoneTAB() {
  const [selectValue, setSelectValue] = useState();
  const auth = useContext(AuthContext);
  const [data, setData] = useState();
  const { data: zonesList } = useFetch("zones");

  const zonesValue = zonesList?.map((elem) => {
    return {
      id: elem.id,
      value: elem.name,
    };
  });

  useEffect(() => {
    if (selectValue) {
      fetchData();
    }
  }, [selectValue]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/stock/product/${selectValue}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      setData([]);
    }
  };

  const headCells = [
    {
      id: "ProductCategory",
      numeric: false,
      disablePadding: true,
      label: "Product Category",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "TotalQuantityByPiece",
      numeric: true,
      disablePadding: false,
      label: "Total Quantity By Piece",
    },
    {
      id: "TotalQuantity",
      numeric: true,
      disablePadding: false,
      label: "Total Quantity",
    },
    {
      id: "Unit",
      numeric: true,
      disablePadding: false,
      label: "Unit",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ProductCategory: elem.itemName,
      Product: elem.subItemName,
      TotalQuantityByPiece: elem.totalQuantityByPiece,
      TotalQuantity: elem.totalQuantity,
      Unit: elem.unit,
    };
  });
  return (
    <>
      {!selectValue && (
        <p className="text-red-500 font-semibold text-xl">
          Please select an option
        </p>
      )}{" "}
      <HeaderFilter
        selectExists
        selectValue={selectValue}
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={zonesValue || []}
      />
      <EnhancedTable rows={rows || []} headCells={headCells} />
    </>
  );
}
