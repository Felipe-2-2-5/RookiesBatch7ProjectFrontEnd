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
import { vi } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogUserList from "../../components/DialogUserList";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [assignments, setAssignments] = useState({
    user: "",
    asset: "",
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

  const handleSubmit = async (event) => {};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAssignments({ ...assignments, [name]: value });
  };

  useEffect(() => {
    let errorMessage = "";
    if (touched.assignedDate) {
      if (!assignments.assignedDate) {
        errorMessage = "Assigned date is required";
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
    setVisibleDialog(false);
  };

  const handleUserSelect = (user) => {
    setAssignments((prev) => ({
      ...prev,
      user: user.name,
    }));
    handleUserDialogClose();
  };

  return (
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
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
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
                value={assignments.user}
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

            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
              <Typography>
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
                }}
                placeholder="Asset"
                //   onBlur={handleSearchChange}
                fullWidth
                name="asset"
                value={assignments.asset}
                //   onChange={handleSearchChange}
                margin="dense"
                error={formErrors.asset}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
              {formErrors.user && (
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
                  // onBlur={(date) => handleDateChange("assignedDate", date)}
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
                <FormHelperText error>{formErrors.assignedDate}</FormHelperText>
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
                // onBlur={handleChange}
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
          />
        )}
      </Box>
    </Container>
  );
};

export default CreateAssignment;
