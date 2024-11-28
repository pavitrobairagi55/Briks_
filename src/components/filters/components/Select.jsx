/* eslint-disable react/prop-types */
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({ value, handleChange, options, size, label }) {
  console.log(options)
  return (
      <FormControl fullWidth className={'form-control'}>
        <InputLabel id="demo-simple-select-label">{label ?? "Select an Option"}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label ?? "Select an Option"}
          onChange={handleChange}
          size={size}
        >
          {options.map((elem, i) => (
            <MenuItem key={i} value={elem.id}>
              {elem.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}
