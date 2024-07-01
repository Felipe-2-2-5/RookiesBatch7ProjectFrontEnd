import {
  ArrowDropDown,
  ArrowDropUp,
  RestartAltRounded,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { Sheet } from "@mui/joy";
import {
  Box,
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
import React, { useEffect, useRef, useState } from "react";
import { AssignmentDetailDialog } from "../../components";
import { assignmentStateEnum } from "../../enum/assignmentStateEnum";
import {
  GetAssignment,
  GetMyAssignments,
} from "../../services/assignments.service";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const tableHead = {
  width: "14%",
  paddingLeft: "45px",
};

const buttonTableHead = {
  fontWeight: "bold",
  textTransform: "none",
  padding: 0,
  minWidth: "auto",
  color: "black",
};
const MyAssignmentPage = () => {
  const scrollRef = useRef(null);
  //const [totalCount, setTotalCount] = useState();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRequest, setFilterRequest] = useState({
    searchTerm: "",
    sortColumn: "date",
    sortOrder: "descend",
    page: 1,
    pageSize: "20",
    state: "",
    fromDate: "",
    toDate: "",
  });

  //const pageSize = filterRequest.pageSize || 1;
  // const pageCount =
  //   Number.isNaN(totalCount) || totalCount === 0
  //     ? 1
  //     : Math.ceil(totalCount / pageSize);

  const getAssignments = async (filterRequest) => {
    const res = await GetMyAssignments(filterRequest);
    // setLoading(true);
    let fetchedMyAssignments = res?.data;

    if (res.status === 200) {
      setAssignments(fetchedMyAssignments?.data);
      //setTotalCount(fetchedMyAssignments?.totalCount);
    } else {
      setAssignments([]);
      //setTotalCount(0);
    }

    if (
      filterRequest.sortOrder !== "" &&
      filterRequest.sortOrder !== undefined
    ) {
      const sortColumnMap = {
        code: "assetCode",
        name: "assetName",
        date: "assignedDate",
        state: "state",
      };

      const sortColumn = sortColumnMap[filterRequest.sortColumn];

      let fetchedAssignmentsArray = Array.isArray(res?.data?.data)
        ? res?.data?.data
        : [];

      fetchedAssignmentsArray.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
          return filterRequest.sortOrder.toLowerCase() === "descend" ? 1 : -1;
        }
        if (a[sortColumn] > b[sortColumn]) {
          return filterRequest.sortOrder.toLowerCase() === "descend" ? -1 : 1;
        }
        return 0;
      });
      //assignment Created
      const assignmentCreated = JSON.parse(
        sessionStorage.getItem("assignment_created")
      );
      if (assignmentCreated) {
        const updatedAssignments = fetchedMyAssignments.filter(
          (asset) => asset.id !== assignmentCreated.id
        );
        setAssignments([assignmentCreated, ...updatedAssignments]);
        sessionStorage.removeItem("assignment_created");
      } else {
        setAssignments(fetchedMyAssignments);
      }

      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      setLoading(false);
    }

    //setTotalCount(res?.data?.totalCount);
  };

  useEffect(() => {
    getAssignments(filterRequest);
  }, [filterRequest]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleDetailDialog = async (assignment) => {
    const res = await GetAssignment(assignment.id);
    setSelectedAssignment(res);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAssignment(null);
  };

  // const handlePageChange = (e, value) => {
  //   setFilterRequest((prev) => ({
  //     ...prev,
  //     page: value,
  //   }));
  // };

  const handleHeaderClick = (column) => {
    setFilterRequest((prev) => {
      let newSortOrder;
      let newSortColumn;

      if (column === prev.sortColumn) {
        if (prev.sortOrder === "descend") {
          newSortOrder = "ascend";
          newSortColumn = column;
        } else if (prev.sortOrder === "ascend") {
          newSortOrder = "descend";
          newSortColumn = "date";
        } else {
          newSortOrder = "descend";
          newSortColumn = column;
        }
      } else {
        newSortOrder = "descend";
        newSortColumn = column;
      }

      return {
        ...prev,
        sortColumn: newSortColumn,
        sortOrder: newSortOrder,
        page: 1,
      };
    });
  };

  const CustomArrowDropUp = styled(ArrowDropUp)(({ theme }) => ({
    "& path": {
      d: 'path("m7 20 5-5 5 5z")',
    },
  }));

  const CustomArrowDropDown = styled(ArrowDropDown)(({ theme }) => ({
    "& path": {
      d: 'path("m7 0 5 5 5-5z")',
    },
  }));

  const getSortIcon = (column) => {
    const iconStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    };

    if (filterRequest.sortColumn === column) {
      if (filterRequest.sortOrder === "descend") {
        return (
          <div style={iconStyle}>
            <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
            <CustomArrowDropDown />
          </div>
        );
      }
      if (filterRequest.sortOrder === "ascend") {
        return (
          <div style={iconStyle}>
            <CustomArrowDropUp />
            <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
          </div>
        );
      }
    } else {
      return (
        <div style={iconStyle}>
          <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
          <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
        </div>
      );
    }
  };
  return (
    <>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          width: "100%",
          height: "calc(100vh - 150px)",
        }}>
        <h2 style={{ color: "#D6001C", height: "35px", marginTop: "0px" }}>
          My Assignments
        </h2>
        <Box
          sx={{ display: "flex", alignItems: "center", padding: "40px" }}></Box>
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
                  <TableCell sx={tableHead}></TableCell>
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
                      assignments.map((assignment) => (
                        <CustomTableRow
                          key={assignment.id}
                          onClick={() => handleDetailDialog(assignment)}>
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
                            {formatDate(assignment.assignedDate)}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {assignmentStateEnum[assignment.state]}
                          </TableCell>
                          <TableCell>
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
                              <DoneIcon />
                            </IconButton>
                            <IconButton
                              disabled={assignment.state === 0}
                              sx={{
                                color: "black",
                                "&:hover": {
                                  backgroundColor: "#bcbcbc",
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}>
                              <CloseIcon />
                            </IconButton>
                            <IconButton
                              disabled={assignment.state === 1}
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
        {/* <PaginationBar
          filterRequest={filterRequest}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        /> */}
      </Paper>
      {selectedAssignment && (
        <AssignmentDetailDialog
          selectedAssignment={selectedAssignment}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
        />
      )}
    </>
  );
};

export default MyAssignmentPage;
