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
import PopupNotification from "../../components/PopupNotification";
const CategoryForm = ({ visibleDialog, setVisibleDialog, setCategory }) => {
  const [prefix, setPrefix] = useState("");
  const [name, setName] = useState("");
  const [prefixError, setPrefixError] = useState("");
  const [nameError, setNameError] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [titlePopup, setTitlePopup] = useState(false);
  const [contentPopup, setContentPopup] = useState(false);
  const handlePrefixChange = (event) => {
    const input = event.target.value.replace(/[^A-Za-z]/g, "").slice(0, 4);
    setPrefix(input);
    setPrefixError(
      input.length === 0 || input.length > 4 ? "Invalid prefix format" : ""
    );
  };

  const handleNameChange = (event) => {
    const input = event.target.value.replace(/[^A-Za-z]/g, "").slice(0, 50);
    setName(input);
    setNameError(
      input.length === 0 || input.length > 50 ? "Invalid name format" : ""
    );
  };

  const handleCancel = () => {
    setVisibleDialog(false);
    setOpenPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCategory = {
      prefix: prefix,
      name: name,
    };
    try {
      const res = await CreateCategoryAPI(newCategory);
      if (res.data) {
        setOpenPopup(true);
        setTitlePopup("Notifications");
        setContentPopup(`Category ${res.data.name} has been created.`);
        setCategory(res.data);
      }
    } catch (error) {
      console.error(error); // Log the error to see its structure
      setTitlePopup("Error");
      setContentPopup(
        `${error.userMessage || "Existing category name or prefix"}`
      );
      setOpenPopup(true);
    }
  };

  return (
    <Dialog
      open={visibleDialog}
      onClose={() => setVisibleDialog(false)}
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
              onBlur={handlePrefixChange}
              error={prefixError}
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
              onBlur={handleNameChange}
              error={nameError}
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
      <PopupNotification
        open={openPopup}
        handleClose={handleCancel}
        title={titlePopup}
        content={contentPopup}
      />
    </Dialog>
  );
};

export default CategoryForm;
