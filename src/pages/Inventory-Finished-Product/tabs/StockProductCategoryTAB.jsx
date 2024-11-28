import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import useFetch from "../../../shared/useFetch";

export default function StockProductCategoryTAB() {
  const [selectValue, setSelectValue] = useState();
  const auth = useContext(AuthContext);
  const [data, setData] = useState();

  const { data: itemsList } = useFetch("items/finished");
  const itemsValue = itemsList?.map((elem) => {
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
      const response = await axios.get(
        `api/stock/finished-product/item/${selectValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setData(response.data);
    } catch (error) {
      setData([]);
    }
  };
  const headCells = [
    {
      id: "WareHouse",
      numeric: false,
      disablePadding: true,
      label: "WareHouse",
    },
    {
      id: "Zone",
      numeric: true,
      disablePadding: false,
      label: "Zone",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "totalQuantity",
      numeric: true,
      disablePadding: false,
      label: "Total Quantity",
    },
    {
      id: "quantityPerUnit",
      numeric: true,
      disablePadding: false,
      label: "Quantity By Unit",
    },
    {
      id: "Unit",
      numeric: true,
      disablePadding: false,
      label: "Unit",
    },
    {
      id: "TotalQuantityByPiece",
      numeric: true,
      disablePadding: false,
      label: "Total Quantity By Piece",
    },
    /*  {
      id: "UnderProcessingQuantity",
      numeric: true,
      disablePadding: false,
      label: "Under Processing Quantity",
    }, */
  ];

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      WareHouse: elem.warehouseName,
      Zone: elem.zoneName,
      Product: elem.subItemName,
      totalQuantity: elem.totalQuantity.toFixed(2),
      quantityPerUnit: elem.quantityPerUnit.toFixed(2),
      Unit: elem.unit,
      TotalQuantityByPiece: elem.totalQuantityByPiece.toFixed(2),
      UnderProcessingQuantity: "",
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
        selectOptions={itemsValue || []}
      />
      <EnhancedTable rows={rows || []} headCells={headCells} />
    </>
  );
}
