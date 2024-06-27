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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { EditAssetAPI, GetAsset } from "../../services/asset.service";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import PopupNotification from "../../components/PopupNotification";

const EditAsset = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [titlePopup, setTitlePopup] = useState(false);
  const [contentPopup, setContentPopup] = useState(false);
  const [touched, setTouched] = useState();
  const { id } = useParams();

  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    assetName: "",
    category: "",
    specification: "",
    installedDate: "",
  });
  const [asset, setAsset] = useState({
    assetName: "",
    category: null,
    specification: "",
    installedDate: null,
    state: 0,
  });
  const fetchAsset = async (id) => {
    const res = await GetAsset(id);
    const asset = res.data;
    setAsset({
      assetName: asset.assetName,
      category: asset.category,
      specification: asset.specification,
      installedDate: new Date(asset.installedDate),
      state: parseInt(asset.state, 10),
    });
  };
  useEffect(() => {
    fetchAsset(id);
  }, [id]);
  useEffect(() => {
    if (touched) {
      let errorMessage = "";
      if (asset.installedDate === null) {
        errorMessage = `Installed Date is required`;
      } else if (isNaN(new Date(asset.installedDate).getTime())) {
        errorMessage = "Invalid date";
      }
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        installedDate: errorMessage,
      }));
    }
  }, [touched, asset.installedDate]);

  const handleNameBlur = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.replace(/\s+/g, " ");
    const isValid = /^[a-zA-Z0-9\s]{2,50}$/.test(trimmedValue);
    let errorMessage = "";
    if (trimmedValue.trim() === "") {
      errorMessage = `Name is required`;
    } else if (trimmedValue.length > 50 || trimmedValue.trim().length < 2) {
      errorMessage = "The length of Name should be 2-50 characters.";
    } else if (!isValid) {
      errorMessage = `Name must contain only alphabetical characters, numbers and spaces.`;
    }
    setAsset({ ...asset, [name]: trimmedValue.trim() });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.replace(/\s+/g, " ");
    const isValid = /^[a-zA-Z0-9\s]{2,50}$/.test(trimmedValue);
    let errorMessage = "";
    if (trimmedValue.trim() === "") {
      errorMessage = `Name is required`;
    } else if (trimmedValue.length > 50 || trimmedValue.trim().length < 2) {
      errorMessage = "The length of Name should be 2-50 characters.";
    } else if (!isValid) {
      errorMessage = `Name must contain only alphabetical characters, numbers and spaces.`;
    }
    setAsset({ ...asset, [name]: trimmedValue });

    setFormErrors({ ...formErrors, [name]: errorMessage });
  };

  const handleSpecChange = (event) => {
    const { name, value } = event.target;
    let errorMessage = "";
    if (value === "") {
      errorMessage = `Specification is required`;
    } else if (value.length > 500 || value.length < 2) {
      errorMessage = "The length of Specification should be 2-500 characters.";
    }
    setAsset({ ...asset, [name]: value });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };
  const handleSpecBlur = (event) => {
    const { name, value } = event.target;
    let errorMessage = "";
    if (value === "") {
      errorMessage = `Specification is required`;
    } else if (value.length > 500 || value.length < 2) {
      errorMessage = "The length of Specification should be 2-500 characters.";
    }
    setAsset({ ...asset, [name]: value });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };
  const handleDateBlur = () => {
    setTouched(true);
  };
  const handleDateChange = (date) => {
    setAsset({ ...asset, installedDate: date });
    setTouched(true);
  };
  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAsset = {
      assetName: asset.assetName,
      categoryId: asset.category.id,
      specification: asset.specification,
      installedDate: formatDate(asset.installedDate),
      state: parseInt(asset.state, 10),
    };
    var res = await EditAssetAPI(id, newAsset);
    if (res) {
      sessionStorage.setItem("asset_created", JSON.stringify(res.data));
      setOpenPopup(true);
      setTitlePopup("Notifications");
      setContentPopup(`Asset ${asset.assetName}  has been edited.`);
    }
  };
  const handleCancel = () => {
    setOpenPopup(false);
    navigate("/manage-asset");
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
            Edit Asset
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
                  value={asset.assetName}
                  name="assetName"
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  error={formErrors.assetName}
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                />
                {formErrors.assetName && (
                  <FormHelperText error>{formErrors.assetName}</FormHelperText>
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
                  name="category"
                  value={asset.category?.name}
                  fullWidth
                  disabled
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                />
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
                    onChange={handleDateChange}
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
              <Grid item xs={3}>
                <Typography>
                  State
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <RadioGroup
                  name="state"
                  value={asset.state}
                  column
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
                  <FormControlLabel
                    value={2}
                    control={
                      <Radio
                        sx={{
                          color: "#000",
                          "&.Mui-checked": { color: "#d32f2f" },
                        }}
                      />
                    }
                    label="Wating for recycling"
                  />
                  <FormControlLabel
                    value={3}
                    control={
                      <Radio
                        sx={{
                          color: "#000",
                          "&.Mui-checked": { color: "#d32f2f" },
                        }}
                      />
                    }
                    label="Recycled"
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
                      !asset.assetName ||
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
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
        <PopupNotification
          open={openPopup}
          handleClose={handleCancel}
          title={titlePopup}
          content={contentPopup}
        />
      </Container>
    </>
  );
};

export default EditAsset;
