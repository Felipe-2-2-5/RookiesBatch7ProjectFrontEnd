import {
  ArrowDropDown,
  ArrowDropUp,
  CreateTwoTone,
  HighlightOff as DeleteIcon,
  DisabledByDefault,
  FilterAltOutlined,
  Search,
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
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
import { NotificationPopup, ConfirmationPopup } from "../../components";
import { useAuthContext } from "../../context/AuthContext";
import { GenderEnum } from "../../enum/genderEnum";
import { path } from "../../routes/routeContants";
import {
  DisableUser,
  FilterRequest,
  GetUser,
} from "../../services/users.service";

// custom style background when hover user
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
const ManageUserPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
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
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [userToDisable, setUserToDisable] = useState(null);
  const [disableError, setDisableError] = useState(null);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [disableErrorPopupOpen, setDisableErrorPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const pageSize = filterRequest.pageSize || 1;
  const pageCount =
    Number.isNaN(totalCount) || Number.isNaN(pageSize) || totalCount === 0
      ? 1
      : Math.ceil(totalCount / pageSize);
  const [users, setUser] = useState([]);
  const getUsers = async (filterRequest) => {
    const res = await FilterRequest(filterRequest);
    const fetchedUsers = res?.data?.data;
    setTotalCount(res?.data?.totalCount);

    const userCreated = JSON.parse(sessionStorage.getItem("user_created"));
    if (userCreated) {
      const updatedUsers = fetchedUsers.filter(
        (asset) => asset.id !== userCreated.id
      );
      setUser([userCreated, ...updatedUsers]);
      sessionStorage.removeItem("user_created");
    } else {
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
          newSortColumn = column;
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
  const handleDisableUser = async () => {
    if (userToDisable) {
      try {
        await DisableUser(userToDisable.id);
        setDisableDialogOpen(false);
        setUserToDisable(null);
        getUsers(filterRequest);
        setDisableError(null); // clear any previous errors
        setSuccessPopupOpen(true); // open the success popup
        setPopupMessage(
          `User <b>${userToDisable.userName}</b> has been <b>disabled</b> successfully.`
        );
        // Send message to notify user disabled
      } catch (err) {
        setDisableError(err?.UserMessage);
        setDisableDialogOpen(false);
        setDisableErrorPopupOpen(true);
      }
    }
  };
  const handleDisableClick = (user, e) => {
    e.stopPropagation();
    setUserToDisable(user);
    setDisableDialogOpen(true);
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
          User List
        </h2>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <NotificationPopup
            open={successPopupOpen}
            handleClose={() => setSuccessPopupOpen(false)}
            title="Success"
            content={popupMessage}
          />
          <NotificationPopup
            open={disableErrorPopupOpen}
            handleClose={() => setDisableErrorPopupOpen(false)}
            title="Can not disable user"
            content={disableError}
          />
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
              Type
            </InputLabel>
            <Select
              label="Type"
              value={filterRequest.type === "" ? "All" : filterRequest.type}
              name="type"
              IconComponent={(props) => (
                <FilterAltOutlined
                  {...props}
                  style={{ transform: "none" }}
                />
              )}
              onChange={handleTypeChange}>
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
                      "& label.Mui-focused": { color: "#000" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#000" },
                      },
                      width: "120%",
                    }}
                    onClick={handleSearchClick}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              marginLeft: "auto",
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
            onClick={() => navigate(path.userCreate)}>
            Create new user
          </Button>
        </Box>
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
                      variant="text"
                      onClick={() => handleHeaderClick("code")}
                      endIcon={getSortIcon("code")}
                      sx={buttonTableHead}>
                      Staff Code
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("name")}
                      endIcon={getSortIcon("name")}
                      sx={buttonTableHead}>
                      Full Name
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={buttonTableHead}
                    style={tableHead}>
                    Username
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("date")}
                      endIcon={getSortIcon("date")}
                      sx={buttonTableHead}>
                      Joined Date
                    </Button>
                  </TableCell>
                  <TableCell style={tableHead}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("type")}
                      endIcon={getSortIcon("type")}
                      sx={buttonTableHead}>
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
                    }}></TableCell>
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
                    {users?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          sx={{
                            color: "red",
                            textAlign: "center",
                            padding: "28px",
                            fontWeight: "bold",
                          }}>
                          No user found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users?.map((user, index) => (
                        <CustomTableRow
                          key={index}
                          hover
                          onClick={() => handleDetailDialog(user)}>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {user.staffCode}
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingLeft: "40px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 150,
                            }}>
                            {user.firstName + " " + user.lastName}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {user.userName}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {user.joinedDate}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {user.type === 0 ? "Staff" : "Admin"}
                          </TableCell>
                          <TableCell>
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
                              disabled={user.id === currentUser.id}
                              title="Edit user">
                              <CreateTwoTone />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleDisableClick(user, e)}
                              disabled={user.id === currentUser.id}
                              sx={{
                                color: "#D6001C",
                                "&:hover": {
                                  backgroundColor: "#bcbcbc",
                                },
                              }}
                              title="Disable user">
                              <DeleteIcon />
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
          }}>
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
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}>
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
            Detailed User Information
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
              // maxHeight: "300px",
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
                  <strong>Staff Code:</strong>
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}>
                <Typography variant="body1">
                  {selectedUser.staffCode}
                </Typography>
              </Grid>

              <Grid
                item
                xs={4}>
                <Typography variant="body1">
                  <strong>Full Name:</strong>
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}>
                <Typography variant="body1">{`${selectedUser.firstName} ${selectedUser.lastName}`}</Typography>
              </Grid>

              <Grid
                item
                xs={4}>
                <Typography variant="body1">
                  <strong>Username:</strong>
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}>
                <Typography variant="body1">{selectedUser.userName}</Typography>
              </Grid>

              <Grid
                item
                xs={4}>
                <Typography variant="body1">
                  <strong>Date of Birth:</strong>
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}>
                <Typography variant="body1">
                  {selectedUser.dateOfBirth}
                </Typography>
              </Grid>

              <Grid
                item
                xs={4}>
                <Typography variant="body1">
                  <strong>Gender:</strong>
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}>
                <Typography variant="body1">
                  {GenderEnum[selectedUser.gender]}
                </Typography>
              </Grid>

              <Grid
                item
                xs={4}>
                <Typography variant="body1">
                  <strong>Type:</strong>
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}>
                <Typography variant="body1">
                  {selectedUser.type === 0 ? "Staff" : "Admin"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={4}>
                <Typography variant="body1">
                  <strong>Location:</strong>
                </Typography>
              </Grid>
              <Grid
                item
                xs={8}>
                <Typography variant="body1">
                  {selectedUser.location === 0 ? "Ho Chi Minh" : "Ha Noi"}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
      {/* Dialog to confirm disable user */}
      <ConfirmationPopup
        open={disableDialogOpen}
        handleClose={() => setDisableDialogOpen(false)}
        handleConfirm={handleDisableUser}
        title="Are you sure?"
        content={`Do you want to disable this user ${userToDisable?.userName}?`}
        closeContent="Cancel"
        confirmContent="Disable"
        Okbutton="Disable"
      />
    </>
  );
};

export default ManageUserPage;
