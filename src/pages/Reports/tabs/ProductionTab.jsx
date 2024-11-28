import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import ProductionTabOption from "../ProductionReports/ProductionTabOption";
import CollectionTabOption from "../ProductionReports/CollectionTabOption";
import StorageTabOption from "../ProductionReports/StorageTabOption";

export default function ProductionTab() {
  const [selectValue, setSelectValue] = useState();
  const optionList = [
    { id: "PRODUCTION_REPORT", value: "Production Report" },
    { id: "COLLECTION_REPORT", value: "Collection Report" },
    { id: "STORAGE_REPORT", value: "Storage Report" },
  ];

  return (
    <>
      <HeaderFilter
        selectExists
        selectValue={selectValue}
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={optionList}
      />
      {selectValue === "PRODUCTION_REPORT" && <ProductionTabOption />}
      {selectValue === "COLLECTION_REPORT" && <CollectionTabOption />}
      {selectValue === "STORAGE_REPORT" && <StorageTabOption />}
    </>
  );
}
