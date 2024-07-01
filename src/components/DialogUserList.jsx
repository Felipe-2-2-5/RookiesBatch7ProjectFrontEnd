import { ArrowDropDown, ArrowDropUp, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Radio,
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FilterRequest } from "../services/users.service";

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const tableHeadStyle = {
  width: "15%",
  textAlign: "center",
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

const DialogUserList = ({ onSelect, visibleDialog, setVisibleDialog, firstUser, selectedUser, setSelectedUser }) => {
  const scrollRef = useRef(null);
  const [chosenUser, setChosenUser] = useState(selectedUser);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterRequest, setFilterRequest] = useState({
    searchTerm: "",
    sortColumn: "name",
    sortOrder: "",
    page: 1,
    pageSize: "20",
    type: "",
  });
  const [users, setUsers] = useState([]);
  const pageSize = filterRequest.pageSize || 1;
  const pageCount =
    Number.isNaN(totalCount) || totalCount === 0
      ? 1
      : Math.ceil(totalCount / pageSize);
  const [searchTerm, setSearchTerm] = useState("");

  const getUsers = useCallback(async (filterRequest) => {
    setLoading(true);
    const res = await FilterRequest(filterRequest);
    const fetchedUsers = res.data.data;
    setTotalCount(res.data.totalCount);
    console.log(firstUser);
    if (firstUser) {
      if (fetchedUsers.some(user => user.id === firstUser.id)) {
        // Filter fetchedUsers to exclude selectedUser
        const filteredUsers = fetchedUsers.filter(user => user.id !== firstUser.id);
        setUsers([firstUser, ...filteredUsers]);
      } else {
        setUsers([firstUser, ...fetchedUsers]);
      }
    } else {
      setUsers([...fetchedUsers])
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setLoading(false);
  }, [firstUser]);
  useEffect(() => {
    getUsers(filterRequest);
  }, [filterRequest, getUsers]);

  const trimmedSearchTerm = searchTerm.trim().replace(/\s+/g, " ");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setFilterRequest((prev) => ({
      ...prev,
      searchTerm: trimmedSearchTerm,
      page: 1
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

  const handleSelectUser = (user) => {
    setChosenUser(user)
    // setSelectedUser(user);
  };

  const handleSave = () => {
    onSelect(chosenUser);
    setVisibleDialog(false);
  };

  const handleCancel = () => {
    // setSelectedUser(null)
    setVisibleDialog(false);
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

  const getSortIcon = (column) => {
    if (filterRequest.sortColumn === column) {
      if (filterRequest.sortOrder === "descend") {
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
            <CustomArrowDropDown />
          </div>
        );
      }
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <CustomArrowDropUp />
          <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
        <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
      </div>
    );
  };

  return (
    <Dialog
      open={visibleDialog}
      PaperProps={{
        style: {
          maxHeight: "70vh",
          margin: "auto",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }}
    >
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: "#d32f2f",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Select User
          </Typography>
          <TextField
            variant="outlined"
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{
                    "& label.Mui-focused": { color: "#000" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#000" },
                    },
                  }} onClick={handleSearchClick}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              width: "300px", "& .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-outlined.Mui-focused":
              {
                color: "black",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "black",
              },
            }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Box ref={scrollRef} sx={{ overflow: "auto", height: "calc(70vh - 240px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5%", padding: "0px" }}></TableCell>
                  <TableCell sx={tableHeadStyle}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("code")}
                      endIcon={getSortIcon("code")}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: 0,
                        minWidth: "15%",
                        color: "black",
                      }}
                    >
                      Staff Code
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHeadStyle}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("name")}
                      endIcon={getSortIcon("name")}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: 0,
                        minWidth: "15%",
                        color: "black",
                      }}
                    >
                      Full Name
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHeadStyle}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("type")}
                      endIcon={getSortIcon("type")}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: 0,
                        minWidth: "15%",
                        color: "black",
                      }}
                    >
                      Type
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4} align="center"
                      sx={{
                        color: "red",
                        textAlign: "center",
                        padding: "28px",
                        fontWeight: "bold",
                      }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    // <CustomTableRow key={index} onClick={() => handleSelectUser(user)}>
                    <CustomTableRow
                      key={index}
                      onClick={() => handleSelectUser(user)}
                      sx={{
                        backgroundColor: firstUser && index === 0 ? "#f0f0f0" : "inherit", // Highlight background for the first user in the list
                      }}
                    >
                      <TableCell>
                        <Radio
                          sx={{
                            color: "#000",
                            "&.Mui-checked": { color: "#d32f2f" },
                          }}
                          checked={chosenUser?.staffCode === user.staffCode}
                          onChange={() => handleSelectUser(user)}
                          value={user.staffCode}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{user.staffCode}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {user.firstName + " " + user.lastName}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{user.type === 0 ? "Staff" : "Admin"}</TableCell>
                    </CustomTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
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
      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          padding: "16px",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!chosenUser}
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#a50000",
            },
          }}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={handleCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUserList;