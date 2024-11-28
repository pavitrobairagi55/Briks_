import { useContext, useState } from "react";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { uploadFile } from "../../../utils";
import { CircularProgress, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import EnhancedTable from "../../../components/tabel/Table";

export default function EditPurchaseModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
  editable,
}) {
  const auth = useContext(AuthContext);

  let { data: itemTypes } = useFetch("itemtypes");
  const [isLoading, setIsLoading] = useState();
  const [supplier, setSupplier] = useState(data?.supplier.id);
  const [warehouse, setWarehouse] = useState(data?.warehouse.id);
  const [purchaseOrderDate, setPurchaseOrderDate] = useState(
    data?.purchaseOrderDate.split("T", 1)
  );
  const [deliveryDate, setDeliveryDate] = useState(
    data?.deliveryDate.split("T", 1)
  );
  const [category, setCategory] = useState();
  const [rawMaterialId, setRawMaterialId] = useState();
  const [tool, setTool] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [unitId, setUnitId] = useState();
  const [error, setError] = useState();
  const [items, setItems] = useState(data?.items || []);
  const { data: supplierList } = useFetch("suppliers");
  const { data: warehouseList } = useFetch("warehouses");
  const { data: rawList } = useFetch("items/raw");
  const { data: unitList } = useFetch("units");

  itemTypes = itemTypes?.filter(
    (elem) => elem.name === "Tools" || elem.name === "Raw Material"
  );
  const saveData = async () => {
    if (!supplier || !purchaseOrderDate || !deliveryDate || !items?.length) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    setIsLoading(true);
    try {
      const input = {
        PurchaseOrderDate: Array.isArray(purchaseOrderDate)
          ? purchaseOrderDate[0]
          : purchaseOrderDate,
        DeliveryDate: Array.isArray(deliveryDate)
          ? deliveryDate[0]
          : deliveryDate,
        SupplierId: +supplier,
        WarehouseId: +warehouse,
        Items: items,
      };

      await axios.put(`api/Purchases/${data.id}`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      saveFcn();
    } catch (error) {
      console.log("🚀 ~ saveData ~ error:", error);
      setIsLoading(false);

      setError(error.response?.data);
    }
  };
  const addItem = () => {
    setError("");
    if (
      !category ||
      (!tool && !purchaseOrderDate) ||
      !quantity ||
      !price ||
      !description /* ||
      !unitId */
    ) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    items.push({
      Id: items?.length + 1,
      Category: +category,
      RawMaterialId: +rawMaterialId,
      Tool: tool || "",
      Quantity: +quantity,
      Price: +price,
      Description: description,
      /* UnitId: unitId, */
    });
    setCategory("");
    setRawMaterialId("");
    setTool("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setUnitId("");
  };
  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "#",
    },
    {
      id: "Category",
      numeric: false,
      disablePadding: true,
      label: "Category",
    },
    {
      id: "RawMaterial",
      numeric: true,
      disablePadding: false,
      label: "Raw Material",
    },
    {
      id: "Tool",
      numeric: true,
      disablePadding: false,
      label: "Tool",
    },
    /* {
      id: "Unit",
      numeric: true,
      disablePadding: false,
      label: "Unit",
    }, */
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "Price",
      numeric: true,
      disablePadding: false,
      label: "Price",
    },
    {
      id: "Description",
      numeric: true,
      disablePadding: false,
      label: "Description",
    },
    {
      id: "Delete",
      numeric: true,
      disablePadding: false,
      label: "Delete",
    },
  ];
  const rows = items?.map((elem) => {
    return {
      ID: elem.Id,
      Category: elem.Category,
      RawMaterial: elem.RawMaterialId
        ? rawList.find(
            (el) => el.id.toString() === elem.RawMaterialId.toString()
          )?.name
        : "---",
      Tool: elem.Tool || "----",
      /* Unit: unitList.find((el) => el.id.toString() === elem.UnitId.toString())
        ?.name, */
      Quantity: elem.Quantity,
      Price: elem.Price,
      Description: elem.Description,
      Delete: (
        <IconButton
          disabled={!editable}
          onClick={() => deleteItem(elem.Id)}
          color="primary"
          className="text-white bg-[#F59E0B] hover:text-[#F59E0B] hover:bg-white"
        >
          <Delete />
        </IconButton>
      ),
    };
  });
  const deleteItem = (id) => {
    const Items = items.filter((elem) => elem.Id.toString() !== id.toString());
    setItems(Items);
  };
  return (
    <Modal
      showSave={true}
      title={title}
      closeModal={closeModal}
      type={type}
      saveFcn={editable ? saveData : saveFcn}
      cancelFcn={cancelFcn}
      withCancel={withCancel}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Supplier</label>
          <select
            disabled={!editable}
            required
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">Select Option</option>
            {supplierList?.map((elem, i) => (
              <option key={i} value={elem?.id}>
                {elem?.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Warehouse</label>
          <select
            disabled={!editable}
            required
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={warehouse}
            onChange={(e) => {
              setWarehouse(e.target.value);
            }}
          >
            {" "}
            <option value="">Select Option</option>
            {warehouseList?.map((elem, i) => (
              <option key={i} value={elem.id}>
                {elem.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Purchase Order Date</label>
          <input
            disabled={!editable}
            required
            type="date"
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={purchaseOrderDate}
            onChange={(e) => {
              setPurchaseOrderDate(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="block mb-2">Delivery Date</label>
          <input
            disabled={!editable}
            required
            type="date"
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={deliveryDate}
            onChange={(e) => {
              setDeliveryDate(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="block mb-2">Category</label>
          <select
            required
            disabled={!editable}
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {" "}
            <option value="">Select Option</option>
            {itemTypes?.map((elem, i) => (
              <option key={i} value={elem.id}>
                {elem.name}
              </option>
            ))}
          </select>
        </div>
        {itemTypes?.find((elem) => elem.id.toString() === category?.toString())
          ?.name === "Raw Material" && (
          <div>
            <label className="block mb-2">Raw Material</label>
            <select
              required
              disabled={!editable}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={rawMaterialId}
              onChange={(e) => {
                setRawMaterialId(e.target.value);
              }}
            >
              <option value="">Select Option</option>
              {rawList?.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {itemTypes?.find((elem) => elem.id.toString() === category?.toString())
          ?.name === "Tools" && (
          <div>
            <label className="block mb-2">Tool</label>
            <input
              disabled={!editable}
              required
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={tool}
              onChange={(e) => {
                setTool(e.target.value);
              }}
            />
          </div>
        )}
        {/*  <div>
          <label className="block mb-2">Units</label>
          <select
            required
            disabled={!editable}
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={unitId}
            onChange={(e) => {
              setUnitId(e.target.value);
            }}
          >
            <option value="">Select Option</option>
            {unitList?.map((elem, i) => (
              <option key={i} value={elem.id}>
                {elem.name}
              </option>
            ))}
          </select>
        </div> */}
        <div>
          <label className="block mb-2">Qty</label>
          <input
            required
            disabled={!editable}
            type="number"
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="block mb-2">Price/Rate</label>
          <input
            required
            disabled={!editable}
            type="number"
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <input
            required
            disabled={!editable}
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            disabled={isLoading || !editable}
            className="bg-[#0133C3] px-6 py-2 text-white rounded-xl mr-2 flex items-center "
            onClick={addItem}
          >
            {isLoading && (
              <CircularProgress
                size={20}
                style={{ color: "white", marginRight: 6 }}
              />
            )}{" "}
            Add Item
          </button>
        </div>

        <span className="font-semibold text-red-500">{error} </span>
      </div>
      <EnhancedTable rows={rows || []} headCells={headCells} />
    </Modal>
  );
}
