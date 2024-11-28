import { useCallback, useContext, useEffect, useState } from 'react';
import HeaderFilter from '../../../components/filters/HeaderFilter';
import { Box } from '@mui/material';
import BasicInventoryTabOption from '../InventoryReports/BasicInventoryTabOption';
import AsOfInventoryTabOption from '../InventoryReports/AsOfInventoryTabOption';
import InventoryBinCardsTabOption from '../InventoryReports/InventoryBinCardsTabOption';
import ZoneWiseBricksInventoryTabOption from '../InventoryReports/ZoneWiseBricksInventoryTabOption';
import MortarDryMixInventoryTabOption from '../InventoryReports/MortarDryMixInventoryTabOption';
import PlasterDryMixInventoryTabOption from '../InventoryReports/PlasterDryMixInventoryTabOption';
import InventoryOfRawTabOption from '../InventoryReports/InventoryOfRawTabOption';
import InventoryAgingTabOption from '../InventoryReports/InventoryAgingTabOption';
import InventoryByWareHouseReport from '../InventoryReports/InventoryByWareHouseReport';
import { AuthContext } from '../../../shared/authContext';
import { fetchWarehouses } from '../InventoryReports/InventoryReportFunctions';

export default function Inventory2Tab() {
  const [selectValue, setSelectValue] = useState();
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const auth = useContext(AuthContext);

  const optionList = [
    { id: 'BASIC_INVENTORY_REPORT', value: 'Basic Inventory Report' },
    { id: "AS_OF_INVENTORY_REPORT", value: "As of Inventory Report" },
    { id: 'INVENTORY_BY_WAREHOUSE', value: 'Inventory by Warehouse' },
    { id: 'INVENTORY_BIN_CARDS_REPORT', value: 'Inventory Bin Cards (Cardex)' },
    /*     { id: "ZONE_WISE_BRICKS_REPORT", value: "Zone Wise Bricks Report" },
     */ /* { id: "MORTAR_DRY_MIX_REPORT", value: "Mortar Dry Mix Report" },
    { id: "PLASTER_DRY_MIX_REPORT", value: "Plaster Dry Mix Report" }, */
    {
      id: 'INVENTORY_OF_RAW_REPORT',
      value: 'Inventory of Raw Materials',
    },
    /* {
      id: "INVENTORY_AGING_REPORT",
      value: "Inventory Aging Report",
    }, */
  ];

  const fetchWarehouseData = useCallback(async () => {
    const warehouseData = (await fetchWarehouses(auth)) ?? [];
    console.log(warehouseData);
    setWarehouses(warehouseData);
  }, [auth]);

  useEffect(() => {
    if (selectValue === 'INVENTORY_BY_WAREHOUSE') {
      fetchWarehouseData();
    }
  }, [selectValue, fetchWarehouseData]);

  console.log(warehouses);
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
        <HeaderFilter
          selectExists
          selectValue={selectValue}
          selectChange={(val) => setSelectValue(val.target.value)}
          selectOptions={optionList}
          selectLabel='Select Inventory'
        />
        {selectValue === 'INVENTORY_BY_WAREHOUSE' && (
          <HeaderFilter
            selectExists
            selectValue={selectedWarehouse}
            selectChange={(val) => setSelectedWarehouse(val.target.value)}
            selectOptions={warehouses.map((obj) => ({id: obj.id, value: obj.name}))}
            selectLabel='Select Warehouse'
          />
        )}
      </Box>
      {selectValue === 'BASIC_INVENTORY_REPORT' && <BasicInventoryTabOption />}
      {selectValue === 'AS_OF_INVENTORY_REPORT' && <AsOfInventoryTabOption />}
      {selectValue === 'INVENTORY_BIN_CARDS_REPORT' && (
        <InventoryBinCardsTabOption />
      )}
      {selectValue === 'ZONE_WISE_BRICKS_REPORT' && (
        <ZoneWiseBricksInventoryTabOption />
      )}

      {selectValue === 'MORTAR_DRY_MIX_REPORT' && (
        <MortarDryMixInventoryTabOption />
      )}
      {selectValue === 'MLASTER_DRY_MIX_REPORT' && (
        <PlasterDryMixInventoryTabOption />
      )}
      {selectValue === 'INVENTORY_OF_RAW_REPORT' && <InventoryOfRawTabOption />}
      {selectValue === 'INVENTORY_AGING_REPORT' && <InventoryAgingTabOption />}
      {selectValue === 'INVENTORY_BY_WAREHOUSE' && (
        <InventoryByWareHouseReport />
      )}
    </>
  );
}
