import { Search as SearchIcon } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";

const SearchBar = ({
  searchTerm,
  handleSearchChange,
  handleKeyPress,
  handleSearchClick,
}) => {
  return (
    <TextField
      variant="outlined"
      label="Search"
      value={searchTerm}
      name="search"
      onChange={handleSearchChange}
      onKeyPress={handleKeyPress}
      error={false}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              sx={{
                "& label.Mui-focused": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                },
                width: "120%",
              }}
              onClick={handleSearchClick}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        marginLeft: "auto",
        "& .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-outlined.Mui-focused":
        {
          color: "black",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
        {
          borderColor: "black",
        },
      }}
    />
  );
};

export default SearchBar;
