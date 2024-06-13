// pages/ManageUserPage.js
import { ArrowDownward, ArrowUpward, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Sheet } from "@mui/joy";
import { useNavigate } from "react-router";
import axios from "axios";

const ManageUserPage = () => {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState();
  const [filterRequest, setFilterRequest] = useState({
    searchTerm: "",
    sortColumn: "",
    sortOrder: "",
    page: 1,
    pageSize: "20",
  });
  const [users, setUser] = useState([]);
  const getUsers = async (filterRequest) => {
    const res = await axios.post("https://localhost:7083/api/users/filter", {
      searchTerm: filterRequest.searchTerm,
      sortColumn: filterRequest.sortColumn,
      sortOrder: filterRequest.sortOrder,
      page: filterRequest.page,
      pageSize: filterRequest.pageSize,
    });
    setUser(res.data.data);
    setTotalCount(res.data.totalCount);
  };
  useEffect(() => {
    getUsers(filterRequest);
  }, [filterRequest]);

  const [type, setType] = useState("All");

  const handleSearchChange = (e) => {
    setFilterRequest((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  console.log("filter", filterRequest);
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const handlePageChange = (e, value) => {
    setFilterRequest((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const handleHeaderClick = (e) => {
    setFilterRequest((prev) => {
      let newSortOrder;
      if (prev.sortColumn === e) {
        // Toggle the sort order
        newSortOrder =
          prev.sortOrder === "descend"
            ? "asc"
            : prev.sortOrder === "asc"
            ? ""
            : "descend";
      } else {
        // Set to descending if switching columns
        newSortOrder = "";
      }
      return {
        ...prev,
        sortColumn: e,
        sortOrder: newSortOrder,
      };
    });
  };

  const getSortIcon = (column) => {
    if (filterRequest.sortColumn === column) {
      switch (filterRequest.sortOrder) {
        case "descend":
          return <ArrowDownward />;
        case "asc":
          return <ArrowUpward />;
        default:
          return null;
      }
    }
    return null;
  };
  return (
    <Layout title=" -> Manage User">
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
            <Select
              label="Type"
              value={type}
              name="type"
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
            value={filterRequest.searchTerm}
            name="search"
            onChange={handleSearchChange}
            sx={{ marginLeft: "auto", marginRight: "20px" }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#D6001C", height: "56px" }}
            onClick={() => navigate("/create-user")}
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
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("staffCode")}
                      endIcon={getSortIcon("staffCode")}
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
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("fullName")}
                      endIcon={getSortIcon("fullName")}
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
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("username")}
                      endIcon={getSortIcon("username")}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: 0,
                        minWidth: "auto",
                        color: "black",
                      }}
                    >
                      Username
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("joinedDate")}
                      endIcon={getSortIcon("joinedDate")}
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
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("")}
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
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("action")}
                      endIcon={getSortIcon("action")}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: 0,
                        minWidth: "auto",
                        color: "black",
                      }}
                    >
                      Actions
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.staffCode}</TableCell>
                    <TableCell>
                      {user.firstName + " " + user.lastName}
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.joinedDate}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
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
                color: "red",
              },
              "& .Mui-selected": {
                backgroundColor: "#D6001C",
                color: "white",
              },
            }}
          />
        </Box>
      </Paper>
    </Layout>
  );
};

export default ManageUserPage;
