import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Layout from "../components/Layout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../context/AuthContext"; // Import the useAuthContext hook
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isNewUser, setIsNewUser] = useState(false); // Track if it's a new user or not
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [userId, setUserId] = useState(null); // Track user id for password change
  const { setIsAuthenticated } = useAuthContext(); // Use the useAuthContext hook to access authentication state and setter
  const navigate = useNavigate();
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleLoginSuccess = () => {
    // Redirect to home or any other page upon successful login
    // You can implement this based on your routing logic

    // Update authentication state to true upon successful login
    setIsAuthenticated(true);

    // Redirect to home page
    navigate("/");
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);

    if (!username.trim()) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }

    if (!password.trim()) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (!username.trim() || !password.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7083/api/users/login",
        {
          username: username,
          password: password,
        }
      );

      if (response.data.flag) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);

        if (decodedToken?.FirstLogin === "True") {
          setIsNewUser(true);
          setUserId(
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ]
          );
        }
        handleLoginSuccess();
      } else {
        // Set error message format
        setAlertMessage(
          "Error: " +
            (response.data.message ||
              "Invalid username or password. Please try again.")
        );
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlertMessage(
        "Error: An error occurred during login. Please try again later."
      );
      setAlertOpen(true);
    }
  };

  // Other functions remain the same...

  const handlePasswordChange = async () => {
    try {
      // const response = await axios.post(
      //   "http://localhost:5224/api/users/change_password",
      //   {
      //     id: userId,
      //     oldPassword: password, // Use the current password for the old password
      //     newPassword: newPassword,
      //     confirmPassword: confirmPassword,
      //   }
      // );

      // Handle success or failure of password change
    } catch (error) {
      console.error("Password change error:", error);
      // Handle error
    }
  };

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);

    // Validate new password
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(
        newPasswordValue
      )
    ) {
      setNewPasswordError(
        "Password must have 1 normal letter, 1 capital letter, 1 number, 1 special character, and length from 8 to 16"
      );
    } else {
      setNewPasswordError("");
    }

    // Check if confirm password matches
    if (confirmPassword && newPasswordValue !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);

    // Check if confirm password matches
    if (newPassword !== confirmPasswordValue) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <Layout>
      <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{ color: "#D6001C", fontWeight: "bold", mt: 3 }}
          >
            Login to your Asset Management Account
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            error={formSubmitted && usernameError}
            helperText={
              formSubmitted && usernameError ? "Username is required" : ""
            }
            sx={{
              mt: 2,
              width: "40%",
              "& label.Mui-focused": { color: "#D6001C" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#D6001C" },
              },
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            error={formSubmitted && passwordError}
            helperText={
              formSubmitted && passwordError ? "Password is required" : ""
            }
            sx={{
              mt: 2,
              width: "40%",
              "& label.Mui-focused": { color: "#D6001C" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#D6001C" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: showPassword ? "#D6001C" : "rgba(214, 0, 28, 0.5)",
                    }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#D6001C",
              "&:hover": {
                bgcolor: "rgba(214, 0, 28, 0.8)",
              },
            }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </Box>
      </Paper>

      {/* Dialog for first-time password change */}
      <Dialog open={isNewUser} onClose={handleAlertClose}>
        <DialogTitle
          sx={{ bgcolor: "grey.300", color: "#D6001C", fontWeight: "bold" }}
        >
          Change Password
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            This is the first time you logged in. <br />
            You have to change your password to continue.
          </Typography>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            error={newPasswordError}
            helperText={newPasswordError}
            sx={{
              mt: 2,
              width: "100%",
              "& label.Mui-focused": { color: "#D6001C" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#D6001C" },
              },
            }}
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            variant="outlined"
            error={confirmPasswordError}
            helperText={confirmPasswordError}
            sx={{
              mt: 2,
              width: "100%",
              "& label.Mui-focused": { color: "#D6001C" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#D6001C" },
              },
            }}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleCancel} style={{ color: '#D6001C' }}>Cancel</Button> */}
          <Button
            disabled={newPasswordError || confirmPasswordError}
            onClick={handlePasswordChange}
            style={{ color: "#D6001C" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert dialog for displaying messages */}
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <DialogTitle
          sx={{ bgcolor: "grey.300", color: "#D6001C", fontWeight: "bold" }}
        >
          Error
        </DialogTitle>
        <DialogContent>
          <Typography>{alertMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} style={{ color: "#D6001C" }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default LoginPage;
