import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

export default function ItemCard({
  items,
  basedItems,
  onDelete,
  onChange,
  editable,
  productCategoriesList,
  existingItems,
  existingZone,
}) {
  const auth = useContext(AuthContext);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              <h3>Product Category </h3>
            </th>
            <th>
              <h3>Warehouse</h3>
            </th>
            <th>
              <h3>Zone</h3>
            </th>

            <th>
              <h3>Product</h3>
            </th>
            <th>
              <h3>Qty</h3>
            </th>

            {editable && (
              <th>
                <h3>Delete</h3>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => {
            const zoneList = existingZone.find(
              (elem) =>
                +elem.warehouseId ===
                +productCategoriesList.find(
                  (elem) => elem.id === +(row.productId || row.itemId)
                )?.warehouseId
            )?.zones;

            const itemsList = existingItems.find(
              (elem) => +elem.productId === +(row.productId || row.itemId)
            )?.items;

            return (
              <tr key={row.id}>
                <td>
                  <select
                    required
                    value={row.productId || row.itemId}
                    name="productId"
                    onChange={(e) => onChange(e, row.id)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-700"
                    disabled={
                      !editable ||
                      basedItems.find(
                        (el) => el.id.toString() === row.id.toString()
                      )
                    }
                  >
                    <option value={null}>Select Product Category</option>
                    {productCategoriesList?.map((elem, i) => (
                      <option key={i} value={elem.id}>
                        {elem.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    required
                    id="warehouseId"
                    value={row.warehouseId}
                    name="warehouseId"
                    onChange={(e) => onChange(e, row.id)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-700"
                    disabled
                  >
                    <option
                      value={
                        productCategoriesList.find(
                          (elem) => elem.id === +(row.productId || row.itemId)
                        )?.warehouseId
                      }
                    >
                      {
                        productCategoriesList.find(
                          (elem) => elem.id === +(row.productId || row.itemId)
                        )?.warehouseName
                      }
                    </option>
                  </select>
                </td>
                <td>
                  <select
                    required
                    id="zoneId"
                    name="zoneId"
                    value={row.zoneId}
                    onChange={(e) => onChange(e, row.id)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-700"
                    disabled={
                      !editable ||
                      basedItems.find(
                        (el) => el.id.toString() === row.id.toString()
                      )
                    }
                  >
                    <option value={null}>Select Zone</option>
                    {zoneList?.map((elem, i) => (
                      <option key={i} value={elem.id}>
                        {elem.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <select
                    required
                    id="subItemId"
                    value={row.subItemId}
                    name="subItemId"
                    onChange={(e) => onChange(e, row.id)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-700"
                    disabled={
                      !editable ||
                      basedItems.find(
                        (el) => el.id.toString() === row.id.toString()
                      )
                    }
                  >
                    <option value={null}>Select Product</option>
                    {itemsList?.map((elem, i) => (
                      <option key={i} value={elem.id}>
                        {elem.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    required
                    disabled={false}
                    onChange={(e) => onChange(e, row.id)}
                    placeholder="Quantity"
                    type="number"
                    value={row.quantity}
                    name="quantity"
                    id=""
                    className="w-full px-3 py-2 border rounded-lg text-gray-700"
                  />
                </td>
                {editable && (
                  <td>
                    <IconButton
                      onClick={() => onDelete(row.id)}
                      aria-label="Delete Row"
                    >
                      <Delete sx={{ color: "red" }} />
                    </IconButton>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ItemCard.propTypes = {
  items: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
