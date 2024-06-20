import {
  CancelTwoTone,
  CreateTwoTone,
  RestartAltRounded,
} from "@mui/icons-material";
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
  styled,
} from "@mui/material";
import { useRef, useState } from "react";
import { assignmentStateEnum } from "../../enum/assignmentStateEnum";
import { formatDate } from "../../utils/dateUtils";
import getSortIcon from "../../utils/sortUtils";

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const tableHead = {
  width: "15%",
  textAlign: "center",
};
const AssignmentTable = ({
  assignments,
  handleDetailDialog,
  handleHeaderClick,
  filterRequest,
  CustomArrowDropDown,
  CustomArrowDropUp,
}) => {
  const scrollRef = useRef(null);
  const [loading] = useState(false);
  // const sortIcon = getSortIcon(
  //   filterRequest,
  //   CustomArrowDropUp,
  //   CustomArrowDropDown
  // );

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
              <TableCell sx={tableHead}>No.</TableCell>
              <TableCell sx={tableHead}>
                <Button
                  variant="text"
                  onClick={() => handleHeaderClick("code")}
                  endIcon={getSortIcon("code")}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                    color: "black",
                  }}>
                  Asset Code
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  variant="text"
                  onClick={() => handleHeaderClick("name")}
                  endIcon={getSortIcon("name")}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                    color: "black",
                  }}>
                  Asset Name
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  variant="text"
                  onClick={() => handleHeaderClick("receiver")}
                  endIcon={getSortIcon("receiver")}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                    color: "black",
                  }}>
                  Assigned To
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  variant="text"
                  onClick={() => handleHeaderClick("provider")}
                  endIcon={getSortIcon("provider")}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                    color: "black",
                  }}>
                  Assigned By
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  variant="text"
                  onClick={() => handleHeaderClick("date")}
                  endIcon={getSortIcon("date")}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                    color: "black",
                  }}>
                  Assigned Date
                </Button>
              </TableCell>
              <TableCell sx={tableHead}>
                <Button
                  variant="text"
                  onClick={() => handleHeaderClick("state")}
                  endIcon={getSortIcon("state")}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: 0,
                    minWidth: "auto",
                    color: "black",
                  }}>
                  State
                </Button>
              </TableCell>
              <TableCell sx={tableHead}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ textAlign: "center", padding: "28px" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                      <TableCell sx={{ textAlign: "center" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {assignment.asset.assetCode}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 150,
                        }}>
                        {assignment.asset.assetName}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {assignment.assignedTo.userName}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {assignment.assignedBy.userName}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {formatDate(assignment.assignedDate)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {assignmentStateEnum[assignment.state]}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          disabled={assignment.state === 0}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#bcbcbc",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                          <CreateTwoTone />
                        </IconButton>
                        <IconButton
                          disabled={assignment.state === 0}
                          sx={{
                            color: "#D6001C",
                            "&:hover": {
                              backgroundColor: "#bcbcbc",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                          <CancelTwoTone />
                        </IconButton>
                        <IconButton
                          sx={{
                            color: "blue",
                            "&:hover": {
                              backgroundColor: "#bcbcbc",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
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
