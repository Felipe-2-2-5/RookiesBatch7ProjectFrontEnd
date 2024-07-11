import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogAssetList from "../../components/DialogAssetList";
import DialogUserList from "../../components/DialogUserList";
import NotificationPopup from "../../components/shared/NotificationPopup";
import { CreateAssignmentAPI } from "../../services/assignments.service";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleAssetDialog, setVisibleAssetDialog] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [titlePopup, setTitlePopup] = useState(false);
  const [contentPopup, setContentPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignments, setAssignments] = useState({
    user: null,
    asset: null,
    // assignedDate: Date.now(),
    assignedDate: new Date(),
    note: "",
  });
  const [formErrors, setFormErrors] = useState({
    user: false,
    asset: false,
    assignedDate: false,
    note: false,
  });
  const [touched, setTouched] = useState({
    assignedDate: false,
    user: false,
    asset: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    let errorMessage = "";
    if (name === "note" && value.length > 600) {
      errorMessage = "Note must not exceed 600 characters";
    }

    setAssignments({ ...assignments, [name]: value });
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };

  const formatDateOnly = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let errorMessage = "";
    if (touched.assignedDate) {
      if (!assignments.assignedDate) {
        errorMessage = "Assigned date is required";
      } else {
        const assignedDateOnly = formatDateOnly(assignments.assignedDate);
        const todayDateOnly = formatDateOnly(new Date());

        if (assignedDateOnly < todayDateOnly) {
          errorMessage =
            "Cannot select Assigned Date in the past. Please select another date.";
        } else if (
          !(assignments.assignedDate instanceof Date) ||
          isNaN(assignments.assignedDate.getTime())
        ) {
          errorMessage = "Invalid date";
        }
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      assignedDate: errorMessage,
    }));
  }, [assignments.assignedDate, touched.assignedDate]);

  useEffect(() => {
    let errorMessage = "";
    if (touched.user && !selectedUser) {
      errorMessage = "User is required";
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      user: errorMessage,
    }));
  }, [visibleDialog, selectedUser, touched.user]);

  useEffect(() => {
    let errorMessage = "";
    if (touched.asset && !selectedAsset) {
      errorMessage = "Asset is required";
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      asset: errorMessage,
    }));
  }, [visibleAssetDialog, selectedAsset, touched.asset]);

  const handleDateChange = (name, date) => {
    setAssignments({ ...assignments, [name]: date });
    setTouched({ ...touched, [name]: true });
  };

  const handleDateBlur = (name) => {
    setTouched({ ...touched, [name]: true });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  const handleUserDialogOpen = () => {
    setTouched({ ...touched, user: true });
    setVisibleDialog(true);
  };

  const handleUserDialogClose = () => {
    setVisibleDialog(false);
  };

  const handleAssetDialogOpen = () => {
    setTouched({ ...touched, asset: true });
    setVisibleAssetDialog(true);
  };

  const handleAssetDialogClose = () => {
    setVisibleAssetDialog(false);
  };
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setAssignments((prev) => ({
      ...prev,
      user: user,
    }));
    handleUserDialogClose();
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setAssignments((prev) => ({
      ...prev,
      asset: asset,
    }));
    handleAssetDialogClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await CreateAssignmentAPI({
        //custom input to match backend
        assignedToId: assignments.user.id,
        assetId: assignments.asset.id,
        assignedDate: assignments.assignedDate
          ? formatDate(assignments.assignedDate)
          : null,
        note: assignments.note,
      });
      if (response) {
        sessionStorage.setItem(
          "assignment_created",
          JSON.stringify(response.data)
        );
        setTitlePopup("Notifications");
        setContentPopup(
          `Asset <b>${assignments.asset.assetName}</b> has been assigned to <b>${assignments.user.firstName} ${assignments.user.lastName}</b>.`
        );
        displayNotificationPopup();
      }
    } catch (error) {
      if (error.UserMessage) {
        setTitlePopup("Error");
        setContentPopup(`${error.UserMessage}`);
        displayNotificationPopup();
      }
    }
  };

  const displayNotificationPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    navigate("/manage-assignment");
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
            Create New Assignment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography onClick={handleUserDialogOpen}>
                  User
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
                    "&:hover": { cursor: "pointer" },
                  }}
                  placeholder="User"
                  fullWidth
                  name="user"
                  value={
                    assignments.user
                      ? `${assignments.user.firstName} ${assignments.user.lastName}`
                      : ""
                  }
                  onClick={handleUserDialogOpen}
                  margin="dense"
                  error={formErrors.user}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleUserDialogOpen}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
                {formErrors.user && (
                  <FormHelperText error>{formErrors.user}</FormHelperText>
                )}
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography handleAssetDialogOpen>
                  Asset
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
                    "&:hover": { cursor: "pointer" },
                  }}
                  placeholder="Asset"
                  fullWidth
                  name="asset"
                  value={
                    assignments.asset ? `${assignments.asset.assetName}` : ""
                  }
                  onClick={handleAssetDialogOpen}
                  margin="dense"
                  error={formErrors.asset}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleAssetDialogOpen}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
                {formErrors.asset && (
                  <FormHelperText error>{formErrors.asset}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Assigned Date
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                  <DatePicker
                    slotProps={{
                      field: { clearable: true },
                      textField: {
                        error: formErrors.assignedDate && touched.assignedDate,
                        onBlur: () => handleDateBlur("assignedDate"),
                      },
                    }}
                    sx={{
                      my: 0.5,
                      width: "100%",
                      "& label.Mui-focused": { color: "#000" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#000" },
                      },
                    }}
                    format="dd/MM/yyyy"
                    label="Assigned Date"
                    value={assignments.assignedDate}
                    onChange={(date) => handleDateChange("assignedDate", date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        required
                        error={formErrors.assignedDate && touched.assignedDate}
                      />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.assignedDate && (
                  <FormHelperText error>
                    {formErrors.assignedDate}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>Note</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                  rows={4}
                  multiline
                  placeholder="Note"
                  fullWidth
                  name="note"
                  value={assignments.note}
                  onChange={handleChange}
                  margin="dense"
                  error={formErrors.note}
                />
                {formErrors.note && (
                  <FormHelperText error>{formErrors.note}</FormHelperText>
                )}
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
                      !assignments.user ||
                      !assignments.asset ||
                      !assignments.assignedDate
                    }
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/manage-assignment")}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
          {visibleDialog && (
            <DialogUserList
              firstUser={null}
              visibleDialog={visibleDialog}
              setVisibleDialog={setVisibleDialog}
              onSelect={handleUserSelect}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          )}

          {visibleAssetDialog && (
            <DialogAssetList
              visibleAssetDialog={visibleAssetDialog}
              setVisibleAssetDialog={setVisibleAssetDialog}
              firstAsset={null}
              onSelect={handleAssetSelect}
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
            />
          )}
        </Box>
      </Container>
      <NotificationPopup
        open={openPopup}
        handleClose={handleClosePopup}
        title={titlePopup}
        content={contentPopup}
      />
    </>
  );
};

export default CreateAssignment;
