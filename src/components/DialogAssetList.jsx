// import React, { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Typography,
//   TextField,
//   IconButton,
//   InputAdornment,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   CircularProgress,
//   Radio,
//   Pagination,
//   styled,
// } from "@mui/material";
// import { Search, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
// import { useNavigate } from "react-router";
// import { FilterRequest } from "../services/users.service";

// const CustomTableRow = styled(TableRow)(({ theme }) => ({
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//     cursor: "pointer",
//   },
// }));

// const tableHeadStyle = {
//   width: "15%",
//   textAlign: "center",
// };

// const CustomArrowDropUp = styled(ArrowDropUp)(({ theme }) => ({
//   "& path": {
//     d: 'path("m7 20 5-5 5 5z")',
//   },
// }));

// const CustomArrowDropDown = styled(ArrowDropDown)(({ theme }) => ({
//   "& path": {
//     d: 'path("m7 0 5 5 5-5z")',
//   },
// }));

// const DialogAssetList = ({ onSelect, visibleDialog, setVisibleDialog }) => {
//   const navigate = useNavigate();
//   const scrollRef = useRef(null);
//   const [totalCount, setTotalCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [filterRequest, setFilterRequest] = useState({
//     searchTerm: "",
//     sortColumn: "name",
//     sortOrder: "",
//     page: 1,
//     pageSize: "20",
//     type: "",
//   });
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const pageSize = filterRequest.pageSize || 1;
//   const pageCount =
//     Number.isNaN(totalCount) || totalCount === 0
//       ? 1
//       : Math.ceil(totalCount / pageSize);
//   const [searchTerm, setSearchTerm] = useState("");

//   const getUsers = async (filterRequest) => {
//     setLoading(true);
//     const res = await FilterRequest(filterRequest);
//     const fetchedUsers = res.data.data;
//     setTotalCount(res.data.totalCount);

//     const userCreated = JSON.parse(sessionStorage.getItem("user_created"));
//     if (userCreated) {
//       setUsers([userCreated, ...fetchedUsers]);
//       sessionStorage.removeItem("user_created");
//     } else {
//       setUsers(fetchedUsers);
//     }
//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     getUsers(filterRequest);
//   }, [filterRequest]);

//   const trimmedSearchTerm = searchTerm.trim().replace(/\s+/g, " ");

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleSearch = () => {
//     setFilterRequest((prev) => ({
//       ...prev,
//       searchTerm: trimmedSearchTerm,
//     }));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const handleSearchClick = () => {
//     handleSearch();
//   };

//   const handleSelectUser = (user) => {
//     setSelectedUser(user);
//   };

//   const handleSave = () => {
//     if (selectedUser) {
//       onSelect(selectedUser);
//       setVisibleDialog(false);
//     }
//   };

//   const handleCancel = () => {
//     setVisibleDialog(false);
//   };

//   const handlePageChange = (e, value) => {
//     setFilterRequest((prev) => ({
//       ...prev,
//       page: value,
//     }));
//   };

//   const handleHeaderClick = (column) => {
//     setFilterRequest((prev) => {
//       let newSortOrder = prev.sortOrder;
//       if (column === prev.sortColumn) {
//         if (prev.sortOrder === "") {
//           newSortOrder = "descend";
//         } else if (prev.sortOrder === "descend") {
//           newSortOrder = "";
//         }
//       } else {
//         newSortOrder = "";
//       }
//       return {
//         ...prev,
//         sortColumn: column,
//         sortOrder: newSortOrder,
//       };
//     });
//   };

//   const getSortIcon = (column) => {
//     if (filterRequest.sortColumn === column) {
//       if (filterRequest.sortOrder === "descend") {
//         return (
//           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//             <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
//             <CustomArrowDropDown />
//           </div>
//         );
//       }
//       return (
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//           <CustomArrowDropUp />
//           <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
//         </div>
//       );
//     }
//     return (
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//         <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
//         <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
//       </div>
//     );
//   };

//   return (
//     <Dialog open={visibleDialog} fullWidth maxWidth="md">
//       <Paper elevation={3} style={{ padding: "20px" }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
//           <Typography variant="h6" sx={{ color: "#D6001C" }}>
//             Select a User
//           </Typography>
//           <TextField
//             variant="outlined"
//             label="Search"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onKeyPress={handleKeyPress}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleSearchClick}>
//                     <Search />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ width: "300px" }}
//           />
//         </Box>
//         <TableContainer component={Paper}>
//           <Box ref={scrollRef} sx={{ overflow: "auto", height: "400px" }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={tableHeadStyle}></TableCell>
//                   <TableCell sx={tableHeadStyle}>
//                     <Button
//                       variant="text"
//                       onClick={() => handleHeaderClick("code")}
//                       endIcon={getSortIcon("code")}
//                       sx={{
//                         fontWeight: "bold",
//                         textTransform: "none",
//                         padding: 0,
//                         minWidth: "auto",
//                         color: "black",
//                       }}
//                     >
//                       Staff Code
//                     </Button>
//                   </TableCell>
//                   <TableCell sx={tableHeadStyle}>
//                     <Button
//                       variant="text"
//                       onClick={() => handleHeaderClick("name")}
//                       endIcon={getSortIcon("name")}
//                       sx={{
//                         fontWeight: "bold",
//                         textTransform: "none",
//                         padding: 0,
//                         minWidth: "auto",
//                         color: "black",
//                       }}
//                     >
//                       Full Name
//                     </Button>
//                   </TableCell>
//                   <TableCell sx={tableHeadStyle}>
//                     <Button
//                       variant="text"
//                       onClick={() => handleHeaderClick("type")}
//                       endIcon={getSortIcon("type")}
//                       sx={{
//                         fontWeight: "bold",
//                         textTransform: "none",
//                         padding: 0,
//                         minWidth: "auto",
//                         color: "black",
//                       }}
//                     >
//                       Type
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={4} align="center">
//                       <CircularProgress />
//                     </TableCell>
//                   </TableRow>
//                 ) : users.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={4} align="center">
//                       No users found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   users.map((user, index) => (
//                     <CustomTableRow key={index} onClick={() => handleSelectUser(user)}>
//                       <TableCell>
//                         <Radio
//                           checked={selectedUser?.staffCode === user.staffCode}
//                           onChange={() => handleSelectUser(user)}
//                           value={user.staffCode}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ textAlign: "center" }}>{user.staffCode}</TableCell>
//                       <TableCell sx={{ textAlign: "center" }}>{user.userName}</TableCell>
//                       <TableCell sx={{ textAlign: "center" }}>{user.type === 0 ? "Staff" : "Admin"}</TableCell>
//                     </CustomTableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </Box>
//         </TableContainer>
//         <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
//           <Pagination
//             count={pageCount}
//             variant="outlined"
//             shape="rounded"
//             page={filterRequest.page}
//             onChange={handlePageChange}
//             sx={{
//               "& .MuiPaginationItem-root": {
//                 color: "#D6001C",
//               },
//               "& .Mui-selected": {
//                 backgroundColor: "#D6001C !important",
//                 color: "white",
//               },
//             }}
//           />
//         </Box>
//       </Paper>
//       <DialogActions>
//         <Button
//           variant="contained"
//           onClick={handleSave}
//           sx={{
//             backgroundColor: "#d32f2f",
//             "&:hover": {
//               backgroundColor: "#a50000",
//             },
//           }}
//           disabled={!selectedUser}
//         >
//           Save
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={handleCancel}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DialogAssetList;
