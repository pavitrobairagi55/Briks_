import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";
import { capitalizeFirstLetter } from "../../../utils";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function AddModal({
  title,
  Editable,
  cancelFcn,
  closeModal,
  saveFcn,
  type,
  withCancel,
}) {
  const [productCategoriesList, setProductCategoriesList] = useState([]);

  const [error, setError] = useState();
  const [productCategorie, setProductCategorie] = useState();

  const [productsList, setProductsList] = useState([]);
  const [productsObjects, setProductObjects] = useState([]);

  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState();

  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState();

  const [orderDescription, setOrderDescription] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  // const [data, setData] = useFetch(`/Customerorders${}`);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productCategoriesResponse = await axios.get(
          "api/items/finished",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        setProductCategoriesList(productCategoriesResponse.data);
        setProductCategorie(productCategoriesResponse.data[0].id);
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (productCategorie) {
      fetchItems();
    }
  }, [productCategorie]);
  const fetchItems = async () => {
    try {
      const ItemsResponse = await axios.get(`api/Items/${productCategorie}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setProductsList(ItemsResponse.data.subItems);
      setProductObjects(ItemsResponse.data);
      setProduct(ItemsResponse.data.subItems[0].id);
    } catch (error) {}
  };
  const saveData = async () => {
    let proceed = true;
    if (
      !expectedDeliveryDate ||
      new Date(expectedDeliveryDate).getTime() < new Date().getTime()
    ) {
      setError("Wrong Expected Delivery Date");
      proceed = false;
    }
    if (!quantity || quantity < 0) {
      setError("Quantity should be bigger than 0");
      proceed = false;
    }

    if (proceed) {
      setIsLoading(true);

      try {
        const input = {
          productId: +product,
          quantity: +quantity,
          expectedDeliveryDate: expectedDeliveryDate,
          description: orderDescription,
        };
        await axios.post("/api/CustomerOrders", input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setIsLoading(false);
        saveFcn();
      } catch (error) {
        setIsLoading(false);
        if (error.request.response) {
          setError(JSON.parse(error.request.response).title);
        } else setError("Error");
      }
    }
  };

  return (
    <>
      <Modal
        showSave={true}
        title={title}
        Editable={Editable}
        cancelFcn={cancelFcn}
        closeModal={closeModal}
        saveFcn={saveData}
        type={type}
        withCancel={withCancel}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Product Category</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={productCategorie}
              onChange={(e) => setProductCategorie(e.target.value)}
            >
              {productCategoriesList?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Product</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
              }}
            >
              {productsList.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Quantity</label>
            <input
              required
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Expected Delivery Date</label>
            <DatePicker
              value={expectedDeliveryDate}
              onChange={(date) =>
                setExpectedDeliveryDate(dayjs(date).format("YYYY-MM-DD"))
              }
            />
          </div>

          <div>
            <label className="block mb-2">Order Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
            ></textarea>
          </div>
          <div></div>
          {productsObjects && (
            <>
              <div>
                <label className="block mb-2">
                  Unit:{" "}
                  <span className="font-semibold">
                    {capitalizeFirstLetter(productsObjects.unitName)}
                  </span>
                </label>
              </div>
              <div></div>
              <div>
                <label className="block mb-2">
                  Quantity Per Unit:{" "}
                  <span className="font-semibold">
                    {(() => {
                      const productItem = productsObjects?.subItems?.find(
                        (elem) => +elem.id === +product
                      );
                      if (!productItem) return null;

                      const productName = productItem.name.toLowerCase();
                      return productName.includes("athel")
                        ? 3.5
                        : productItem.quantityPerUnit?.toFixed(2);
                    })()}
                  </span>
                </label>
              </div>
              <div></div>
              {quantity && (
                <div>
                  <label className="block mb-2">
                    Total Quantity:{" "}
                    <span className="font-semibold">
                      {(
                        productsObjects?.subItems?.find(
                          (elem) => +elem.id === +product
                        )?.quantityPerUnit * quantity
                      ).toFixed(2)}
                    </span>
                  </label>
                </div>
              )}
              <div></div>
            </>
          )}
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
