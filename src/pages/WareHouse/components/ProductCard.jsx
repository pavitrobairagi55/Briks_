import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

export default function ProductCard({
  products,
  basedProducts,
  onDelete,
  onChange,
  editable,
  handleCheckBox,
}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              <h3>Name</h3>
            </th>
            <th>
              <h3>Description</h3>
            </th>
            <th>
              <h3>QuantityPerUnit</h3>
            </th>
            {/* <th>
              <h3>isFinished </h3>
            </th> */}
            {editable && (
              <th>
                <h3> Delete</h3>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  onChange={(e) => onChange(e, row.id)}
                  placeholder="Name"
                  type="text"
                  value={row.name}
                  name="name"
                  disabled={
                    !editable ||
                    basedProducts.find(
                      (el) => el.id.toString() === row.id.toString()
                    )
                  }
                  id=""
                  className="w-full px-3 py-2 border rounded-lg text-gray-700"
                />
              </td>
              <td>
                <input
                  disabled={!editable}
                  onChange={(e) => onChange(e, row.id)}
                  placeholder="Description"
                  type="text"
                  value={row.description}
                  name="description"
                  id=""
                  className="w-full px-3 py-2 border rounded-lg text-gray-700"
                />
              </td>
              <td>
                <input
                  disabled={!editable}
                  onChange={(e) => onChange(e, row.id)}
                  placeholder="quantityPerUnit"
                  type="number"
                  value={
                    !editable && row.name.toLowerCase().includes("athel")
                      ? 3.5
                      : !editable
                      ? row.quantityPerUnit.toFixed(2)
                      : row.quantityPerUnit
                  }
                  name="quantityPerUnit"
                  id=""
                  className="w-full px-3 py-2 border rounded-lg text-gray-700"
                />
              </td>
              {/*  <td>
                <input
                  disabled={!editable}
                  type="checkbox"
                  name="isFinished"
                  checked={row.isFinished}
                  onChange={(e) => handleCheckBox(row.id)}
                  className="mx-2"
                />
              </td> */}

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
          ))}
        </tbody>
      </table>
    </div>
  );
}

ProductCard.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
