import React, { useEffect, useRef, useState, Fragment } from "react";
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
  FilterAlt as FilterIcon,
  Search as SearchIcon,
  DisabledByDefault as CloseIcon,
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import { useNavigate } from "react-router";
import { path } from "../../routes/routeContants";
import { FilterRequest, GetAsset, GetCategories } from "../../services/asset.service";
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
    sortColumn: "name",
    sortOrder: "",
    page: 1,
    pageSize: "20",
  });

  const [totalCount, setTotalCount] = useState();
  const pageSize = filterRequest.pageSize || 1;
  const pageCount = Number.isNaN(totalCount) || totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);

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
        setAsset([assetCreated, ...fetchedAssets]);
        sessionStorage.removeItem("asset_created");
      } else {
        setAsset(fetchedAssets);
      }
      // Scroll to top of list
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      }
      setLoading(false)
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
  const trimmedSearchTerm = searchTerm.trim().replace(/\s+/g, ' ');

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
      setSearchTerm(trimmedSearchTerm)
      handleSearch()
    }
  };

  const handleSearchClick = () => {
    setSearchTerm(trimmedSearchTerm)
    handleSearch()
  };

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleDetailDialog = async (asset) => {
    const res = await GetAsset(asset.id);
    console.log(res.data)
    setSelectedAsset(res.data);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFilterRequest((prevState) => ({
      ...prevState,
      state: selectedState === "All" ? "" : selectedState,
      searchTerm: "",
      sortColumn: "name",
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
      sortColumn: "name",
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

  // Custom Arrow Up
  const CustomArrowDropUp = styled(ArrowDropUp)(({ theme }) => ({
    '& path': {
      d: 'path("m7 20 5-5 5 5z")'
    }
  }));

  // Custom Arrow Down
  const CustomArrowDropDown = styled(ArrowDropDown)(({ theme }) => ({
    '& path': {
      d: 'path("m7 0 5 5 5-5z")'
    }
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
            <CustomArrowDropUp sx={{ color: "#bdbdbd", }} />
            <CustomArrowDropDown />
          </div>
        );
      }
      if (filterRequest.sortOrder === "") {
        return (
          <div style={iconStyle}>
            <CustomArrowDropUp />
            <CustomArrowDropDown sx={{ color: "#bdbdbd", }} />
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
                    <FilterIcon />
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
              value={filterRequest.category === "" ? "All" : filterRequest.category}
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
                    <FilterIcon />
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
      <TableContainer component={Paper}>
        <Sheet
          ref={scrollRef}
          sx={{ overflow: "auto", height: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ fontWeight: "bold", width: "15%" }} // Adjust width as needed
                  onClick={() => handleHeaderClick("code")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Asset Code
                    {getSortIcon("code")}
                  </div>
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", width: "40%" }} // Adjust width as needed
                  onClick={() => handleHeaderClick("name")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Asset Name
                    {getSortIcon("name")}
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
                  <TableCell colSpan={6} sx={{ textAlign: "center", padding: "28px" }}>
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
                        <TableCell>{asset.category.name}</TableCell>
                        <TableCell>{assetStateEnum[asset.state]}</TableCell>
                        <TableCell>
                          <IconButton aria-label="edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="delete" style={{ color: "#D6001C" }}>
                            <DeleteIcon />
                          </IconButton>
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

      {/* Asset Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            bgcolor: "grey.300",
            color: "#D6001C",
            fontWeight: "bold",
            borderBottom: "1px solid black", // Adding bottom border
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selectedAsset ? (
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Typography variant="body1">Asset Code</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{selectedAsset.assetCode}</Typography>
        </Grid>

        <Grid item xs={5}>
          <Typography variant="body1">Asset Name</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{selectedAsset.assetName}</Typography>
        </Grid>

        <Grid item xs={5}>
          <Typography variant="body1">Category</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{selectedAsset.category.name}</Typography>
        </Grid>

        <Grid item xs={5}>
          <Typography variant="body1">State</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{assetStateEnum[selectedAsset.state]}</Typography>
        </Grid>

        <Grid item xs={5}>
          <Typography variant="body1">Installed Date</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{formatDate(selectedAsset.installedDate)}</Typography>
        </Grid>

        <Grid item xs={5}>
          <Typography variant="body1">Specificaion</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{selectedAsset.specification}</Typography>
        </Grid>

        {/* Assignment History */}
        {selectedAsset.assignments && selectedAsset.assignments.length > 0 ? (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: 10 }}>Assignment History</Typography>
            </Grid>
            {selectedAsset.assignments.map((assignment, index) => (
              <Fragment key={index}>
                <Grid item xs={5}>
                  <Typography variant="body1">Assign To</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">{assignment.assignTo}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1">Assign By</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">{assignment.assignBy}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1">Assign Date</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">{assignment.assignDate}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1">State</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">{assignment.state}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="body1">Note</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">{assignment.note}</Typography>
                </Grid>
              </Fragment>
            ))}
          </>
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontStyle: 'italic' }}>No assignment history found.</Typography>
          </Grid>
        )}
      </Grid>
    ) : (
      <CircularProgress /> // Show loading indicator while fetching data
    )}
  </DialogContent>
</Dialog>
    </>
  );
};

export default ManageAssetPage;
