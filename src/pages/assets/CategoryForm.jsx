import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Dialog,
  Grid,
  Box,
} from "@mui/material";

import { CreateCategoryAPI } from "../../services/category.service";

const CategoryForm = (visibleDialog, setVisibleDialog) => {
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
  const handleCancel = () => {
    setVisibleDialog(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCategory = {
      prefix: prefix,
      name: name,
    };
    await CreateCategoryAPI(newCategory);
    setVisibleDialog(false);
  };
  return (
    <Dialog
      open={visibleDialog}
      PaperProps={{
        style: {
          position: "absolute",
          margin: "auto",
          padding: "20px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "1px solid rgba(0, 0, 0, 0.4)",
          width: "25%",
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: "#d32f2f",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        Create New Category
      </Typography>
      <form>
        <Grid container spacing={1}>
          <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
            <Typography>
              Prefix
              <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              label="Prefix"
              value={prefix}
              sx={{ width: "100%" }}
              onChange={handlePrefixChange}
            />
            {prefixError && (
              <Typography variant="caption" color="error">
                {prefixError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
            <Typography>
              Name
              <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              sx={{ width: "100%" }}
              label="Name"
              value={name}
              onChange={handleNameChange}
            />
            {nameError && (
              <Typography variant="caption" color="error">
                {nameError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#d32f2f",
                  mr: 3,
                  "&:hover": {
                    backgroundColor: "#a50000",
                  },
                }}
                disabled={!name || !prefix || nameError || prefixError}
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};

export default CategoryForm;
