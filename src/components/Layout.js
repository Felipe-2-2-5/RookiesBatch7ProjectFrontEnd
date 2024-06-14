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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { AppRouter } from "../routes/AppRouter";
import Footer from "./Footer";
import Header from "./Header";
import VerticalNavbarAdmin from "./VerticalNavbarAdmin";
import VerticalNavbarStaff from "./VerticalNavbarStaff";
import { ChangePassword, LoginUser } from "../services/Service";
const Layout = ({ children }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentUser, isAuthenticated, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {}, [currentUser.isFirst]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCloseDialog = () => {
    setShowLogoutDialog(false);
  };

  const handlePasswordChange = async () => {
    const oldPassword = localStorage.getItem("password");
    const newPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (newPassword === oldPassword) {
      setNewPasswordError(
        "New password must be different from the old password."
      );
      return;
    }
    if (!newPasswordRegex.test(newPassword)) {
      setNewPasswordError(
        "New password must be 8-16 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
      return;
    }

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
          setShowLogoutDialog(false);
          localStorage.removeItem("firstLogin");
          setShowSuccessDialog(true);
          localStorage.removeItem("password");
        } else {
          setNewPasswordError("Failed to change password. Please try again.");
        }
      } else {
        setNewPasswordError("User token not found. Please login again.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setNewPasswordError(
        "An error occurred while changing password. Please try again later."
      );
    }
  };

  const handlePasswordBlur = () => {
    setNewPasswordError("");
    // const oldPassword = localStorage.getItem("password");
    if (!newPassword) {
      setNewPasswordError("New password cannot be empty.");
    }
  };

  const handleConfirmPassword = () => {
    setConfirmPasswordError("");
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password cannot be empty.");
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match. Please re-enter.");
    }
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
            <AppRouter />
          </main>
        </Box>
      </Box>
      <Footer />

      <Dialog
        open={currentUser.isFirst}
        onClose={handleCloseDialog}
        disableBackdropClick
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
              onChange={(e) => setNewPassword(e.target.value.trim())}
              onBlur={handlePasswordBlur}
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
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
              onBlur={handleConfirmPassword}
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
            disabled={!!newPasswordError || !!confirmPasswordError}
            onClick={handlePasswordChange}
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
    </div>
  );
};

export default Layout;
