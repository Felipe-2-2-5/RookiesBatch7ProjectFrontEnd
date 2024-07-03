import {
  ArrowDropDown,
  ArrowDropUp,
  CreateTwoTone,
  HighlightOff as DeleteIcon,
  FilterAltOutlined,
  RestartAltRounded,
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
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
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  AssignmentDetailDialog,
  PaginationBar,
  NotificationPopup,
  ComfirmationPopup,
  SearchBar,
} from "../../components";
import { assignmentStateEnum } from "../../enum/assignmentStateEnum";
import { path } from "../../routes/routeContants";
import {
  FilterAssignment,
  GetAssignment,
  DeleteAssignment,
} from "../../services/assignments.service";
import { CreateReturnRequest } from "../../services/requestsForReturning.service";
import ConfirmationPopup from "../../components/ComfirmationPopup";

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
  paddingLeft: "40px",
};

const buttonTableHead = {
  fontWeight: "bold",
  textTransform: "none",
  padding: 0,
  minWidth: "auto",
  color: "black",
};
const ManageAssignmentPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [totalCount, setTotalCount] = useState();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  //  Popup state
  const [openReturnPopup, setOpenReturnPopup] = useState(false);
  const [openNoti, setNoti] = useState(false);
  const [notiTitle, setNotiTitle] = useState("");
  const [notiMessage, setNotiMessage] = useState("");
  const [openDeleteConfirmationPopup, setOpenDeleteConfirmationPopup] =
    useState(false);

  const [filterRequest, setFilterRequest] = useState({
    searchTerm: "",
    sortColumn: "date",
    sortOrder: "descend",
    page: 1,
    pageSize: "20",
    state: "",
    assignedDate: "",
  });
  const [assignedDate, setAssignedDate] = useState(null);
  const [selectedState, setSelectedState] = useState("All");
  const [dateError, setDateError] = useState(false);

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

      if (filterRequest.assignedDate) {
        const assignedDate = new Date(filterRequest.assignedDate);
        assignedDate.setHours(0, 0, 0, 0);

        fetchedAssignments = fetchedAssignments.filter((assignment) => {
          const assignmentDate = new Date(assignment.assignedDate);
          return assignmentDate.getTime() === assignedDate.getTime();
        });
      }

      setAssignments(fetchedAssignments);
      setTotalCount(res.data.totalCount);
    } else {
      setAssignments([]);
      setTotalCount(0);
    }

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
        sessionStorage.getItem("assignment_created")
      );
      if (assignmentCreated) {
        const updatedAssignments = fetchedAssignments.filter(
          (asset) => asset.id !== assignmentCreated.id
        );
        setAssignments([assignmentCreated, ...updatedAssignments]);
        sessionStorage.removeItem("assignment_created");
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

    setTotalCount(res.data.totalCount);
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
      page: 1,
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
    setSelectedAssignment(res);
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
          newSortColumn = column;
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

  const handleCreateRequest = async () => {
    try {
      await CreateReturnRequest(selectedAssignment.id);
      getAssignments(filterRequest);
      setOpenReturnPopup(false);
      setNoti(true);
      setNotiTitle("Notifications");
      setNotiMessage("Return request has been created successfully!");
    } catch (e) {
      console.error("Failed to create return request", e);
      alert(e);
    }
  };
  const handleDeleteRequest = async () => {
    try {
      await DeleteAssignment(selectedAssignment.id);
      getAssignments(filterRequest);
      setOpenDeleteConfirmationPopup(false);
      setNoti(true);
      setNotiTitle("Notifications");
      setNotiMessage("Assignment has been deleted successfully!");
    } catch (e) {
      console.error("Failed to delete assignment", e);
      alert(e);
    }
  };
  const handlePopupClose = () => {
    setOpenReturnPopup(false);
    setOpenDeleteConfirmationPopup(false);
    setNoti(false);
  };

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
        }}
      >
        <h2 style={{ color: "#D6001C", height: "35px", marginTop: "0px" }}>
          Assignment List
        </h2>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
        >
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 240,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "black" },
                "&.Mui-focused fieldset": { borderColor: "black" },
              },
            }}
          >
            <InputLabel
              sx={{
                color: "black",
                "&.Mui-focused": {
                  color: "black",
                },
              }}
            >
              {" "}
              State
            </InputLabel>
            <Select
              label="State"
              value={selectedState}
              name="state"
              IconComponent={(props) => (
                <FilterAltOutlined {...props} style={{ transform: "none" }} />
              )}
              onChange={handleStateChange}
              sx={{ "& .MuiOutlinedInput-input": { color: "black" } }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Waiting for acceptance">
                Waiting for acceptance
              </MenuItem>
              <MenuItem value="Declined">Declined</MenuItem>
              <MenuItem value="Waiting for returning">
                Waiting for returning
              </MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Assigned Date"
              value={assignedDate}
              onChange={(newValue) => {
                if (newValue instanceof Date && !isNaN(newValue.getTime())) {
                  setAssignedDate(newValue);
                  setDateError(false);
                  setFilterRequest((prev) => ({
                    ...prev,
                    assignedDate: format(newValue, "dd/MM/yyyy"),
                  }));
                } else {
                  setAssignedDate(null);
                  setDateError(true);
                  setFilterRequest((prev) => ({
                    ...prev,
                    assignedDate: "",
                  }));
                  getAssignments(filterRequest);
                }
              }}
              clearable
              sx={{
                marginLeft: "16px",
                minWidth: 200,
                "& .MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                },
              }}
              renderInput={(props) => (
                <TextField
                  {...props}
                  margin="dense"
                  required
                  error={dateError}
                  helperText={dateError ? "Invalid date" : ""}
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  sx={{
                    marginLeft: "16px",
                    minWidth: 200,
                    "& .MuiInputLabel-root": {
                      color: "black",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              )}
              format="dd/MM/yyyy"
            />
          </LocalizationProvider>

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
              marginLeft: "16px",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
            onClick={() => navigate(path.assignmentCreate)}
          >
            Create new assignment
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ height: "calc(100% - 180px)", position: "relative" }}
        >
          <Sheet ref={scrollRef} sx={{ overflow: "auto", height: "100%" }}>
            <Table stickyHeader>
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", paddingLeft: "40px" }}>
                    No.
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("code")}
                      endIcon={getSortIcon("code")}
                    >
                      Asset Code
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("name")}
                      endIcon={getSortIcon("name")}
                    >
                      Asset Name
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("receiver")}
                      endIcon={getSortIcon("receiver")}
                    >
                      Assigned To
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("provider")}
                      endIcon={getSortIcon("provider")}
                    >
                      Assigned By
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("date")}
                      endIcon={getSortIcon("date")}
                      sx={buttonTableHead}
                    >
                      Assigned Date
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("state")}
                      endIcon={getSortIcon("state")}
                    >
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
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ textAlign: "center", padding: "28px" }}
                    >
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
                          }}
                        >
                          No assignment found
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignments.map((assignment, index) => (
                        <CustomTableRow
                          key={assignment.id}
                          onClick={() => handleDetailDialog(assignment)}
                        >
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
                            }}
                          >
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
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            <span
                              style={{
                                color:
                                  assignment.state === 0
                                    ? "green"
                                    : assignment.state === 1
                                      ? "#D6001C"
                                      : assignment.state === 2
                                        ? "#FFC700"
                                        : "blue",
                              }}>
                              {assignmentStateEnum[assignment.state]}
                            </span>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              disabled={
                                assignment.state === 0 || assignment.state === 1
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
                            >
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
                                setOpenDeleteConfirmationPopup(true);
                                setSelectedAssignment(assignment);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              disabled={
                                assignment.state === 1 ||
                                assignment.state === 2 ||
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
                            >
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
        <AssignmentDetailDialog
          selectedAssignment={selectedAssignment}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
        />
      )}
      <ComfirmationPopup
        open={openReturnPopup}
        title="Are you sure?"
        content="Do you want to create a returning request for this asset?"
        Okbutton="Yes"
        handleClose={handlePopupClose}
        handleConfirm={handleCreateRequest}
      />
      <NotificationPopup
        open={openNoti}
        title={notiTitle}
        content={notiMessage}
        handleClose={handlePopupClose}
      />
      <ConfirmationPopup
        open={openDeleteConfirmationPopup}
        title="Are you sure?"
        content="Do you want to delete this assignment?"
        confirmContent="Delete"
        closeContent="Cancel"
        handleConfirm={handleDeleteRequest}
        handleClose={handlePopupClose}
      />
    </>
  );
};

export default ManageAssignmentPage;
