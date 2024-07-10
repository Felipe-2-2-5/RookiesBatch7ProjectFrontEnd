import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const NotificationPopup = ({
  open,
  handleClose,
  title,
  content,
  closeContent,
}) => {
  const contentLines = typeof content === "string" ? content.split("\n") : [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md">
      <DialogTitle
        sx={{
          borderBottom: "3px solid grey",
          color: "#D6001C",
          fontWeight: "bold",
          minWidth: 400,
          bgcolor: "lightgrey",
        }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {contentLines.map((line, index) => (
          <Typography
            key={index}
            dangerouslySetInnerHTML={{ __html: line }}
            sx={{
              paddingTop: "10px",
            }}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: "white",
            bgcolor: "#D6001C",
            "&:hover": { bgcolor: "#D6001C" },
          }}>
          {closeContent ? closeContent : "Ok"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationPopup;
