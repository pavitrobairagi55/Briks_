import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import {
  capitalizeFirstLetter,
  convertExistingDate,
  formatDate,
} from "../../../utils";
import Modal from "../../../components/Modal";

export default function ViewTripDetailsModal({
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

  const [productCategorie, setProductCategorie] = useState(
    data.product?.itemId || null
  );

  const [productsList, setProductsList] = useState([]);

  const [orderNumber, setOrderNumber] = useState(data.id || null);
  const [product, setProduct] = useState(data.product?.id);
  const [quantity, setQuantity] = useState(data.quantity || null);

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
    } catch (error) {}
  };

  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mt-4">
              Customer Name :{" "}
              <span className="font-semibold">
                {data?.user?.firstName} {data?.user?.lastName}
              </span>
            </label>
          </div>
          <div>
            <label className="block mb-2">Order Number</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Product Category</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
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
              disabled={Editable ? false : true}
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
        </div>
      </Modal>
    </>
  );
}
