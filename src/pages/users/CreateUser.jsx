import React, { useState } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Typography,
  Box,
  Grid,
  FormHelperText,
} from "@mui/material";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const CreateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "female",
    joinedDate: "",
    type: "",
    location: "",
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

  const formatDate = (date) => {
    return date ? format(new Date(date), "dd/MM/yyyy") : "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    setFormErrors({ ...formErrors, [name]: value.trim() === "" });
  };

  const handleDateChange = (name, date) => {
    setUser({ ...user, [name]: date });
  };

  useEffect(() => {
    if (user.dateOfBirth && user.joinedDate) {
      const dob = new Date(user.dateOfBirth);
      const joined = new Date(user.joinedDate);
      const age = Math.floor(
        (Date.now() - dob) / (365.25 * 24 * 60 * 60 * 1000)
      );
      if (age < 18) {
        setFormErrors((prevErrors) => ({ ...prevErrors, dateOfBirth: true }));
      } else {
        setFormErrors((prevErrors) => ({ ...prevErrors, dateOfBirth: false }));
      }
      if (joined < dob) {
        setFormErrors((prevErrors) => ({ ...prevErrors, joinedDate: true }));
      } else {
        setFormErrors((prevErrors) => ({ ...prevErrors, joinedDate: false }));
      }
    }
  }, [user.dateOfBirth, user.joinedDate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hasErrors = Object.values(formErrors).some((error) => error);
    if (!hasErrors) {
      try {
        const response = await axios.post("https://localhost:7083/api/users", {
          ...user,
          dateOfBirth: formatDate(user.dateOfBirth),
          joinedDate: formatDate(user.joinedDate),
        });
        console.log("Response:", response.data);
        console.log("User created successfully.");
        navigate("/manage-user");
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Form has errors. Please fill all required fields.");
    }
  };

  return (
    <Layout title="Manage User > Create New User">
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
              <Grid item xs={7}>
                <TextField
                  onBlur={handleChange}
                  fullWidth
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  margin="dense"
                  required
                  error={formErrors.firstName}
                />
                {formErrors.firstName && (
                  <FormHelperText error>First name is required!</FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Last Name
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  name="lastName"
                  value={user.lastName}
                  onBlur={handleChange}
                  onChange={handleChange}
                  margin="dense"
                  required
                  error={formErrors.lastName}
                />
                {formErrors.lastName && (
                  <FormHelperText error>Last name is required!</FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Date of Birth
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                  <DatePicker
                    label="Date Of Birth"
                    value={user.dateOfBirth}
                    onChange={(date) => handleDateChange("dateOfBirth", date)}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        required
                        error={formErrors.dateOfBirth}
                      />
                    )}
                  />
                </LocalizationProvider>

                {formErrors.dateOfBirth && (
                  <FormHelperText error>
                    User must be at least 18 years old!
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Gender
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <RadioGroup
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="female"
                    control={
                      <Radio
                        sx={{
                          color: "#d32f2f",
                          "&.Mui-checked": { color: "#d32f2f" },
                        }}
                      />
                    }
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={
                      <Radio
                        sx={{
                          color: "#d32f2f",
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
              <Grid item xs={7}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                  <DatePicker
                    label="Joined Date"
                    value={user.joinedDate}
                    onChange={(date) => handleDateChange("joinedDate", date)}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        required
                        error={formErrors.joinedDate}
                      />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.joinedDate && (
                  <FormHelperText error>
                    {formErrors.joinedDate &&
                    user.joinedDate &&
                    user.dateOfBirth &&
                    new Date(user.joinedDate) < new Date(user.dateOfBirth)
                      ? "Joined date must be greater than Date of Birth!"
                      : "Joined date is required!"}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  Type
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={formErrors.type}
                >
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={user.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                  {formErrors.type && (
                    <FormHelperText error>Type is required!</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid
                item
                xs={3}
                sx={{
                  display: user.type === "admin" ? "flex" : "none",
                  alignItems: "center",
                }}
              >
                <Typography>
                  Location
                  <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                </Typography>
              </Grid>
              <Grid
                item
                xs={7}
                sx={{ display: user.type === "admin" ? "block" : "none" }}
              >
                <FormControl
                  fullWidth
                  margin="dense"
                  required
                  error={formErrors.location}
                >
                  <InputLabel id="location-label">Location</InputLabel>
                  <Select
                    labelId="location-label"
                    name="location"
                    value={user.location}
                    onChange={handleChange}
                    label="Location"
                  >
                    <MenuItem value="hanoi">Ha Noi</MenuItem>
                    <MenuItem value="hochiminh">Ho Chi Minh</MenuItem>
                  </Select>
                  {formErrors.location && (
                    <FormHelperText error>Location is required!</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={10}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ backgroundColor: "#d32f2f", mr: 3 }}
                    disabled={Object.values(formErrors).some((error) => error)}
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
    </Layout>
  );
};

export default CreateUser;
