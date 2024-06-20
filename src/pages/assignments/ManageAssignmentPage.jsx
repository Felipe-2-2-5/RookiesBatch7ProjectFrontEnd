import {
  ArrowDropDown,
  ArrowDropUp,
  CancelTwoTone,
  CreateTwoTone,
  DisabledByDefaultTwoTone,
  FilterAltOutlined,
  RestartAltRounded,
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { PaginationBar, SearchBar } from "../../components";
import { assignmentStateEnum } from "../../enum/assignmentStateEnum";
import { path } from "../../routes/routeContants";
import {
  FilterAssignment,
  GetAssignment,
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
  width: "15%",
  textAlign: "center",
};
const ManageAssignmentPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [totalCount, setTotalCount] = useState();
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
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedState, setSelectedState] = useState("All");

  const pageSize = filterRequest.pageSize || 1;
  const pageCount =
    Number.isNaN(totalCount) || totalCount === 0
      ? 1
      : Math.ceil(totalCount / pageSize);

  const getAssignments = async (filterRequest) => {
    const res = await FilterAssignment(filterRequest);
    let fetchedAssignments = res?.data?.data;

    if (res.status === 200) {
      let fetchedAssignments = res.data.data;

      if (filterRequest.state !== "" && filterRequest.state !== "All") {
        fetchedAssignments = fetchedAssignments.filter(
          (assignment) => assignment.state === filterRequest.state
        );
      }

      if (filterRequest.searchTerm !== "") {
        const searchTerm = filterRequest.searchTerm || "";
        fetchedAssignments = fetchedAssignments.filter(
          (assignment) =>
            assignment.asset.assetName.includes(searchTerm) ||
            assignment.asset.assetCode.includes(searchTerm) ||
            assignment.assignedTo.userName.includes(searchTerm)
        );
      }

      if (filterRequest.fromDate && filterRequest.toDate) {
        const fromDate = new Date(filterRequest.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(filterRequest.toDate);
        toDate.setHours(23, 59, 59, 999);

        fetchedAssignments = fetchedAssignments.filter((assignment) => {
          const assignmentDate = new Date(assignment.assignedDate);
          return assignmentDate >= fromDate && assignmentDate <= toDate;
        });
      }

      setAssignments(fetchedAssignments);
      setTotalCount(fetchedAssignments.length);
    } else {
      setAssignments([]);
      setTotalCount(0);
    }

    // if (filterRequest.state !== "" && filterRequest.state !== "All") {
    //   fetchedAssignments = fetchedAssignments.filter(
    //     (assignment) => assignment.state === filterRequest.state
    //   );
    //   setAssignments(fetchedAssignments);
    // }

    if (
      filterRequest.sortOrder !== "" &&
      filterRequest.sortOrder !== undefined
    ) {
      const sortColumnMap = {
        code: "assetCode",
        name: "assetName",
        receiver: "assignedTo",
        provider: "assignedBy",
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
        localStorage.getItem("assignmentCreated")
      );
      if (assignmentCreated) {
        setAssignments([assignmentCreated, ...fetchedAssignments]);
        sessionStorage.removeItem("assignmentCreated");
      } else {
        setAssignments(fetchedAssignments);
      }

      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      setLoading(false);
    }

    setTotalCount(fetchedAssignments.length);
  };

  useEffect(() => {
    getAssignments(filterRequest);
  }, [filterRequest]);

  //search term
  const [searchTerm, setSearchTerm] = useState("");
  const trimmedSearchTerm = searchTerm.trim().replace(/\s+/g, " ");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearch = () => {
    setFilterRequest((prev) => ({
      ...prev,
      searchTerm: trimmedSearchTerm,
    }));
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(trimmedSearchTerm);
      handleSearch();
    }
  };
  const handleSearchClick = () => {
    setSearchTerm(trimmedSearchTerm);
    handleSearch();
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleDetailDialog = async (assignment) => {
    const res = await GetAssignment(assignment.id);
    setSelectedAssignment(res.data);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAssignment(null);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setFilterRequest((prevState) => ({
      ...prevState,
      state: selectedState === "All" ? "" : selectedState,
      searchTerm: "",
      sortColumn: "date",
      sortOrder: "descend",
      page: 1,
    }));
  };
  const handlePageChange = (e, value) => {
    setFilterRequest((prev) => ({
      ...prev,
      page: value,
    }));
  };

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
          Assignment List
        </h2>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 240,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "black" },
                "&.Mui-focused fieldset": { borderColor: "black" },
              },
            }}>
            <InputLabel
              sx={{
                color: "black",
                "&.Mui-focused": {
                  color: "black",
                },
              }}>
              {" "}
              State
            </InputLabel>
            <Select
              label="State"
              value={selectedState}
              name="state"
              IconComponent={(props) => (
                <FilterAltOutlined
                  {...props}
                  style={{ transform: "none" }}
                />
              )}
              onChange={handleStateChange}
              sx={{ "& .MuiOutlinedInput-input": { color: "black" } }}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Waiting for acceptance">
                Waiting for acceptance
              </MenuItem>
            </Select>
          </FormControl>
          <Grid
            item
            xs={9}
            InputLabelProps={{
              style: { color: "black" },
            }}
            sx={{
              marginLeft: "20px",
              marginRight: "20px",
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "black",
                },
            }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                startText="Start date"
                endText="End date"
                value={dateRange}
                onChange={(newValue) => {
                  setDateRange(newValue);
                  if (newValue[0] && newValue[1]) {
                    setFilterRequest((prev) => ({
                      ...prev,
                      fromDate: format(newValue[0], "dd/MM/yyyy"),
                      toDate: format(newValue[1], "dd/MM/yyyy"),
                    }));
                  }
                }}
                renderInput={(startProps, endProps) => (
                  <TextField
                    {...startProps}
                    {...endProps}
                    margin="dense"
                    required
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                    sx={{
                      "& .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-outlined.Mui-focused":
                        {
                          color: "black",
                        },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "black",
                        },
                    }}
                  />
                )}
                format="dd/MM/yyyy"
              />
            </LocalizationProvider>
          </Grid>
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            handleKeyPress={handleKeyPress}
            handleSearchClick={handleSearchClick}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#D6001C",
              height: "56px",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
            onClick={() => navigate(path.assignmentCreate)}>
            Create new assignment
          </Button>
        </Box>{" "}
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
        <PaginationBar
          filterRequest={filterRequest}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </Paper>
      {selectedAssignment && (
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
                    {selectedAssignment.asset.specification}
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
                  <Typography variant="body1">
                    {selectedAssignment.note}
                  </Typography>
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
      )}
    </>
  );
};

export default ManageAssignmentPage;
