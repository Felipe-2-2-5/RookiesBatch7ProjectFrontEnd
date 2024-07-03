import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopupNotification } from "../components";
import { useAuthContext } from "../context/AuthContext";
import { path } from "../routes/routeContants";
import { LoginUser } from "../services/users.service";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await LoginUser({ username, password });
      const data = response.data;
      if (data.flag) {
        setIsAuthenticated(true);
        localStorage.setItem("token", data.token);
        const decodedToken = jwtDecode(data.token);
        const isFirst = decodedToken.FirstLogin === "True";
        if (isFirst) {
          localStorage.setItem("password", password);
        }
        navigate(path.home);
      } else {
        setErrorMessage("Invalid username or password. Please try again.");
        setAlertOpen(true);
      }
    } catch (err) {
      setErrorMessage(err?.UserMessage);
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const validateInput = (input, setInput, setError, errorMessage) => {
    setInput(input);
    if (!input.trim()) {
      setError(errorMessage);
    } else {
      setError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: 3, mt: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            "& > form": {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },
            "& > form > *": {
              width: "100%",
              maxWidth: "400px",
            },
          }}>
          <PopupNotification
            open={alertOpen}
            handleClose={handleAlertClose}
            title="Error"
            content={errorMessage}
            closeContent="OK"
          />
          <Typography
            variant="h2"
            gutterBottom
            sx={{ color: "#D6001C", fontWeight: "bold", mt: 3 }}>
            Login to your account
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 2 }}>
            Access your asset management system securely and efficiently.
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              placeholder="Username"
              variant="outlined"
              value={username}
              onChange={(e) =>
                validateInput(
                  e.target.value.trim(),
                  setUsername,
                  setUsernameError,
                  "Username must not be empty."
                )
              }
              error={!!usernameError}
              helperText={usernameError}
              sx={{
                mt: 2,
                width: "100%",
                "& label.Mui-focused": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                },
              }}
              autoComplete="off"
            />
            <TextField
              placeholder="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                validateInput(
                  e.target.value.trim(),
                  setPassword,
                  setPasswordError,
                  "Password must not be empty."
                )
              }
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end">
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mt: 2,
                width: "100%",
                "& label.Mui-focused": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                },
              }}
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!username || !password}
              sx={{
                mt: 2,
                bgcolor: "#D6001C",
                "&:hover": {
                  bgcolor: "rgba(214, 0, 28, 0.8)",
                },
              }}>
              Login
            </Button>
          </form>
        </Box>
      </Paper>
    </>
  );
};

export default LoginPage;
