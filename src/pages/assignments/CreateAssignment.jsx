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
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { vi } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogUserList from "../../components/DialogUserList";
import DialogAssetList from "../../components/DialogAssetList";

const PopupNotification = ({
  open,
  handleClose,
  title,
  content,
  closeContent,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ color: "#D6001C", fontWeight: "bold", minWidth: 400 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <p>{content}</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: "white",
            bgcolor: "#D6001C",
            "&:hover": { bgcolor: "#D6001C" },
          }}
        >
          {closeContent ? closeContent : "Ok"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleAssetDialog, setVisibleAssetDialog] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [titlePopup, setTitlePopup] = useState(false);
  const [contentPopup, setContentPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignments, setAssignments] = useState({
    user: null,
    asset: null,
    assignedDate: Date.now(),
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

  useEffect(() => {
    let errorMessage = "";
    const currentDate = Date.now();
    if (touched.assignedDate) {
      if (!assignments.assignedDate) {
        errorMessage = "Assigned date is required";
      } else if (assignments.assignedDate > currentDate) {
        errorMessage =
          "Cannot select Assigned Date in the past. Please select another date.";
      } else if (isNaN(assignments.assignedDate.getTime())) {
        errorMessage = "Invalid date";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      assignedDate: errorMessage,
    }));
  }, [assignments.assignedDate, touched.assignedDate]);

  const handleDateChange = (name, date) => {
    setAssignments({ ...assignments, [name]: date });
    setTouched({ ...touched, [name]: true });
  };

  const handleDateBlur = (name, date) => {
    setTouched({ ...touched, [name]: true });
  };

  const handleUserDialogOpen = () => {
    setVisibleDialog(true);
  };

  const handleUserDialogClose = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hasErrors = Object.values(formErrors).some((error) => error);
    if (!hasErrors) {
      try {
        // const response = await CreateUserAPI({
        //   ...users,
        //   dateOfBirth: users.dateOfBirth ? formatDate(users.dateOfBirth) : null,
        //   joinedDate: users.joinedDate ? formatDate(users.joinedDate) : null,
        // });
        // console.log(response);
        // if (response) {
        //   sessionStorage.setItem("user_created", JSON.stringify(response.data));
        //   setTitlePopup("Notifications");
        //   setContentPopup(
        //     `User ${users.firstName} ${users.lastName} has been created.`
        //   );
        //   displayPopupNotification();
        // }
      } catch (error) {
        setTitlePopup("Error");
        setContentPopup(`error: ${error.userMessage}`);
        displayPopupNotification();
      }
    } else {
      setTitlePopup("Error");
      setContentPopup("Form has errors. Please fill all required fields.");
      displayPopupNotification();
    }
  };

  const displayPopupNotification = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    navigate("/manage-user");
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
                <Typography onClick={() => setVisibleAssetDialog(true)}>
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
                  value={assignments.asset}
                  onClick={() => setVisibleAssetDialog(true)}
                  margin="dense"
                  error={formErrors.asset}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setVisibleAssetDialog(true)}>
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
                  Date Of Birth
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                  <DatePicker
                    slotProps={{
                      textField: {
                        error: formErrors.assignedDate && touched.assignedDate,
                        onBlur: () => handleDateBlur("assignedDate"),
                      },
                    }}
                    sx={{
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
                <Typography>
                  Note
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
              onSelect={handleUserSelect}
              selectedAsset={selectedUser}
              setSelectedAsset={setSelectedUser}
            />
          )}
        </Box>
      </Container>
      <PopupNotification
        open={openPopup}
        handleClose={handleClosePopup}
        title={titlePopup}
        content={contentPopup}
      />
    </>
  );
};

export default CreateAssignment;
