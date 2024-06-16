import {
  ArrowDropDown,
  ArrowDropUp,
  CancelTwoTone,
  CreateTwoTone,
  DisabledByDefaultTwoTone,
  Search,
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import {
  Box,
  Button,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { path } from "../../routes/routeContants";
import { GetUser, FilterRequest } from "../../services/users.service";
import { GenderEnum } from "../../enum/genderEnum";
//reformat code from 	2017-09-18T00:00:00 to 19/08/2017
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // en-GB format gives the desired "dd/mm/yyyy" format
};

// custom style background when hover user
const CustomTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const ManageUserPage = () => {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState();
  const [filterRequest, setFilterRequest] = useState({
    searchTerm: "",
    sortColumn: "name",
    sortOrder: "",
    page: 1,
    pageSize: "20",
    type: "",
  });

  const [users, setUser] = useState([]);
  const getUsers = async (filterRequest) => {
    const res = await FilterRequest(filterRequest);
    const fetchedUsers = res.data.data;
    setTotalCount(res.data.totalCount);

    const userCreated = JSON.parse(sessionStorage.getItem("user_created"));
    console.log(userCreated);
    console.log(fetchedUsers);
    if (userCreated) {
      setUser([userCreated, ...fetchedUsers]);
      sessionStorage.removeItem("user_created");
    } else {
      setUser(fetchedUsers);
    }
  };

  useEffect(() => {
    getUsers(filterRequest);
  }, [filterRequest]);

  //Search state to set in filter request after entered
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setFilterRequest((prev) => ({
        ...prev,
        searchTerm: searchTerm,
      }));
    }
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

  const handleTypeChange = (value) => {
    setFilterRequest((prevState) => ({
      ...prevState,
      type: prevState.type === value ? "" : value,
      searchTerm: "",
      sortColumn: "name",
      sortOrder: "",
      page: 1,
      pageSize: "20",
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

      if (column === "name") {
        if (prev.sortColumn === "name" && prev.sortOrder === "") {
          newSortOrder = "descend";
          newSortColumn = "name";
        } else if (prev.sortColumn === "name" && prev.sortOrder === "descend") {
          newSortOrder = "";
          newSortColumn = "name";
        } else {
          newSortOrder = "descend";
          newSortColumn = "name";
        }
      } else {
        if (prev.sortColumn === column) {
          if (prev.sortOrder === "descend") {
            newSortOrder = "";
            newSortColumn = column;
          } else if (prev.sortOrder === "") {
            newSortOrder = "";
            newSortColumn = "name";
          }
        } else {
          newSortOrder = "descend";
          newSortColumn = column;
        }
      }
      return {
        ...prev,
        sortColumn: newSortColumn,
        sortOrder: newSortOrder,
      };
    });
  };

  const getSortIcon = (column) => {
    if (filterRequest.sortColumn === column) {
      if (filterRequest.sortOrder === "descend") {
        return (
          <>
            {" "}
            <ArrowDropDown /> <ArrowDropUp sx={{ color: "#bdbdbd" }} />{" "}
          </>
        );
      }
      if (filterRequest.sortOrder === "") {
        return (
          <>
            {" "}
            <ArrowDropDown sx={{ color: "#bdbdbd" }} /> <ArrowDropUp />{" "}
          </>
        );
      }
    } else
      return (
        <>
          {" "}
          <ArrowDropDown sx={{ color: "#bdbdbd" }} />{" "}
          <ArrowDropUp sx={{ color: "#bdbdbd" }} />{" "}
        </>
      );
  };
  return (
    <>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginLeft: "100px",
          width: "1200px",
          height: "calc(100vh - 150px)",
        }}
      >
        <h3 style={{ color: "#D6001C" }}>User List</h3>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
        >
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select label="Type" value={filterRequest.type} name="type">
              <MenuItem
                value="Admin"
                onClick={() => handleTypeChange("Admin")}
                sx={{
                  backgroundColor:
                    filterRequest.type === "Admin" ? "gray" : "inherit",
                  "&:hover": {
                    backgroundColor: "lightgray",
                  },
                }}
              >
                Admin
              </MenuItem>
              <MenuItem
                value="Staff"
                onClick={() => handleTypeChange("Staff")}
                sx={{
                  backgroundColor:
                    filterRequest.type === "Staff" ? "gray" : "inherit",
                  "&:hover": {
                    backgroundColor: "lightgray",
                  },
                }}
              >
                Staff
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            label="Search"
            value={searchTerm}
            name="search"
            onChange={handleSearchChange}
            // onBlur={handleOnBlur}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
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
        <TableContainer component={Paper}>
          <Sheet sx={{ height: 565, overflow: "auto" }}>
            <Table>
              <TableHead
                sx={{
                  fontWeight: "bold",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "white",
                }}
              >
                <TableRow>
                  <TableCell sx={{ width: "150px" }}>
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
                  <TableCell sx={{ width: "150px" }}>
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
                      width: "150px",
                      fontWeight: "bold",
                      textTransform: "none",
                      minWidth: "auto",
                      color: "black",
                      padding: "16px",
                    }}
                  >
                    Username
                  </TableCell>
                  <TableCell sx={{ width: "150px" }}>
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
                  <TableCell sx={{ width: "150px" }}>
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
                      width: "150px",
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
                {users.length === 0 && (
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
                )}
                {users.map((user, index) => (
                  <CustomTableRow
                    key={index}
                    onClick={() => handleDetailDialog(user)}
                  >
                    <TableCell>{user.staffCode}</TableCell>
                    <TableCell>
                      {user.firstName + " " + user.lastName}
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{formatDate(user.joinedDate)}</TableCell>
                    <TableCell>{user.type === 0 ? "Staff" : "Admin"}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          //Prevent showing popup
                          e.stopPropagation();
                        }}
                      >
                        <CreateTwoTone />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#D6001C" }}
                        onClick={(e) => {
                          //Prevent showing popup
                          e.stopPropagation();
                        }}
                      >
                        <CancelTwoTone />
                      </IconButton>
                    </TableCell>
                  </CustomTableRow>
                ))}
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
            count={Math.ceil(totalCount / filterRequest.pageSize)}
            variant="outlined"
            shape="rounded"
            page={filterRequest.page}
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#D6001C",
              },
              "& .Mui-selected": {
                backgroundColor: "#D6001C",
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
                  {formatDate(selectedUser.dateOfBirth)}
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
