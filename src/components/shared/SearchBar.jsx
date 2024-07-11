import { Search as SearchIcon } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";

const SearchBar = ({
  title,
  placeholder,
  searchTerm,
  handleSearchChange,
  handleKeyPress,
  handleSearchClick,
  customWidth,
}) => {
  return (
    <TextField
      title={title}
      variant="outlined"
      placeholder={placeholder}
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
                width: "100%",
              }}
              onClick={handleSearchClick}
            >
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
        width: customWidth,
      }}
    />
  );
};

export default SearchBar;
