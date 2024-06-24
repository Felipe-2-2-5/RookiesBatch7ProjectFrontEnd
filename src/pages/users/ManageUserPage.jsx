import {
  ArrowDropDown,
  ArrowDropUp,
  CancelTwoTone,
  CreateTwoTone,
  DisabledByDefaultTwoTone,
  FilterAltOutlined,
  Search,
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { GenderEnum } from "../../enum/genderEnum";
import { path } from "../../routes/routeContants";
import { FilterRequest, GetUser } from "../../services/users.service";
// //reformat code from 	2017-09-18T00:00:00 to 19/08/2017
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-GB"); // en-GB format gives the desired "dd/mm/yyyy" format
// };

// custom style background when hover user
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

const ManageUserPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [totalCount, setTotalCount] = useState();
  const [loading, setLoading] = useState(true);
  const [filterRequest, setFilterRequest] = useState({
    searchTerm: "",
    sortColumn: "name",
    sortOrder: "",
    page: 1,
    pageSize: "20",
    type: "",
  });
  const pageSize = filterRequest.pageSize || 1;
  const pageCount =
    Number.isNaN(totalCount) || Number.isNaN(pageSize) || totalCount === 0
      ? 1
      : Math.ceil(totalCount / pageSize);
  const [users, setUser] = useState([]);
  const getUsers = async (filterRequest) => {
    const res = await FilterRequest(filterRequest);
    const fetchedUsers = res.data.data;
    setTotalCount(res.data.totalCount);

    const userCreated = JSON.parse(sessionStorage.getItem("user_created"));
    const userUpdated = JSON.parse(sessionStorage.getItem("user_updated"));
    if (userCreated) {
      const updatedUsers = fetchedUsers.filter(
        (asset) => asset.id !== userCreated.id
      );
      setUser([userCreated, ...updatedUsers]);
      sessionStorage.removeItem("user_created");
    } else if(userUpdated) {
      const updatedUsers = fetchedUsers.filter(
        (asset) => asset.id !== userCreated.id
      );
      setUser([userCreated, ...updatedUsers]);
      sessionStorage.removeItem("user_updated");
    }
      else {
      setUser(fetchedUsers);
    }
    //Scroll to top of list
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers(filterRequest);
  }, [filterRequest]);

  //Search state to set in filter request after entered
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
  const [selectedUser, setSelectedUser] = useState(null);
  const handleDetailDialog = async (user) => {
    const res = await GetUser(user.id);
    setSelectedUser(res.data);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setFilterRequest((prevState) => ({
      ...prevState,
      type: selectedType === "All" ? "" : selectedType,
      searchTerm: "",
      sortColumn: "name",
      sortOrder: "",
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
        if (prev.sortOrder === "") {
          newSortOrder = "descend";
          newSortColumn = column;
        } else if (prev.sortOrder === "descend") {
          newSortOrder = "";
          newSortColumn = "name";
        } else {
          newSortOrder = "";
          newSortColumn = column;
        }
      } else {
        newSortOrder = "";
        newSortColumn = column;
      }

      return {
        ...prev,
        sortColumn: newSortColumn,
        sortOrder: newSortOrder,
      };
    });
  };

  //custom Table head Arrow Up
  const CustomArrowDropUp = styled(ArrowDropUp)(({ theme }) => ({
    "& path": {
      d: 'path("m7 20 5-5 5 5z")',
    },
  }));
  //custom Table head Arrow Down
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
      if (filterRequest.sortOrder === "") {
        return (
          <div style={iconStyle}>
            <CustomArrowDropUp />
            <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
          </div>
        );
      }
    } else
      return (
        <div style={iconStyle}>
          <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
          <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
        </div>
      );
  };
  return (
    <>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          width: "90%",
          height: "calc(100vh - 150px)",
        }}
      >
        <h2 style={{ color: "#D6001C", height: "35px", marginTop: "0px" }}>
          User List
        </h2>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
        >
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={filterRequest.type === "" ? "All" : filterRequest.type}
              name="type"
              IconComponent={(props) => (
                <FilterAltOutlined {...props} style={{ transform: "none" }} />
              )}
              onChange={handleTypeChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            label="Search"
            value={searchTerm}
            name="search"
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            error={false}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      "&:hover": {
                        backgroundColor: "#bcbcbc",
                      },
                    }}
                    onClick={handleSearchClick}
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ marginLeft: "auto", marginRight: "20px" }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#D6001C", height: "56px" }}
            onClick={() => navigate(path.userCreate)}
          >
            Create new user
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
                      }}
                    >
                      Staff Code
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
                      }}
                    >
                      Full Name
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "none",
                      minWidth: "auto",
                      color: "black",
                      padding: "16px",
                    }}
                    style={tableHead}
                  >
                    Username
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
                      }}
                    >
                      Joined Date
                    </Button>
                  </TableCell>
                  <TableCell style={tableHead}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("type")}
                      endIcon={getSortIcon("type")}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: 0,
                        minWidth: "auto",
                        color: "black",
                      }}
                    >
                      Type
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
                      colSpan={6}
                      sx={{ textAlign: "center", padding: "28px" }}
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          sx={{
                            color: "red",
                            textAlign: "center",
                            padding: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          No user found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user, index) => (
                        <CustomTableRow
                          key={index}
                          onClick={() => handleDetailDialog(user)}
                        >
                          <TableCell sx={{ textAlign: "center" }}>
                            {user.staffCode}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {user.firstName + " " + user.lastName}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {user.userName}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {user.joinedDate}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {user.type === 0 ? "Staff" : "Admin"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#bcbcbc",
                                },
                              }}
                              onClick={(e) => {
                                // Prevent showing popup
                                navigate(`/manage-user/edit-user/${user.id}`);
                                e.stopPropagation();
                              }}
                            >
                              <CreateTwoTone />
                            </IconButton>
                            <IconButton
                              sx={{
                                color: "#D6001C",
                                "&:hover": {
                                  backgroundColor: "#bcbcbc",
                                },
                              }}
                              onClick={(e) => {
                                // Prevent showing popup
                                e.stopPropagation();
                              }}
                            >
                              <CancelTwoTone />
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "10px",
          }}
        >
          <Pagination
            count={pageCount}
            variant="outlined"
            shape="rounded"
            page={filterRequest.page}
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#D6001C",
              },
              "& .Mui-selected": {
                backgroundColor: "#D6001C !important",
                color: "white",
              },
            }}
          />
        </Box>
      </Paper>

      {/* Dialog show user detailed information */}
      {selectedUser && (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle
            sx={{ bgcolor: "grey.300", color: "#D6001C", fontWeight: "bold" }}
          >
            Detailed User Information
            <IconButton
              aria-label="close"
              onClick={handleDialogClose}
              sx={{
                position: "absolute",
                right: 10,
                top: 12,
                color: "#D6001C",
              }}
            >
              <DisabledByDefaultTwoTone />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Staff Code:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedUser.staffCode}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Full Name:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{`${selectedUser.firstName} ${selectedUser.lastName}`}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Username:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUser.userName}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Date of Birth:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedUser.dateOfBirth}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Gender:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {GenderEnum[selectedUser.gender]}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Type:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedUser.type === 0 ? "Staff" : "Admin"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Location:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {selectedUser.location === 0 ? "Ho Chi Minh" : "Ha Noi"}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} sx={{ color: "#D6001C" }}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ManageUserPage;
