import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import React from "react";
  
  const PopupNotificationExtra = ({
    open,
    handleClose,
    handleConfirm,
    title,
    content,
    closeContent,
    confirmContent,
  }) => {
    const contentLines = content ? content.split("\n") : [];
  
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            borderBottom: "3px solid grey",
            color: "#D6001C",
            fontWeight: "bold",
            minWidth: 400,
            bgcolor: "lightgrey",
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          {contentLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
                    variant="outlined"
                    color="secondary"
          >
            {closeContent ? closeContent : "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
                    variant="contained"
                    type="submit"
            sx={{
                backgroundColor: "#d32f2f",
                mr: 3,
                "&:hover": {
                  backgroundColor: "#a50000",
                },
              }}
          >
            {confirmContent ? confirmContent : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default PopupNotificationExtra;
  