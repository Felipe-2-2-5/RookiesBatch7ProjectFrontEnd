import { Dialog, DialogTitle, IconButton, DialogContent, Grid, Typography, DialogActions, Button } from '@mui/material';
import { DisabledByDefaultTwoTone } from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';
import { assignmentStateEnum } from '../../enum/assignmentStateEnum';

const AssignmentDialog = ({
  dialogOpen,
  handleDialogClose,
  selectedAssignment,
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth={true}>
      <DialogTitle
        sx={{ bgcolor: "grey.300", color: "#D6001C", fontWeight: "bold" }}>
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
          <DisabledByDefaultTwoTone />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
                {selectedAssignment.specification}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={4}>
            <Typography variant="body1">
              <strong>Assigned to:</strong>
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
              <strong>Assigned by:</strong>
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
      <DialogActions>
        <Button
          onClick={handleDialogClose}
          sx={{ color: "#D6001C" }}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentDialog;