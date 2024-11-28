import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../../components/Modal";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import ProductCard from "../components/ProductCard";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function EditItem({ saveFcn, editable, ...props }) {
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [oldProducts, setOldProducts] = useState([]);
  const [type, setType] = useState();
  const [name, setName] = useState();
  const [wareHouse, setWareHouse] = useState();
  const [isLoading, setIsLoading] = useState();
  const [unit, setUnit] = useState();
  const itemTypes = props.itemTypes;
  const unitsList = props.unitsList;
  const wareHouseList = props.wareHouseList;
  const [error, setError] = useState();
  const auth = useContext(AuthContext);
  const [productsToDelete, setProductsToDelete] = useState([]);
  const [productsToAdd, setProductsToAdd] = useState([]);
  const [productsToUpdate, setProductsToUpdate] = useState([]);
  const [isFinished, setIsfinished] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`api/items/${props.selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setData(response.data);
      setProducts(response.data?.subItems);
      setOldProducts(response.data?.subItems);
      setType(response.data?.itemTypeId);
      setName(response.data?.name);
      setWareHouse(response.data?.warehouseId);
      setUnit(response.data?.unitId);
      setIsfinished(response.data?.isFinished);
    } catch (error) {
      setData([]);
    }
  };
  const handleProductChange = (e, id) => {
    const existingProduct = oldProducts?.find((zone) => zone.id === id);

    const newProduct = products.map((elem) => {
      if (elem.id === id) {
        return { ...elem, [e.target.name]: e.target.value };
      }
      return elem;
    });
    if (
      existingProduct &&
      !productsToAdd.includes(existingProduct.id) &&
      !productsToUpdate.includes(existingProduct.id)
    ) {
      productsToUpdate.push(id);
    } else if (!productsToAdd.includes(id) && !productsToUpdate.includes(id)) {
      productsToAdd.push(id);
    }
    setProducts(newProduct);
  };

  const handleProductDelete = (id) => {
    const existingProduct = products.find((elem) => elem.id === id);
    if (existingProduct) {
      setProductsToDelete([...productsToDelete, existingProduct.id]);
    }
    const newProduct = products.filter((elem) => elem.id !== id);
    setProducts(newProduct);
  };
  /*  const handleCheckBox = (id) => {
    const newProduct = products.map((elem) => {
      if (elem.id === id) {
        return { ...elem, isFinished: !elem.isFinished };
      }
      return elem;
    });
    setProducts(newProduct);
  }; */
  const saveData = async () => {
    let preceed = true;

    if (!wareHouse || !unit || !type) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
      return;
    }

    if (preceed) {
      setIsLoading(true);
      try {
        const newProducts = productsToAdd
          .map((el) =>
            products.find((elem) => elem.id.toString() === el.toString())
          )
          .filter((el) => el !== undefined)
          ?.map((elem) => {
            return {
              name: elem.name,
              description: elem.description,
              quantityPerUnit: +elem.quantityPerUnit,
            };
          });

        const updatedProducts = productsToUpdate
          .map((el) => {
            const found = products.find(
              (elem) => elem.id.toString() === el.toString()
            );
            if (found) {
              return {
                id: +found.id,
                description: found.description,
                quantityPerUnit: +found.quantityPerUnit,
              };
            }
          })
          .filter((el) => el !== undefined);
        const input = {
          warehouseId: +wareHouse,
          unitId: +unit,
          typeId: +type,
          productsToAdd: newProducts,
          isFinished: isFinished,
          productsToUpdate: updatedProducts,
          productsToDelete: productsToDelete,
        };

        await axios.put(`api/items/${props.selectedId}`, input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        saveFcn();
      } catch (error) {
        console.log("🚀 ~ file: AddItem.jsx:81 ~ saveData ~ error:", error);
        setIsLoading(false);

        setError(JSON.parse(error?.request?.response)?.title);
      }
    }
  };
  return (
    <>
      <Modal
        showSave={true}
        {...props}
        isLoading={isLoading}
        saveFcn={editable ? saveData : saveFcn}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="Location" className="block mb-2">
              Type
            </label>
            <select
              disabled={!editable}
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            >
              <option value={null}>Select Type</option>
              {itemTypes?.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Location" className="block mb-2">
              Name
            </label>
            <input
              disabled
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="Location" className="block mb-2">
              Warehouse
            </label>
            <select
              disabled={!editable}
              id="Warehouse"
              onChange={(e) => setWareHouse(e.target.value)}
              value={wareHouse}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            >
              <option value={null}>Select WareHouse</option>
              {wareHouseList?.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Location" className="block mb-2">
              Units
            </label>
            <select
              disabled={!editable}
              id="Units"
              onChange={(e) => setUnit(e.target.value)}
              value={unit}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            >
              {" "}
              <option value={null}>Select Unit</option>
              {unitsList?.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center mb-5">
            <label htmlFor="checkbox">IS Finished</label>
            <input
              type="checkbox"
              id="checkbox"
              value={isFinished}
              checked={isFinished}
              onChange={(e) => setIsfinished(e.target.checked)}
            />
          </div>
          <div className="flex gap-2 items-center	">
            <span>Add Products</span>
            <IconButton
              sx={{ color: "bleu" }}
              size="large"
              onClick={() =>
                setProducts((prev) => [
                  ...prev,
                  {
                    id: uuidv4(),
                    name: "",
                    description: "",
                    quantityPerUnit: "",
                    isFinished: false,
                  },
                ])
              }
              aria-label="Delete Row"
            >
              <AddCircle />
            </IconButton>
          </div>
          {products?.length === 0 && (
            <p className="my-3 text-red-700	">
              You must at least add on Product
            </p>
          )}
          <ProductCard
            products={products}
            basedProducts={oldProducts}
            onChange={(e, id) => handleProductChange(e, id)}
            onDelete={(id) => handleProductDelete(id)}
            editable={editable}
            /*             handleCheckBox={handleCheckBox}
             */
          />
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </Modal>
    </>
  );
}
