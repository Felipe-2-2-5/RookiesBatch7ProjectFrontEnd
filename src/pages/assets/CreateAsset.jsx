import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Typography,
  Box,
  Container,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CreateAssetAPI } from "../../services/asset.service";
import { GetCategories } from "../../services/category.service"; // Corrected typo in import
import { useNavigate } from "react-router-dom";

const CreateAsset = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    name: "",
    category: "",
    specification: "",
    installedDate: "",
  });
  const [asset, setAsset] = useState({
    name: "",
    category: [],
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
    const isValid = /^[a-zA-Z\s]{2,20}$/.test(trimmedValue);

    let errorMessage = "";
    if (trimmedValue.trim() === "") {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    } else if (trimmedValue.length > 20 || trimmedValue.length < 2) {
      errorMessage = "The length of Name should be 2-20 characters.";
    } else if (!isValid) {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must contain only alphabetical characters and spaces.`;
    }

    setFormErrors({ ...formErrors, [name]: errorMessage });
  };
  const handleSpecChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.replace(/\s+/g, " ");
    setAsset({ ...asset, [name]: trimmedValue });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAsset = {
      name: asset.name,
      category: asset.category,
      specification: asset.specification,
      installedDate: asset.installedDate,
      state: asset.state,
    };
    await CreateAssetAPI(newAsset);
  };

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
                <TextField
                  label="Category"
                  value={asset.category}
                  onChange={(e) =>
                    setAsset({ ...asset, category: e.target.value })
                  }
                  select
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
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
                  multiline
                  rows={4}
                  fullWidth
                />
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
                    value={asset.specification}
                    name="installedDate"
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  State
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <RadioGroup name="state" value={asset.state} row>
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
                      !asset.name ||
                      asset.category ||
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
                    onClick={() => navigate("/manage-user")}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>{" "}
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default CreateAsset;
