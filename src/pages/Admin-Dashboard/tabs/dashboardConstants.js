export const productOrder = [
  '40*20*10',
  'Plaster Dry mix',
  'Mortar Dry Mix',
  'Ready made mud plaster',
  // 'Athel Wood Non-structural 75 mm',
  // 'Athel Wood Non-structural 100 mm',
  // 'Athel Wood Structural 125 mm',
  // 'Athel Wood Structural 150 mm',
  'Athel A1 125 -150 mm',
  'Athel A2 125 -150 mm',
  'Athel A3 150-250 mm',
  'Athel B1 75-100 mm',
  'Athel B1 100-125 mm',
  'Athel B2 75-100 mm',
  'Athel B2 100-125 mm',
  'Athel B3 50-75mm',
  'Mortar',
];

export const headCells = [
  {
    id: 'Product',
    numeric: false,
    disablePadding: true,
    label: 'Product',
  },
  {
    id: 'TotalQuantity',
    numeric: true,
    disablePadding: false,
    label: 'Total Quantity',
  },
  {
    id: 'FreeQuantity',
    numeric: true,
    disablePadding: false,
    label: 'Free Quantity',
  },
  {
    id: 'UnderProcessing',
    numeric: true,
    disablePadding: false,
    label: 'Under Processing',
  },
];

export const headCells2 = [
  {
    id: 'CONumber',
    numeric: false,
    disablePadding: true,
    label: 'CO Number',
  },
  {
    id: 'CustomerName',
    numeric: true,
    disablePadding: false,
    label: 'Customer Name',
  },
  {
    id: 'Product',
    numeric: true,
    disablePadding: false,
    label: 'Product',
  },
  {
    id: 'ExpectedDeliveryDate',
    numeric: true,
    disablePadding: false,
    label: 'Expected Delivery Date',
  },
  {
    id: 'OrderQty',
    numeric: true,
    disablePadding: false,
    label: 'Order Qty',
  },
  {
    id: 'QtyPerUnit',
    numeric: true,
    disablePadding: false,
    label: 'Qty Per Unit',
  },
  {
    id: 'Status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
];

export const dashbCols1 = (full) => [
  {
    id: 'Product',
    label: 'Product',
    sort: {
      sorted: true,
      key: 'productName',
      value: 1
    },
    width: full ? '25rem' : '10rem',
    align: 'left'
  },
  {
    id: 'TotalQuantity',
    label: 'Total Quantity',
    sort: {
      sorted: false,
      key: 'totalQuantity',
      value: 1
    },
    width: full ? '16rem' : '6rem',
    align: 'right'
  },
  {
    id: 'FreeQuantity',
    label: 'Free Quantity',
    sort: {
      sorted: false,
      key: 'freeQuantity',
      value: 1
    },
    width: full ? '15rem' : '5rem',
    align: 'right'
  },
  {
    id: 'UnderProcessing',
    label: 'Under Processing',
    sort: {
      sorted: false,
      key: 'underProcessingQuantity',
      value: 1
    },
    width: full ? '15rem' : '5rem',
    align: 'right'
  },
];

export const AlQasabCols = [
  {
    id: 'Zone Name',
    label: 'Zone Name',
    sort: {
      sorted: true,
      key: 'ZoneName',
      value: 1
    },
    width: '25rem',
    align: 'left'
  },
  {
    id: 'Quantity',
    label: ' Quantity',
    sort: {
      sorted: false,
      key: 'Quantity',
      value: 1
    },
    width: '16rem',
    align: 'right'
  },
  {
    id: 'Capacity',
    label: 'Capacity',
    sort: {
      sorted: false,
      key: 'Capacity',
      value: 1
    },
    width: '15rem',
    align: 'right'
  },
  {
    id: 'Capacity Percentage',
    label: 'Capacity Percentage',
    sort: {
      sorted: false,
      key: 'CapacityPercentage',
      value: 1
    },
    width: '15rem',
    align: 'right'
  },
];
