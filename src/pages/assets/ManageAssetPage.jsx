import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  MenuItem,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Pagination,
  styled,
} from "@mui/material";
import {
  Edit as EditIcon,
  HighlightOff as DeleteIcon,
  ArrowDropDown,
  ArrowDropUp,
  FilterAltOutlined as FilterIcon,
  Search as SearchIcon,
  DisabledByDefault as CloseIcon,
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { path } from "../../routes/routeContants";
import {
  FilterRequest,
  GetAsset,
  GetCategories,
  DeleteAsset,
} from "../../services/asset.service";
import { assetStateEnum } from "../../enum/assetStateEnum";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const ManageAssetPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const [filterRequest, setFilterRequest] = useState({
    state: "",
    category: "",
    searchTerm: "",
    sortColumn: "assetname",
    sortOrder: "",
    page: 1,
    pageSize: "20",
  });

  const [totalCount, setTotalCount] = useState();
  const pageSize = filterRequest.pageSize || 1;
  const pageCount =
    Number.isNaN(totalCount) || totalCount === 0
      ? 1
      : Math.ceil(totalCount / pageSize);

  const [assets, setAsset] = useState([]);
  const [categories, setCategories] = useState(null);
  // Fetch assets when component mounts
  useEffect(() => {
    const getAssets = async (filterRequest) => {
      const res = await FilterRequest(filterRequest);
      const fetchedAssets = res.data.data;
      setTotalCount(res.data.totalCount);

      const assetCreated = JSON.parse(sessionStorage.getItem("asset_created"));
      if (assetCreated) {
        const updatedAssets = fetchedAssets.filter(
          (asset) => asset.id !== assetCreated.id
        );
        setAsset([assetCreated, ...updatedAssets]);
        sessionStorage.removeItem("asset_created");
      } else {
        setAsset(fetchedAssets);
      }
      // Scroll to top of list
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      setLoading(false);
    };

    getAssets(filterRequest);
  }, [filterRequest]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Search state to set in filter request after entered
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

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleDetailDialog = async (asset) => {
    const res = await GetAsset(asset.id);
    const sortedAssignments = res.data.assignments.sort((a, b) => {
      return new Date(b.assignedDate) - new Date(a.assignedDate);
    });
    setSelectedAsset({ ...res.data, assignments: sortedAssignments });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAsset(null);
    setShowDeleteConfirmation(false); // Close delete confirmation dialog
    setShowNotification(false); // Close notification dialog
    setErrorDialog(false); // Close error dialog
    setErrorMessage(""); // Clear error message
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteIconClick = (asset) => {
    setSelectedAsset(asset);

    if (asset.assignments && asset.assignments.length > 0) {
      setShowNotification(true);
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  const handleDeleteConfirmation = async () => {
    if (selectedAsset) {
      try {
        const res = await DeleteAsset(selectedAsset.id);

        // Assuming res includes status and possibly other data
        if (res.status === 204) {
          // Handle deletion success (Refresh asset list)
          setFilterRequest((prev) => ({
            ...prev,
            page: 1,
          }));
          setShowDeleteConfirmation(false);
          // Optionally, show a success message
          console.log("Asset deleted successfully");
        } else {
          // Handle other cases based on status or message
          setErrorMessage(
            "Error deleting asset: " + res.status + " " + res.data
          ); // Set error message
          setErrorDialog(true); // Show error dialog
        }
      } catch (error) {
        // Handle deletion error (e.g., show an error message)
        setErrorMessage("Error deleting asset: " + error.message); // Set error message
        setErrorDialog(true); // Show error dialog
      } finally {
        setShowDeleteConfirmation(false);
      }
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFilterRequest((prevState) => ({
      ...prevState,
      state: selectedState === "All" ? "All" : selectedState,
      searchTerm: "",
      sortColumn: "assetname",
      sortOrder: "",
      page: 1,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFilterRequest((prevState) => ({
      ...prevState,
      category: selectedCategory === "All" ? "" : selectedCategory,
      searchTerm: "",
      sortColumn: "assetname",
      sortOrder: "",
      page: 1,
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
          newSortColumn = "assetname";
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

  // Custom Arrow Up
  const CustomArrowDropUp = styled(ArrowDropUp)(({ theme }) => ({
    "& path": {
      d: 'path("m7 20 5-5 5 5z")',
    },
  }));

  // Custom Arrow Down
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

  const handlePageChange = (e, value) => {
    setFilterRequest((prev) => ({
      ...prev,
      page: value,
    }));
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
        <Typography
          variant="h5"
          component="h2"
          style={{ color: "#D6001C", fontWeight: "bold", marginBottom: 20 }}
        >
          Asset List
        </Typography>

        {/* Filters, Search, and Create New Asset */}
        <Grid container spacing={2} alignItems="center">
          {/* Left side: Filters and Search */}
          <Grid item xs={12} md={8} container spacing={2}>
            {/* State Filter */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="State"
                select
                value={filterRequest.state === "" ? "All" : filterRequest.state}
                onChange={handleStateChange}
                variant="outlined"
                fullWidth
                sx={{
                  "& label.Mui-focused": { color: "#000" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000" },
                  },
                  "& .MuiSelect-icon": {
                    color: "transparent",
                  },
                  width: "70%",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <FilterIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {Object.values(assetStateEnum).map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Category"
                select
                value={
                  filterRequest.category === "" ? "All" : filterRequest.category
                }
                onChange={handleCategoryChange}
                variant="outlined"
                fullWidth
                sx={{
                  "& label.Mui-focused": { color: "#000" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000" },
                  },
                  "& .MuiSelect-icon": {
                    color: "transparent",
                  },
                  width: "70%",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <FilterIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {categories ? (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    Loading categories...
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Search Box */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                fullWidth
                sx={{
                  "& label.Mui-focused": { color: "#000" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000" },
                  },
                  width: "120%",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearchClick}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Right side: Create New Asset Button */}
          <Grid item xs={12} md={4} container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(path.assetCreate)}
              sx={{
                backgroundColor: "#D6001C",
                color: "white",
                height: 56, // Set height to 56px
                "&:hover": {
                  bgcolor: "rgba(214, 0, 28, 0.8)",
                },
              }}
            >
              Create New Asset
            </Button>
          </Grid>
        </Grid>

        {/* Asset Table */}
        <TableContainer
          component={Paper}
          sx={{ height: "calc(100% - 180px)", position: "relative" }}
        >
          <Sheet ref={scrollRef} sx={{ overflow: "auto", height: "100%" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ fontWeight: "bold", width: "15%" }} // Adjust width as needed
                    onClick={() => handleHeaderClick("assetcode")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Asset Code
                      {getSortIcon("assetcode")}
                    </div>
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", width: "40%" }} // Adjust width as needed
                    onClick={() => handleHeaderClick("assetname")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Asset Name
                      {getSortIcon("assetname")}
                    </div>
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", width: "15%" }} // Adjust width as needed
                    onClick={() => handleHeaderClick("category")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Category
                      {getSortIcon("category")}
                    </div>
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", width: "15%" }} // Adjust width as needed
                    onClick={() => handleHeaderClick("state")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      State
                      {getSortIcon("state")}
                    </div>
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", width: "15%" }}
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
                    {assets.length === 0 ? (
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
                          No asset found
                        </TableCell>
                      </TableRow>
                    ) : (
                      assets.map((asset) => (
                        <TableRow
                          key={asset.id}
                          hover
                          onClick={() => handleDetailDialog(asset)}
                          style={{ cursor: "pointer" }} // Set cursor to pointer on hover
                        >
                          <TableCell>{asset.assetCode}</TableCell>
                          <TableCell>{asset.assetName}</TableCell>
                          <TableCell>{asset.category?.name}</TableCell>
                          <TableCell>{assetStateEnum[asset.state]}</TableCell>
                          <TableCell>
                            {assetStateEnum[asset.state] === "Assigned" ? (
                              // Disable edit and delete icons if state is assigned
                              <>
                                <IconButton aria-label="edit" disabled>
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  disabled
                                  style={{ color: "#D6001C", opacity: 0.5 }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            ) : (
                              // Render edit and delete icons normally if state is not assigned
                              <>
                                <IconButton
                                  aria-label="edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                      path.assetEdit.replace(":id", asset.id)
                                    );
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  style={{ color: "#D6001C" }}
                                  onClick={(e) => {
                                    // Prevent showing popup
                                    e.stopPropagation();
                                    handleDeleteIconClick(asset);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
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
            paddingTop: "15px",
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

      {/* Asset Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            bgcolor: "grey.300",
            color: "#D6001C",
            fontWeight: "bold",
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Detailed Asset Information
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              bgcolor: "grey.300",
              color: "#D6001C",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            borderTop: "1px solid black",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            // maxHeight: "300px",
            overflowY: "auto",
            wordWrap: "break-word",
            wordBreak: "break-all"
          }}
        >
          {selectedAsset ? (
            <>
              {/* Asset Details */}
              <Typography variant="h6" sx={{ marginTop: 2 }} gutterBottom>
                {/* Asset Details */}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Asset Code:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {selectedAsset.assetCode}
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Asset Name:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {selectedAsset.assetName}
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Category:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {selectedAsset.category.name}
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    State:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {assetStateEnum[selectedAsset.state]}
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Installed Date:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {formatDate(selectedAsset.installedDate)}
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Specification:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {selectedAsset.specification}
                  </Typography>
                </Grid>
              </Grid>

              {/* Assignment History */}
              {selectedAsset.assignments &&
                selectedAsset.assignments.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ marginTop: 3 }} gutterBottom>
                      Assignment History
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: "15%" }} // Adjust width as needed
                            >
                              <strong>Assigned To</strong>
                            </TableCell>
                            <TableCell style={{ width: "15%" }} // Adjust width as needed
                            >
                              <strong>Assigned By</strong>
                            </TableCell>
                            <TableCell style={{ width: "16%" }} // Adjust width as needed
                            >
                              <strong>Assigned Date</strong>
                            </TableCell>
                            <TableCell style={{ width: "54%" }} // Adjust width as needed
                            >
                              <strong>Note</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedAsset.assignments.map(
                            (assignment, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {assignment.assignedTo.userName}
                                </TableCell>
                                <TableCell>
                                  {assignment.assignedBy.userName}
                                </TableCell>
                                <TableCell>
                                  {formatDate(assignment.assignedDate)}
                                </TableCell>
                                <TableCell>{assignment.note}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <DialogTitle
          sx={{
            bgcolor: "grey.300",
            color: "#D6001C",
            fontWeight: "bold",
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Are you sure?
        </DialogTitle>
        <DialogContent
          sx={{
            borderTop: "1px solid black",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <Typography variant="body1">
            Do you want to delete this asset?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteConfirmation}
            autoFocus
            sx={{
              color: "white",
              bgcolor: "#D6001C",
              "&:hover": {
                bgcolor: "rgba(214, 0, 28, 0.8)",
              },
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => setShowDeleteConfirmation(false)}
            sx={{
              color: "black",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog} onClose={() => setErrorDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Dialog for Historical Assignments */}
      <Dialog
        open={showNotification}
        onClose={() => setShowNotification(false)}
      >
        <DialogTitle
          sx={{
            bgcolor: "grey.300",
            color: "#D6001C",
            fontWeight: "bold",
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Cannot Delete Asset
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              bgcolor: "grey.300",
              color: "#D6001C",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            borderTop: "1px solid black",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <Typography variant="body1">
            Cannot delete the asset because it belongs to one or more historical
            assignments.
          </Typography>
          <Typography variant="body1">
            If the asset is not able to be used anymore, please update its state
            in{" "}
            {selectedAsset ? (
              <Link
                component={Link}
                to={path.assetEdit.replace(":id", selectedAsset.id)}
                color="primary"
                underline="always"
              >
                Edit Asset page
              </Link>
            ) : null
            }
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageAssetPage;
