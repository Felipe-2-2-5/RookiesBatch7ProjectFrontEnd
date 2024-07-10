import {
  ArrowDropDown,
  ArrowDropUp,
  FilterAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  AssignmentTable,
  ConfirmationPopup,
  NotificationPopup,
  PaginationBar,
  SearchBar,
} from "../../components";
import { path } from "../../routes/routeContants";
import {
  DeleteAssignment,
  FilterAssignment,
  GetAssignment,
} from "../../services/assignments.service";
import { CreateReturnRequest } from "../../services/requestsForReturning.service";

const ManageAssignmentPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [totalCount, setTotalCount] = useState();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setNotiMessage("<b>Return request</b> has been <b>created</b> successfully.");
    } catch (error) {
      if (error) {
        setNotiTitle("Error");
        setNotiMessage(error.UserMessage);
        setNoti(true);
      }
    }
  };
  const handleDeleteRequest = async () => {
    try {
      await DeleteAssignment(selectedAssignment.id);
      getAssignments(filterRequest);
      setOpenDeleteConfirmationPopup(false);
      setNoti(true);
      setNotiTitle("Notifications");
      setNotiMessage(`<b>Assignment</b> has been <b>deleted</b> successfully.`);
    } catch (error) {
      if (error) {
        setNotiTitle("Error");
        setNotiMessage(error.UserMessage);
        setNoti(true);
      }
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
              slotProps={{
                field: { clearable: true },
              }}
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
                  // getAssignments(filterRequest);
                }
              }}
              clearable
              sx={{
                width: 240,
                marginLeft: "16px",
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
                    width: 240,
                    marginLeft: "16px",
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
        <AssignmentTable
          assignments={assignments}
          loading={loading}
          handleDetailDialog={handleDetailDialog}
          navigate={navigate}
          path={path}
          setOpenDeleteConfirmationPopup={setOpenDeleteConfirmationPopup}
          setSelectedAssignment={setSelectedAssignment}
          setOpenReturnPopup={setOpenReturnPopup}
          filterRequest={filterRequest}
          getSortIcon={getSortIcon}
          scrollRef={scrollRef}
          handleHeaderClick={handleHeaderClick}
        />
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
      <ConfirmationPopup
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
