import { Sheet } from "@mui/joy";
import {
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled
} from "@mui/material";
import React from "react";

import {
  CreateTwoTone,
  HighlightOff as DeleteIcon,
  RestartAltRounded,
} from "@mui/icons-material";
import { assignmentStateEnum } from "../../enum/assignmentStateEnum";
import formatDate from "../../utils/formatDate";

const CustomTableRow = styled(TableRow)(({ theme }) => ({
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer",
    },
  }));
const tableHead = {
  width: "15%",
  paddingLeft: "40px",
};

const buttonTableHead = {
  fontWeight: "bold",
  textTransform: "none",
  padding: 0,
  minWidth: "auto",
  color: "black",
};

const stateStyles = {
  0: {  // Accepted
    color: "#4CAF50", // Green
  },
  1: {  // Declined
    color: "#D6001C", // Red
  },
  2: {  // Waiting for acceptance
    color: "#FFC107", // Yellow
  },
  3: {  // Waiting for returning
    color: "#1976D2", // Blue
  },
};

const AssignmentTable = ({
  assignments,
  loading,
  handleDetailDialog,
  navigate,
  path,
  setOpenDeleteConfirmationPopup,
  setSelectedAssignment,
  setOpenReturnPopup,
  filterRequest,
  getSortIcon,
  scrollRef,
  handleHeaderClick,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ height: "calc(100% - 180px)", position: "relative" }}>
      <Sheet
        ref={scrollRef}
        sx={{ overflow: "auto", height: "100%" }}>
        <Table stickyHeader>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", paddingLeft: "40px" }}>
                No.
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  sx={buttonTableHead}
                  variant="text"
                  onClick={() => handleHeaderClick("code")}
                  endIcon={getSortIcon("code")}>
                  Asset Code
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  sx={buttonTableHead}
                  variant="text"
                  onClick={() => handleHeaderClick("name")}
                  endIcon={getSortIcon("name")}>
                  Asset Name
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  sx={buttonTableHead}
                  variant="text"
                  onClick={() => handleHeaderClick("receiver")}
                  endIcon={getSortIcon("receiver")}>
                  Assigned To
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  sx={buttonTableHead}
                  variant="text"
                  onClick={() => handleHeaderClick("provider")}
                  endIcon={getSortIcon("provider")}>
                  Assigned By
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  variant="text"
                  onClick={() => handleHeaderClick("date")}
                  endIcon={getSortIcon("date")}
                  sx={buttonTableHead}>
                  Assigned Date
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  sx={buttonTableHead}
                  variant="text"
                  onClick={() => handleHeaderClick("state")}
                  endIcon={getSortIcon("state")}>
                  State
                </Button>
              </TableCell>
              <TableCell
                sx={{
                  width: "10%",
                  fontWeight: "bold",
                  textTransform: "none",
                  minWidth: "auto",
                  color: "black",
                  padding: "16px",
                }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{ textAlign: "center", padding: "28px" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{
                        color: "red",
                        textAlign: "center",
                        padding: "28px",
                        fontWeight: "bold",
                      }}>
                      No assignment found
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment, index) => (
                    <CustomTableRow
                      key={assignment.id}
                      onClick={() => handleDetailDialog(assignment)}>
                      <TableCell sx={{ paddingLeft: "40px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ paddingLeft: "40px" }}>
                        {assignment.asset.assetCode}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingLeft: "40px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 150,
                        }}>
                        {assignment.asset.assetName}
                      </TableCell>
                      <TableCell sx={{ paddingLeft: "40px" }}>
                        {assignment.assignedTo.userName}
                      </TableCell>
                      <TableCell sx={{ paddingLeft: "40px" }}>
                        {assignment.assignedBy.userName}
                      </TableCell>
                      <TableCell sx={{ paddingLeft: "40px" }}>
                        {formatDate(assignment.assignedDate)}
                      </TableCell>
                      <TableCell sx={{ color: stateStyles[assignment.state], paddingLeft: "40px" }}>
                          {assignmentStateEnum[assignment.state]}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          disabled={
                            assignment.state !== 2
                          }
                          sx={{
                            "&:hover": {
                              backgroundColor: "#bcbcbc",
                            },
                          }}
                          onClick={(e) => {
                            navigate(
                              `${path.assignmentEdit.replace(
                                ":id",
                                assignment.id
                              )}`
                            );
                            e.stopPropagation();
                          }}
                          title="Edit assignment">
                          <CreateTwoTone />
                        </IconButton>
                        <IconButton
                          disabled={
                            assignment.state !== 1 && assignment.state !== 2
                          }
                          sx={{
                            color: "#D6001C",
                            "&:hover": {
                              backgroundColor: "#bcbcbc",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDeleteConfirmationPopup(true);
                            setSelectedAssignment(assignment);
                          }}
                          title="Delete assignment">
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          disabled={
                            assignment.state !== 0 ||
                            assignment?.returnRequest != null
                          }
                          sx={{
                            color: "blue",
                            "&:hover": {
                              backgroundColor: "#bcbcbc",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenReturnPopup(true);
                            setSelectedAssignment(assignment);
                          }}
                          title="Create return request">
                          <RestartAltRounded />
                        </IconButton>
                      </TableCell>
                    </CustomTableRow>
                  ))
                )}
              </>
            )}
          </TableBody>
        </Table>
      </Sheet>
    </TableContainer>
  );
};

export default AssignmentTable;
