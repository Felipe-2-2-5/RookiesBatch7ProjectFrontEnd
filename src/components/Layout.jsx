import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { AdminRoutes, StaffRoutes, BaseRoutes } from "../routes";
import { ChangePassword, LoginUser } from "../services/users.service";
import Footer from "./Footer";
import Header from "./Header";
import PopupNotification from "./PopupNotification";
import VerticalNavbarAdmin from "./VerticalNavbarAdmin";
import VerticalNavbarStaff from "./VerticalNavbarStaff";

const Layout = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentUser, isAuthenticated, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const oldPassword = localStorage.getItem("password");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //   if (new Date(currentUser.expires * 1000) < new Date()) {
  //     setIsAuthenticated(false);
  //     localStorage.removeItem("token");

  //   }
  //   console.log(currentUser.expires);
  // }, [currentUser.expires, isAuthenticated, setIsAuthenticated]);
  const handelSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userId = currentUser.id;
        const response1 = await ChangePassword({
          id: userId,
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: newPassword,
        });

        if (response1.data === true) {
          const username = currentUser.name;
          const response2 = await LoginUser({
            userName: username,
            password: newPassword,
          });

          const data = response2.data;
          setIsAuthenticated(true);
          localStorage.setItem("token", data.token);
          currentUser.isFirst = false;

          setNewPassword("");
          localStorage.removeItem("firstLogin");
          setShowSuccessDialog(true);
          localStorage.removeItem("password");
        } else {
          setErrorMessage("Failed to change password. Please try again.");
          setShowErrorDialog(true);
        }
      } else {
        setErrorMessage("User token not found. Please login again.");
        setShowErrorDialog(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        "An error occurred while changing password. Please try again later."
      );
      setShowErrorDialog(true);
    }
  };

  const handleNewPasswordChange = (event) => {
    const newPasswordValue = event.target.value.trim();
    setNewPassword(newPasswordValue);
    setNewPasswordError("");

    if (!newPasswordValue) {
      setNewPasswordError("New password cannot be empty.");
      return;
    }

    const newPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*?])[A-Za-z\d!@#$%&*?]{8,16}$/;
    if (newPassword === oldPassword) {
      setNewPasswordError(
        "New password must be different from the old password."
      );
      return;
    }

    if (!newPasswordRegex.test(newPasswordValue)) {
      setNewPasswordError(
        "New password must be 8-16 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character ( only include !, @, #, $, %, &, *, ?)."
      );
      return;
    }

    // Clear the error if all conditions are satisfied
    setNewPasswordError("");
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPwd = event.target.value.trim();
    setConfirmPassword(confirmPwd);
    setConfirmPasswordError("");

    if (!confirmPwd) {
      setConfirmPasswordError("Confirm password cannot be empty.");
      return;
    }

    if (confirmPwd !== newPassword) {
      setConfirmPasswordError("Passwords do not match. Please re-enter.");
      return;
    }

    // Clear the error if passwords match
    setConfirmPasswordError("");
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <CssBaseline />
      <Header />
      <Box display="flex" p={2}>
        <Box>
          {isAuthenticated &&
            (currentUser.role === "Admin" ? (
              <VerticalNavbarAdmin />
            ) : (
              <VerticalNavbarStaff />
            ))}
        </Box>
        <Box flexGrow={1} ml={2}>
          <main style={{ p: "2" }}>
            {!isAuthenticated && <BaseRoutes />}
            {isAuthenticated &&
              (currentUser.role === "Admin" ? (
                <AdminRoutes />
              ) : (
                <StaffRoutes />
              ))}
          </main>
        </Box>
      </Box>
      <Footer />

      <Dialog
        open={currentUser.isFirst}
        onClose={!currentUser.isFirst}
        disablebackdropclick="true"
        disableEscapeKeyDown
      >
        <DialogTitle sx={{ color: "#D6001C" }}>Change Password</DialogTitle>
        <DialogContent>
          <Typography>
            This is the first time you've logged in. You must change your
            password to continue.
          </Typography>
          <Box mt={2}>
            <TextField
              autoFocus
              margin="dense"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={handleNewPasswordChange}
              onBlur={handleNewPasswordChange}
              error={newPasswordError}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleNewPasswordVisibility}>
                      {showNewPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& label.Mui-focused": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                },
              }}
            />
            {newPasswordError && (
              <Typography color="error" variant="caption" component="div">
                {newPasswordError}
              </Typography>
            )}
          </Box>
          <Box mt={2}>
            <TextField
              margin="dense"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              error={confirmPasswordError}
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& label.Mui-focused": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                },
              }}
            />
            {confirmPasswordError && (
              <Typography color="error" variant="caption" component="div">
                {confirmPasswordError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              !!newPasswordError ||
              !!confirmPasswordError ||
              !newPassword ||
              !confirmPassword
            }
            onClick={handelSubmit}
            variant="contained"
            sx={{
              bgcolor: "#D6001C",
              "&:hover": { bgcolor: "#D6001C" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle sx={{ color: "#D6001C", fontWeight: "bold" }}>
          Success
        </DialogTitle>
        <DialogContent>
          <Typography>Password changed successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowSuccessDialog(false)}
            sx={{
              color: "white",
              bgcolor: "#D6001C",
              "&:hover": { bgcolor: "#D6001C" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <PopupNotification
        open={showErrorDialog}
        title="Error"
        message={errorMessage}
        handleClose={() => setShowErrorDialog(false)}
      />
    </div>
  );
};

export default Layout;
