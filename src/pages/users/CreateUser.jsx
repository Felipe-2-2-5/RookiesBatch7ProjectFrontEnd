import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useAuthContext } from "../../context/AuthContext";
import { removeExtraWhitespace } from "../../utils/TrimValue";
import { CreateUserAPI } from "../../services/users.service";

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

const CreateUser = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const [error, setError] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [titlePopup, setTitlePopup] = useState(false);
  const [contentPopup, setContentPopup] = useState(false);

  const [users, setUsers] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    gender: 1,
    joinedDate: null,
    type: 0,
    location: localStorage.getItem("location"),
  });

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    gender: false,
    joinedDate: false,
    type: false,
    location: false,
  });

  const [touched, setTouched] = useState({
    dateOfBirth: false,
    joinedDate: false,
  });


  const handleLastNameChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.replace(/\s+/g, " ");
    setUsers({ ...users, [name]: trimmedValue });
    const isValid = /^[a-zA-Z]{2,20}$/.test(trimmedValue);

    let errorMessage = "";
    if (trimmedValue.trim() === "") {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    }
    else if (trimmedValue.length < 2) {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must be at least 2 characters long.`;
    } else if (trimmedValue.length > 20) {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } must not exceed 20 characters.`;
    }
    else if(!isValid){
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      }  must contain only alphabetical characters and spaces.`;
    }

    setFormErrors({ ...formErrors, [name]: errorMessage });
  };

  const handleLastNameBlur = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    setUsers({ ...users, [name]: trimmedValue });
  };

  const handleTypeChange = (event) => {
    const { name, value } = event.target;
    //type staff: set as admin
    if (value === 0) {
      setUsers({
        ...users,
        [name]: value,
        location: localStorage.getItem("location"),
      });
    } else {
      setUsers({ ...users, [name]: value });
    }
  };
  const handleGenderChange = (event) => {
    const { name, value } = event.target;
    setUsers({ ...users, [name]: value });
  };

  const handleNameChange = (event) => {
    let errorMessage = "";
    let { name, value } = event.target;
    let trimmedValue = value.replace(/[^a-zA-Z]/g, "");
    const isValid = /^[a-zA-Z]{2,20}$/.test(trimmedValue);

    setUsers({ ...users, [name]: trimmedValue });
    if (value.trim() === "") {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    } else if (value.length > 20 || value.length < 2) {
      console.log("sting length: " + value.length);
      errorMessage = "The length of Firstname should be 2-20 characters.";
    } else if (!isValid) {
      errorMessage = `First name must contain only alphabetical characters.`;
    }
    setFormErrors({ ...formErrors, [name]: errorMessage });
  };
  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    setUsers({ ...users, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setUsers({ ...users, [name]: date });
    setTouched({ ...touched, [name]: true });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  const isWeekend = (date) => {
    const day = date?.getDay();
    return day === 6 || day === 0;
  };

  useEffect(() => {
    let errorMessage = "";
    if (touched.joinedDate) {
      const joined = new Date(users.joinedDate);
      const dob = new Date(users.dateOfBirth);

      if (dob && joined < dob) {
        errorMessage = "Joined date must be after date of birth.";
      } else if (isWeekend(joined)) {
        errorMessage = "Joined date is Saturday or Sunday. Please select a different date";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      joinedDate: errorMessage,
    }));
  }, [users.joinedDate, users.dateOfBirth, touched.joinedDate]);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case "invalidDate": {
        return "Invalid Date";
      }

      default: {
        return "";
      }
    }
  }, [error]);

  useEffect(() => {
    let errorMessage = "";
    if (touched.dateOfBirth) {
      const dob = new Date(users.dateOfBirth);
      const age = Math.floor(
        (Date.now() - dob) / (365.25 * 24 * 60 * 60 * 1000)
      );

      if (age < 18) {
        errorMessage = "User is under 18. Please select a different date.";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      dateOfBirth: errorMessage,
    }));
  }, [users.dateOfBirth, touched.dateOfBirth]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hasErrors = Object.values(formErrors).some((error) => error);
    if (!hasErrors) {
      if (!users.location) {
        users.location = currentUser.locality;
      }
      if (users.location) {
        users.location === "HaNoi"
          ? (users.location = 1)
          : (users.location = 0);
      }
      if (users.gender) {
        users.gender = +users.gender;
      }
      try {
        const response = await CreateUserAPI({
          ...users,
          dateOfBirth: users.dateOfBirth ? formatDate(users.dateOfBirth) : null,
          joinedDate: users.joinedDate ? formatDate(users.joinedDate) : null,
        });
        console.log(response);
        if (response) {
          sessionStorage.setItem("user_created", JSON.stringify(response.data));
          setTitlePopup("Notifications");
          setContentPopup(
            `User ${users.firstName} ${users.lastName} has been created.`
          );
          displayPopupNotification();
        }
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
            Create New User
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  First Name
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
                  placeholder="First Name"
                  onBlur={handleNameChange}
                  fullWidth
                  name="firstName"
                  value={users.firstName}
                  onChange={handleNameChange}
                  margin="dense"
                  error={formErrors.firstName}
                />
                {formErrors.firstName && (
                  <FormHelperText error>{formErrors.firstName}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Last Name
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
                  placeholder="Last Name"
                  fullWidth
                  name="lastName"
                  error={formErrors.lastName}
                  value={users.lastName}
                  onBlur={handleLastNameBlur}
                  onChange={handleLastNameChange}
                />
                {formErrors.lastName && (
                  <FormHelperText error>{formErrors.lastName}</FormHelperText>
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
                    onError={(newError) => setError(newError)}
                    slotProps={{
                      textField: {
                        helperText: errorMessage,
                      },
                    }}
                    sx={{
                      "& label.Mui-focused": { color: "#000" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#000" },
                      },
                    }}
                    format="dd/MM/yyyy"
                    label="Date Of Birth"
                    value={users.dateOfBirth}
                    onChange={(date) => handleDateChange("dateOfBirth", date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        error={!!formErrors.dateOfBirth && touched.dateOfBirth}
                      />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.dateOfBirth && (
                  <FormHelperText error>
                    {formErrors.dateOfBirth}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Gender
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <RadioGroup
                  name="gender"
                  value={users.gender}
                  onChange={handleGenderChange}
                  row
                >
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
                    label="Female"
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
                    label="Male"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Joined Date
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                  <DatePicker
                    onError={(newError) => setError(newError)}
                    slotProps={{
                      textField: {
                        helperText: errorMessage,
                      },
                    }}
                    sx={{
                      "& label.Mui-focused": { color: "#000" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#000" },
                      },
                    }}
                    format="dd/MM/yyyy"
                    label="Joined Date"
                    value={users.joinedDate}
                    onChange={(date) => handleDateChange("joinedDate", date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        required
                        // error={!!formErrors.joinedDate}
                        error={!!formErrors.joinedDate && touched.joinedDate}
                      />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.joinedDate && (
                  <FormHelperText error>{formErrors.joinedDate}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Type
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={formErrors.type}
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                >
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={users.type}
                    onChange={handleTypeChange}
                    label="Type"
                  >
                    <MenuItem value={1}>Admin</MenuItem>
                    <MenuItem value={0}>Staff</MenuItem>
                  </Select>
                  {formErrors.type && (
                    <FormHelperText error>Type is required!</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Location
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={formErrors.location}
                  sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }}
                >
                  <InputLabel id="location-label">Location</InputLabel>
                  <Select
                    labelId="location-label"
                    name="location"
                    value={users.location}
                    onChange={handleLocationChange}
                    label="Location"
                    disabled={users.type === 0}
                  >
                    <MenuItem value="HaNoi">Ha Noi</MenuItem>
                    <MenuItem value="HCM">Ho Chi Minh</MenuItem>
                  </Select>
                  {formErrors.location && (
                    <FormHelperText error>{formErrors.location}</FormHelperText>
                  )}
                </FormControl>
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
                      !users.firstName ||
                      !users.lastName ||
                      !users.dateOfBirth ||
                      !users.joinedDate
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
              </Grid>
            </Grid>
          </form>
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

export default  CreateUser;
