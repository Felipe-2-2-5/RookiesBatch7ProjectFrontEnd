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
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress,
  Pagination,
  styled,
} from "@mui/material";
import {
  HighlightOff as DeleteIcon,
  ArrowDropDown,
  ArrowDropUp,
  FilterAltOutlined as FilterIcon,
  Search as SearchIcon,
  DisabledByDefault as CloseIcon,
  CreateTwoTone,
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
import { ConfirmationPopup, NotificationPopup } from "../../components";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const buttonTableHead = {
  fontWeight: "bold",
  textTransform: "none",
  padding: 0,
  minWidth: "auto",
  color: "black",
};
const ManageAssetPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  // popup state
  const [openReturnPopup, setOpenReturnPopup] = useState(false);
  const [openNoti, setNoti] = useState(false);
  const [notiTitle, setNotiTitle] = useState(null);
  const [notiMessage, setNotiMessage] = useState(null);
  const handlePopupClose = () => {
    setOpenReturnPopup(false);
    setNoti(false);
  };

  const [filterRequest, setFilterRequest] = useState({
    state: "",
    category: "",
    searchTerm: "",
    sortColumn: "assetName",
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
  const handlePageChange = (e, value) => {
    setFilterRequest((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const [assets, setAsset] = useState([]);
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

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    getAssets(filterRequest);
  }, [filterRequest]);

  const [categories, setCategories] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetCategories();
        setCategories(res.data);
      } catch (error) {
        if (error) {
          setNotiTitle("Error");
          setNotiMessage(error.UserMessage);
          setNoti(true);
        }
      }
    };

    fetchCategories();
  }, []);

  const [selectedState, setSelectedState] = useState("Default");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setFilterRequest((prevState) => ({
      ...prevState,
      state: selectedState === "All" ? "All" : selectedState,
      sortColumn: "assetName",
      sortOrder: "",
      page: 1,
    }));
  };
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    setFilterRequest((prevState) => ({
      ...prevState,
      category: selectedCategory === "All" ? "" : selectedCategory,
      searchTerm: "",
      sortColumn: "assetName",
      sortOrder: "",
      page: 1,
    }));
  };
  const stateStyles = {
    0: {
      // Available
      color: "#4CAF50", // Green
    },
    1: {
      // Not available
      color: "#D6001C", // Red
    },
    2: {
      // Waiting for Recycling
      color: "#FFC107", // Yellow
    },
    3: {
      // Recycled
      color: "#757575", // Grey
    },
    4: {
      // Assigned
      color: "#1976D2", // Blue
    },
  };

  const [searchTerm, setSearchTerm] = useState("");
  const trimmedSearchTerm = searchTerm.trim().replace(/\s+/g, " ");
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchClick = () => {
    setSearchTerm(trimmedSearchTerm);
    handleSearch();
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(trimmedSearchTerm);
      handleSearch();
    }
  };
  const handleSearch = () => {
    setFilterRequest((prev) => ({
      ...prev,
      searchTerm: trimmedSearchTerm,
      page: 1,
    }));
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
    setShowDeleteWarning(false);
  };

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const handleDeleteIconClick = (asset) => {
    setSelectedAsset(asset);

    if (asset.assignments && asset.assignments.length > 0) {
      setShowDeleteWarning(true);
    } else {
      setOpenReturnPopup(true);
    }
  };
  const handleDeleteConfirmation = async () => {
    if (selectedAsset) {
      try {
        await DeleteAsset(selectedAsset.id);
        getAssets(filterRequest);
        setNotiTitle("Notifications");
        setNotiMessage(
          `Asset ${selectedAsset.assetName} has been deleted successfully!`
        );
        setNoti(true);
      } catch (error) {
        if (error) {
          setNotiTitle("Error");
          setNotiMessage(error.UserMessage);
          setNoti(true);
        }
      } finally {
        setOpenReturnPopup(false);
      }
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
          Asset List
        </h2>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            {/* State Filter */}
            <FormControl
              variant="outlined"
              sx={{
                minWidth: "240px",
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
                State
              </InputLabel>
              <Select
                label="State"
                value={selectedState}
                name="state"
                IconComponent={(props) => (
                  <FilterIcon {...props} style={{ transform: "none" }} />
                )}
                onChange={handleStateChange}
                sx={{ "& .MuiOutlinedInput-input": { color: "black" } }}
              >
                <MenuItem value="Default">Default</MenuItem>
                <MenuItem value="All">All</MenuItem>
                {Object.values(assetStateEnum).map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category Filter */}
            <FormControl
              variant="outlined"
              sx={{
                minWidth: 240,
                marginLeft: "16px",
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
                Category
              </InputLabel>
              <Select
                label="Category"
                value={selectedCategory}
                name="category"
                IconComponent={(props) => (
                  <FilterIcon {...props} style={{ transform: "none" }} />
                )}
                onChange={handleCategoryChange}
                sx={{
                  "& .MuiOutlinedInput-input": { color: "black" },
                  maxHeight: 300, // Maximum height for the dropdown menu
                  overflowY: "auto", // Enable vertical scrolling
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
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
              </Select>
            </FormControl>
          </Box>

          {/* Search Box*/}
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
                    onClick={handleSearchClick}
                  >
                    <SearchIcon />
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

          {/* Create new Button*/}
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
            onClick={() => navigate(path.assetCreate)}
          >
            Create new asset
          </Button>
        </Box>

        {/* Asset Table */}
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
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}
                  >
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("assetCode")}
                      endIcon={getSortIcon("assetCode")}
                      sx={buttonTableHead}
                    >
                      Asset Code
                    </Button>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}
                  >
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("assetName")}
                      endIcon={getSortIcon("assetName")}
                      sx={buttonTableHead}
                    >
                      Asset Name
                    </Button>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}
                  >
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("category")}
                      endIcon={getSortIcon("category")}
                      sx={buttonTableHead}
                    >
                      Category
                    </Button>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}
                  >
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("state")}
                      endIcon={getSortIcon("state")}
                      sx={buttonTableHead}
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
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {asset.assetCode}
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
                            {asset.assetName}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {asset.category?.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: stateStyles[asset.state],
                              paddingLeft: "40px",
                            }}
                          >
                            {assetStateEnum[asset.state]}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {assetStateEnum[asset.state] === "Assigned" ? (
                              <>
                                <IconButton aria-label="edit" disabled>
                                  <CreateTwoTone />
                                </IconButton>
                                <IconButton aria-label="delete" disabled>
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  aria-label="edit"
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "#bcbcbc",
                                    },
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                      path.assetEdit.replace(":id", asset.id)
                                    );
                                  }}
                                  title="Edit asset"
                                >
                                  <CreateTwoTone />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  sx={{
                                    color: "#D6001C",
                                    "&:hover": {
                                      backgroundColor: "#bcbcbc",
                                    },
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteIconClick(asset);
                                  }}
                                  title="Delete asset"
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

      {/* Asset Details Dialog*/}
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
              position: "absolute",
              right: 10,
              top: 12,
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
            wordBreak: "break-word",
          }}
        >
          {selectedAsset ? (
            <>
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
                  <div
                    style={{
                      maxHeight: "100px",
                      overflowY: "auto",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography variant="body1">
                      {selectedAsset.specification}
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              {/* Assignment History */}
              {selectedAsset.assignments &&
                selectedAsset.assignments.length > 0 && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ marginTop: 3, fontStyle: "italic" }}
                      gutterBottom
                    >
                      Assignment History
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: "15%" }}>
                              <strong>Assigned To</strong>
                            </TableCell>
                            <TableCell style={{ width: "15%" }}>
                              <strong>Assigned By</strong>
                            </TableCell>
                            <TableCell style={{ width: "16%" }}>
                              <strong>Assigned Date</strong>
                            </TableCell>
                            <TableCell style={{ width: "54%" }}>
                              <strong>Note</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedAsset.assignments.map(
                            (assignment, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {assignment.assignedTo?.userName}
                                </TableCell>
                                <TableCell>
                                  {assignment.assignedBy?.userName}
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

      {/* Notification Dialog for Historical Assignments */}
      <Dialog
        open={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
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
            ) : null}
          </Typography>
        </DialogContent>
      </Dialog>

      <ConfirmationPopup
        open={openReturnPopup}
        title="Are you sure?"
        content="Do you want to delete this asset?"
        confirmContent={"Delete"}
        closeContent={"Cancel"}
        handleClose={handlePopupClose}
        handleConfirm={handleDeleteConfirmation}
      />
      <NotificationPopup
        open={openNoti}
        title={notiTitle}
        content={notiMessage}
        handleClose={handlePopupClose}
      />
    </>
  );
};

export default ManageAssetPage;
