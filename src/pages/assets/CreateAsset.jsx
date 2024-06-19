import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Typography,
  Box,
  Container,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CreateAssetAPI } from "../../services/asset.service";
import { GetCategories } from "../../services/category.service"; // Corrected typo in import
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import CategoryForm from "./CategoryForm";

const CreateAsset = () => {
  const [categories, setCategories] = useState([]);
  const [openCategoryForm, setOpenCategoryForm] = useState(false);

  const handleOpenCategoryForm = () => {
    setOpenCategoryForm(true);
  };
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    name: "",
    category: "",
    specification: "",
    installedDate: "",
  });
  const [asset, setAsset] = useState({
    name: "",
    category: null,
    specification: "",
    installedDate: null,
    state: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await GetCategories(); // Corrected function name
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleNameBlur = (event) => {
    let errorMessage = "";
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    if (trimmedValue.trim() === "") {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    }
    setAsset({ ...asset, [name]: trimmedValue });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.replace(/\s+/g, " ");
    setAsset({ ...asset, [name]: trimmedValue });
    const isValid = /^[a-zA-Z0-9\s]{2,50}$/.test(trimmedValue);
    let errorMessage = "";
    if (trimmedValue.trim() === "") {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    } else if (trimmedValue.length > 50 || trimmedValue.length < 2) {
      errorMessage = "The length of Name should be 2-50 characters.";
    } else if (!isValid) {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must contain only alphabetical characters, numbers and spaces.`;
    }

    setFormErrors({ ...formErrors, [name]: errorMessage });
  };
  const handleCategoryBlur = () => {
    let errorMessage = "";
    if (asset.category === null) {
      errorMessage = `Category is required`;
    }
    setFormErrors({ ...formErrors, category: errorMessage });
  };
  const handleSpecChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.replace(/\s+/g, " ");
    let errorMessage = "";
    if (trimmedValue === "") {
      errorMessage = `Specification is required`;
    } else if (trimmedValue.length > 500 || trimmedValue.length < 2) {
      errorMessage = "The length of Name should be 2-500 characters.";
    }
    setAsset({ ...asset, [name]: trimmedValue });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };
  const handleSpecBlur = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    let errorMessage = "";
    if (trimmedValue === "") {
      errorMessage = `Specification is required`;
    } else if (trimmedValue.length > 500 || trimmedValue.length < 2) {
      errorMessage = "The length of Name should be 2-500 characters.";
    }
    setAsset({ ...asset, [name]: trimmedValue });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };
  const handleDateBlur = () => {
    let errorMessage = "";
    if (asset.installedDate === null) {
      errorMessage = `Installed Date is required`;
    } else if (isNaN(asset.installedDate.getTime())) {
      errorMessage = "Invalid date";
    }
    setFormErrors({ ...formErrors, installedDate: errorMessage });
  };
  const handleDateChange = (date) => {
    console.log(date);
    let errorMessage = "";
    if (asset.installedDate === null || asset.installedDate === "") {
      errorMessage = `Installed Date is required`;
    } else if (isNaN(asset.installedDate.getTime())) {
      errorMessage = "Invalid date";
    }
    setFormErrors({ ...formErrors, installedDate: errorMessage });
    setAsset({ ...asset, installedDate: date });
  };
  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };
  const handleCategoryChange = (category) => {
    let errorMessage = "";
    if (!category) {
      errorMessage = `Category is required`;
    }
    setFormErrors({ ...formErrors, category: errorMessage });
    setAsset({ ...asset, category: category });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAsset = {
      assetName: asset.name,
      categoryId: asset.category.id,
      specification: asset.specification,
      installedDate: formatDate(asset.installedDate),
      assetState: asset.state,
    };
    await CreateAssetAPI(newAsset);
  };
  const categoriesWithButton = [
    ...categories,
    { name: "Add Category", isButton: true },
  ];
  return (
    <>
      <Container sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Box sx={{ width: "60%", borderRadius: 1, p: 1 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: "#d32f2f",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Create New Asset
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "500px",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Name
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label="Name"
                  value={asset.name}
                  name="name"
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  error={formErrors.name}
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                />
                {formErrors.name && (
                  <FormHelperText error>{formErrors.name}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Category
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  onChangeCapture={handleCategoryBlur}
                  options={categoriesWithButton}
                  getOptionLabel={(option) => option.name}
                  value={
                    categories.find(
                      (cat) => cat.name === asset.category?.name
                    ) || null
                  }
                  onChange={(e, value) => {
                    if (value && value.isButton) {
                      handleOpenCategoryForm();
                    } else {
                      handleCategoryChange(value);
                    }
                  }}
                  renderOption={(props, option) =>
                    option.isButton ? (
                      <li
                        {...props}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCategoryForm();
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          title="Add Category"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCategoryForm();
                          }}
                          sx={{
                            color: "black",
                            textTransform: "none",
                            fontSize: "16px",
                            padding: "0",
                            marginLeft: "5px",
                            width: "100%",
                          }}
                        >
                          + Add Category
                        </Button>
                      </li>
                    ) : (
                      <li {...props}>{option.name}</li>
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      onBlur={handleCategoryBlur}
                      error={formErrors.category}
                      {...params}
                      label="Category"
                      fullWidth
                      sx={{
                        "& label.Mui-focused": { color: "#000" },
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": { borderColor: "#000" },
                        },
                      }}
                    />
                  )}
                />
                {formErrors.category && (
                  <FormHelperText error>{formErrors.category}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Specification
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                  label="Specification"
                  value={asset.specification}
                  name="specification"
                  onChange={handleSpecChange}
                  onBlur={handleSpecBlur}
                  error={formErrors.specification}
                  multiline
                  rows={4}
                  fullWidth
                />
                {formErrors.specification && (
                  <FormHelperText error>
                    {formErrors.specification}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Installed Date
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    sx={{
                      "& label.Mui-focused": { color: "#000" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#000" },
                      },
                    }}
                    format="dd/MM/yyyy"
                    label="Installed Date"
                    value={asset.installedDate}
                    name="installedDate"
                    slotProps={{
                      textField: {
                        error: formErrors.installedDate,
                        onBlur: () => handleDateBlur(),
                      },
                    }}
                    onChange={(date) => handleDateChange(date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={formErrors.installedDate}
                      />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.installedDate && (
                  <FormHelperText error>
                    {formErrors.installedDate}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  State
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <RadioGroup
                  name="state"
                  value={asset.state}
                  row
                  onChange={(e) =>
                    setAsset({ ...asset, state: e.target.value })
                  }
                >
                  <FormControlLabel
                    value={0}
                    control={
                      <Radio
                        sx={{
                          color: "#000",
                          "&.Mui-checked": { color: "#d32f2f" },
                        }}
                      />
                    }
                    label="Availble"
                  />
                  <FormControlLabel
                    value={1}
                    control={
                      <Radio
                        sx={{
                          color: "#000",
                          "&.Mui-checked": { color: "#d32f2f" },
                        }}
                      />
                    }
                    label="Not Availble"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
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
                    disabled={
                      Object.values(formErrors).some((error) => error) ||
                      !asset.name ||
                      !asset.category ||
                      !asset.specification ||
                      !asset.installedDate
                    }
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/manage-asset")}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
          {openCategoryForm && <CategoryForm />}
        </Box>
      </Container>
    </>
  );
};

export default CreateAsset;