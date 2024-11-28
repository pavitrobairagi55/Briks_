import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../../components/Modal";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { AuthContext } from "../../../shared/authContext";
import ItemCard from "../components/ItemCard";
import axios from "../../../api/axios";
import { convertExistingDate } from "../../../utils";

export default function EditVoucher({
  saveFcn,
  withCancel,
  cancelFcn,
  closeModal,
  type,
  title,
  voucherTypes,
  data,
}) {
  const [items, setItems] = useState(data.voucherItems);
  const [basedItems, setBasedItems] = useState(data.voucherItems);

  const [productCategoriesList, setProductCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [typeId, setTypeId] = useState(data?.type);
  const [date, setDate] = useState(convertExistingDate(data.dateCreated));
  const [note, setNote] = useState(data.notes);
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [existingZone, setExistingZone] = useState([]);
  const [existingItems, setExistingItems] = useState([]);

  const [ItemsToDelete, setItemsToDelete] = useState([]);
  const [ItemsToAdd, setItemsToAdd] = useState([]);
  const [ItemsToUpdate, setItemsToUpdate] = useState([]);
  const fetchAll = async () => {
    const productCategoriesResponse = await axios.get("api/items/finished", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });

    const productList = productCategoriesResponse.data;

    const updatedExistingItems = [];
    const updatedExistingZone = [];

    for (const el of productList) {
      const items = await fetchItems(el.id);
      updatedExistingItems.push({ productId: el.id, items });

      const zones = await fetchZones(el.warehouseId);
      updatedExistingZone.push({ warehouseId: el.warehouseId, zones });
    }

    setExistingItems(updatedExistingItems);
    setExistingZone(updatedExistingZone);
  };
  const fetchItems = async (productId) => {
    try {
      const ItemsResponse = await axios.get(`api/Items/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return ItemsResponse.data.subItems;
    } catch (error) {}
  };
  const fetchZones = async (warehouseId) => {
    try {
      const response = await axios.get(`api/warehouses/${warehouseId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data?.zones || [];
    } catch (error) {}
  };
  useEffect(() => {
    fetchAll();
  }, []);
  const handleItemChange = (e, id) => {
    const existingItem = data.voucherItems.find((zone) => zone.id === id);
    if (
      existingItem &&
      !ItemsToAdd.includes(existingItem.id) &&
      !ItemsToUpdate.includes(existingItem.id)
    ) {
      ItemsToUpdate.push(id);
    } else if (!ItemsToAdd.includes(id) && !ItemsToUpdate.includes(id)) {
      ItemsToAdd.push(id);
    }

    const newItems = items.map((elem) => {
      if (elem.id === id) {
        return { ...elem, [e.target.name]: e.target.value };
      }
      return elem;
    });
    setItems(newItems);
  };

  const handleItemDelete = (id) => {
    const item = items.find((elem) => elem.id === id);
    if (item) {
      setItemsToDelete([...ItemsToDelete, item.id]);
    }
    const newItems = items.filter((elem) => elem.id !== id);
    setItems(newItems);
  };
  const saveData = async () => {
    let preceed = true;

    if (!typeId || !date) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
      return;
    }

    if (preceed) {
      setIsLoading(true);
      try {
        const itemsToCreate = ItemsToAdd.map((el) =>
          items.find((elem) => elem.id.toString() === el.toString())
        )
          .filter((el) => el !== undefined)
          .map((elem) => {
            return {
              zoneId: +elem.zoneId,
              subItemId: +elem.subItemId,
              quantity: +elem.quantity,
            };
          });
        const itemsToUpdate = ItemsToUpdate.map((el) => {
          const found = items.find(
            (elem) => elem.id.toString() === el.toString()
          );
          if (found) {
            return {
              id: +found.id,
              quantity: +found.quantity,
            };
          }
        }).filter((el) => el !== undefined);

        const input = {
          date: Array.isArray(date) ? date[0] : date,
          notes: note,
          itemsToCreate: itemsToCreate,
          itemsToUpdate: itemsToUpdate,
          itemsToDelete: ItemsToDelete,
        };
        console.log(
          "🚀 ~ file: EditVoucher.jsx:165 ~ saveData ~ input:",
          JSON.stringify(input)
        );

        const response = await axios.put(
          `api/Voucher/finished/${data.id}`,
          input,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        saveFcn();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);

        setError(JSON.parse(error?.request?.response)?.title);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const productCategoriesResponse = await axios.get("api/items/finished", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setProductCategoriesList(productCategoriesResponse.data);
    } catch (error) {}
  };

  return (
    <>
      <Modal
        showSave={true}
        saveFcn={saveData}
        withCancel={withCancel}
        cancelFcn={cancelFcn}
        closeModal={closeModal}
        type={type}
        title={title}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="typeId" className="block mb-2">
              Type
            </label>
            <select
              disabled
              id="typeId"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            >
              <option value={null}>Select Type</option>
              {voucherTypes.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="note" className="block mb-2">
              Note
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              type="text area"
              id="note"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            />{" "}
          </div>
        </div>
        <div>
          {/* <div className="flex gap-2 items-center mb-5">
            <label htmlFor="checkbox">Active</label>
            <input type="checkbox" id="checkbox" />
          </div> */}
          <div className="flex gap-2 items-center	">
            <span>Add Items</span>
            <IconButton
              sx={{ color: "bleu" }}
              size="large"
              onClick={() =>
                setItems((prev) => [
                  ...prev,
                  {
                    id: uuidv4(),
                    warehouseId: "",
                    productId: "",
                    zoneId: "",
                    subItemId: "",
                    quantity: "",
                  },
                ])
              }
              aria-label="Delete Row"
            >
              <AddCircle />
            </IconButton>
          </div>
          {items?.length === 0 && (
            <p className="my-3 text-red-700	"> You must at least add one Item</p>
          )}
          <ItemCard
            items={items}
            basedItems={basedItems}
            onChange={(e, id) => handleItemChange(e, id)}
            onDelete={(id) => handleItemDelete(id)}
            editable={true}
            productCategoriesList={productCategoriesList}
            existingZone={existingZone}
            existingItems={existingItems}
          />
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </Modal>
    </>
  );
}
