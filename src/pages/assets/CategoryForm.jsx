import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

const CategoryForm = () => {
  const [prefix, setPrefix] = useState("");
  const [name, setName] = useState("");
  const [prefixError, setPrefixError] = useState("");
  const [nameError, setNameError] = useState("");

  const handlePrefixChange = (event) => {
    const input = event.target.value.replace(/[^A-Za-z]/g, "").slice(0, 4);
    setPrefix(input);
    setPrefixError(
      input.length === 0 || input.length > 4 ? "Invalid prefix format" : ""
    );
  };

  const handleNameChange = (event) => {
    const input = event.target.value
      .replace(/[^A-Za-z0-9\s]/g, "")
      .slice(0, 50);
    setName(input);
    setNameError(
      input.length === 0 || input.length > 50 ? "Invalid name format" : ""
    );
  };

  return (
    <form>
      <TextField label="Prefix" value={prefix} onChange={handlePrefixChange} />
      {prefixError && (
        <Typography variant="caption" color="error">
          {prefixError}
        </Typography>
      )}
      <TextField label="Name" value={name} onChange={handleNameChange} />
      {nameError && (
        <Typography variant="caption" color="error">
          {nameError}
        </Typography>
      )}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CategoryForm;
