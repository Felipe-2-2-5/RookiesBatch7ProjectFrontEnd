import { DisabledByDefault } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { assignmentStateEnum } from "../../enum/assignmentStateEnum";
import formatDate from "../../utils/formatDate";

const AssignmentDetailDialog = ({
  selectedAssignment,
  dialogOpen,
  handleDialogClose,
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth={true}>
      <DialogTitle
        sx={{
          bgcolor: "grey.300",
          color: "#D6001C",
          fontWeight: "bold",
          borderBottom: "1px solid black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        Detailed Assignment Information
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 12,
            color: "#D6001C",
          }}>
          <DisabledByDefault />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          borderTop: "1px solid black",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          overflowY: "auto",
          wordWrap: "break-word",
          wordBreak: "break-all",
        }}>
        <Grid
          container
          spacing={2}>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Asset Code:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <Typography variant="body1">
              {selectedAssignment.asset.assetCode}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Asset Name:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <div
              style={{
                maxHeight: "100px",
                overflowY: "auto",
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}></div>
            <Typography variant="body1">
              {selectedAssignment.asset.assetName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Specification:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <div
              style={{
                maxHeight: "100px",
                overflowY: "auto",
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}>
              <Typography variant="body1">
                {selectedAssignment.asset.specification}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Assigned To:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <Typography variant="body1">
              {selectedAssignment.assignedTo.userName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Assigned By:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <Typography variant="body1">
              {selectedAssignment.assignedBy.userName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Assigned Date:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <Typography variant="body1">
              {formatDate(selectedAssignment.assignedDate)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>State:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <Typography variant="body1">
              {assignmentStateEnum[selectedAssignment.state]}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Note:</strong>
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}>
            <div
              style={{
                maxHeight: "100px",
                overflowY: "auto",
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}>
              <Typography variant="body1">{selectedAssignment.note}</Typography>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDetailDialog;
