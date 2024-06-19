import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

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

export default PopupNotification;
