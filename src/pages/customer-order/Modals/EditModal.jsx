import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import {
  capitalizeFirstLetter,
  convertExistingDate,
  formatDate,
} from "../../../utils";
import Modal from "../../../components/Modal";

export default function EditModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  Editable,
  withCancel,
  data,
}) {
  const [productCategoriesList, setProductCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productCategorie, setProductCategorie] = useState(
    data.product?.itemId
  );
  const [error, setError] = useState();

  const [productsList, setProductsList] = useState([]);
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(data.quantity);

  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    data.expectedDeliveryDate.split("T", 1)
  );

  const [orderDescription, setOrderDescription] = useState(
    data.orderDescription
  );

  const auth = useContext(AuthContext);
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
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const ItemsResponse = await axios.get(`api/Items/${productCategorie}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setProductsList(ItemsResponse.data.subItems);
      } catch (error) {}
    };

    fetchItems();
  }, [productCategorie]);

  const saveData = async () => {
    let proceed = true;
    if (
      !expectedDeliveryDate ||
      new Date(expectedDeliveryDate).getTime() < new Date().getTime()
    ) {
      setError("Wrong Expected Delivery Date");
      proceed = false;
      return;
    }
    if (!quantity || quantity < 0) {
      setError("Quantity should be bigger than 0");
      proceed = false;
      return;
    }

    if (proceed) {
      setIsLoading(true);

      try {
        const input = {
          quantity: +quantity,
          expectedDeliveryDate: Array.isArray(expectedDeliveryDate)
            ? expectedDeliveryDate[0]
            : expectedDeliveryDate,
          description: orderDescription,
        };
        await axios.put(`/api/CustomerOrders/${data.id}`, input, {
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
        } else setError("Forbidden ");
      }
    }
  };
  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={Editable ? saveData : saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Product Category</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled
              value={productCategorie}
              onChange={(e) => setProductCategorie(e.target.value)}
            >
              {productCategoriesList.map((elem) => (
                <option value={elem.id} key={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Product</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
              }}
            >
              {productsList.map((elem) => (
                <option value={elem.id} key={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Quantity</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Expected Delivery Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">
              Created Date:{" "}
              <span className="font-semibold">
                {formatDate(data.createdDate)}
              </span>
            </label>
          </div>
          <div></div>
          <div>
            <label className="block mb-2">Order Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
            ></textarea>
          </div>
          <div></div>

          <div>
            <label className="block mb-2">
              Unit:{" "}
              <span className="font-semibold">
                {capitalizeFirstLetter(data.masterUnitName)}
              </span>
            </label>
          </div>
          <div></div>
          <div>
            <label className="block mb-2">
              Quantity Per Unit:{" "}
              <span className="font-semibold">
                {data?.product?.name?.toLowerCase().includes("athel")
                  ? 3.5
                  : data.quantityPerUnit.toFixed(2)}
              </span>
            </label>
          </div>
          <div></div>
          <div>
            <label className="block mb-2">
              Total Quantity:{" "}
              <span className="font-semibold">
                {(data.quantityPerUnit * quantity).toFixed(2)}
              </span>
            </label>
          </div>
          <div></div>
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
