import { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function EditSoilRequest({
  title,
  Editable,
  cancelFcn,
  closeModal,
  saveFcn,
  type,
  withCancel,
  data,
}) {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [category, setCategory] = useState(data.itemId);

  const [product, setProduct] = useState(data.product?.id);
  const { data: CategoryList } = useFetch("items/raw");
  const [date, setDate] = useState(data.productionDate.split("T", 1));
  const [quantity, setQuantity] = useState(data.quantity);
  const [isLoading, setIsLoading] = useState();
  const [productList, setProductList] = useState([]);

  const saveData = async () => {
    if (!product || !date || !quantity) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);
    try {
      const input = {
        productId: product,
        productionDate: Array.isArray(date) ? date[0] : date,
        quantity: quantity,
      };

      await axios.put(`api/ProductionOrders/${data.id}`, input, {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (category) {
          const response = await axios.get(`/api/Items/${category}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          });
          setProductList(response.data);
        }
      } catch (error) {
        // Handle error appropriately
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Cleanup logic (if necessary)
    };
  }, [category, auth.token]); // Ensure all dependencies are included

  return (
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
          <label className="block mb-2">Category</label>
          <select
            required
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Option</option>
            {CategoryList?.map((elem, i) => (
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
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="">Select Option</option>
            {productList?.subItems?.map((elem, i) => (
              <option key={i} value={elem?.id}>
                {elem?.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="block mb-2">Quantity</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
        </div>

        <span className="font-semibold text-red-500">{error} </span>
      </div>

      <p className="mb-2 mt-20 font-semibold">Unit: {data.masterUnitName}</p>
      {/*     <p className="mb-2 font-semibold">
        Quantity Per Unit: {data.quantityPerUnit}
      </p>

      {quantity && (
        <p className="mb-2">
          Total Quantity: <b>{quantity * data.quantityPerUnit}</b>{" "}
        </p>
      )} */}
    </Modal>
  );
}
