import { Search } from "@mui/icons-material";
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
                "&:hover": {
                  backgroundColor: "#bcbcbc",
                },
              }}
              onClick={handleSearchClick}>
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        style: { color: "black" },
      }}
      sx={{
        marginLeft: "auto",
        marginRight: "20px",
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "black",
          },
      }}
    />
  );
};

export default SearchBar;
