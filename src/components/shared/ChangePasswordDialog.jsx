import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { PopupNotification } from "../";
import { useAuthContext } from "../../context/AuthContext";
import { ChangePassword } from "../../services/users.service";

const ChangePasswordDialog = ({ open, handleClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const { currentUser } = useAuthContext();

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showOldPassword, setshowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOldPasswordChange = (event) => {
    const oldPasswordValue = event.target.value.trim();
    setOldPassword(oldPasswordValue);
    setOldPasswordError("");

    if (!oldPasswordValue) {
      setOldPasswordError("Old password cannot be empty.");
      return;
    }

    // Check if oldPassword and newPassword match
    if (newPassword && oldPasswordValue === newPassword) {
      setNewPasswordError(
        "Old password must be different from the new password."
      );
    } else {
      setNewPasswordError("");
    }

    // Clear the error if all conditions are satisfied
    setOldPasswordError("");
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
    if (newPasswordValue === oldPassword) {
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

    // Check if newPassword and confirmPassword match
    if (confirmPassword && newPasswordValue !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match. Please re-enter.");
    } else {
      setConfirmPasswordError("");
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

  const toggleOldPasswordVisibility = () => {
    setshowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const clearFieldsAndErrors = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      const userId = currentUser.id;
      const body = {
        Id: userId,
        OldPassword: oldPassword,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword,
      };
      const result = await ChangePassword(body);
      if (result) {
        setSuccessMessage("Your password has been changed successfully!");
        setErrorPopupOpen(true);
        clearFieldsAndErrors();
        handleClose();
      }
    } catch (err) {
      setOldPasswordError(err?.UserMessage);
    }
  };

  const handleCloseDialog = () => {
    clearFieldsAndErrors();
    handleClose();
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            color: "#D6001C",
            bgcolor: "grey.300",
            borderBottom: "3px solid grey",
            fontWeight: "bold",
          }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            fullWidth
            value={oldPassword}
            onChange={handleOldPasswordChange}
            error={!!oldPasswordError}
            helperText={oldPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleOldPasswordVisibility}>
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& label.Mui-focused": {
                color: "black",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "black",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={handleNewPasswordChange}
            error={!!newPasswordError}
            helperText={newPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleNewPasswordVisibility}>
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& label.Mui-focused": {
                color: "black",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "black",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& label.Mui-focused": {
                color: "black",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "black",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#D6001C",
              color: "white",
              borderColor: "black",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
            disabled={
              !oldPassword ||
              !newPassword ||
              !confirmPassword ||
              !!newPasswordError ||
              !!confirmPasswordError
            }>
            save
          </Button>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "grey",
              border: "2px solid grey",
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <PopupNotification
        open={errorPopupOpen}
        handleClose={handleCloseErrorPopup}
        title="Change Password"
        content={successMessage || error}
        closeContent="Close"
      />
    </>
  );
};

export default ChangePasswordDialog;
