/* eslint-disable react/prop-types */
import { SearchOutlined } from "@mui/icons-material";
import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";

const Search = ({ value, onChange, placeholder }) => {
  return (
    <FormControl variant="outlined" className={"form-control"}>
      <InputLabel htmlFor="input-with-icon-adornment">Search</InputLabel>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id="input-with-icon-adornment"
        startAdornment={
          <InputAdornment position="start">
            <SearchOutlined />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default Search;
