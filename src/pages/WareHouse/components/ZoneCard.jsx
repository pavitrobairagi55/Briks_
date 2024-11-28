import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

export default function ZoneCard({
  zones,
  basedZones,
  onDelete,
  onChange,
  withUnit,
  editable,
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
              <h3>Capacity</h3>
            </th>
            {withUnit && (
              <th>
                <h3>UnitName</h3>
              </th>
            )}
            {editable && (
              <th>
                <h3>Delete</h3>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {zones.map((row) => (
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
                    basedZones.find(
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
                  placeholder="Capacity"
                  type="number"
                  value={row.capacity}
                  name="capacity"
                  id=""
                  className="w-full px-3 py-2 border rounded-lg text-gray-700"
                />
              </td>
              {withUnit && (
                <td>
                  <input
                    disabled={!editable}
                    onChange={(e) => onChange(e, row.id)}
                    placeholder="Unit"
                    type="text"
                    value={row.unitName}
                    name="unitName"
                    id=""
                    className="w-full px-3 py-2 border rounded-lg text-gray-700"
                  />
                </td>
              )}
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

ZoneCard.propTypes = {
  zones: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
