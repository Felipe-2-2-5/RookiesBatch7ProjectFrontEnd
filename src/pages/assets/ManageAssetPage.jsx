import React, { useState } from "react";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  HighlightOff as DeleteIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  FilterAlt as FilterIcon,
  Search as SearchIcon,
  DisabledByDefault as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { path } from "../../routes/routeContants";

const ManageAssetPage = () => {
  const navigate = useNavigate();

  // Sample data for assets
  const [assets] = useState([
    {
      id: 1,
      code: "A001",
      name: "Asset 1",
      category: "Category A",
      state: "Active",
    },
    {
      id: 2,
      code: "A002",
      name: "Asset 2",
      category: "Category B",
      state: "Inactive",
    },
    {
      id: 3,
      code: "A003",
      name: "Asset 3",
      category: "Category A",
      state: "Active",
    },
    {
      id: 4,
      code: "A004",
      name: "Asset 4",
      category: "Category B",
      state: "Inactive",
    },
    {
      id: 5,
      code: "A005",
      name: "Asset 5",
      category: "Category A",
      state: "Active",
    },
    {
      id: 6,
      code: "A006",
      name: "Asset 6",
      category: "Category B",
      state: "Inactive",
    },
    {
      id: 7,
      code: "A007",
      name: "Asset 7",
      category: "Category A",
      state: "Active",
    },
    {
      id: 8,
      code: "A008",
      name: "Asset 8",
      category: "Category B",
      state: "Inactive",
    },
    {
      id: 9,
      code: "A009",
      name: "Asset 9",
      category: "Category A",
      state: "Active",
    },
    {
      id: 10,
      code: "A010",
      name: "Asset 10",
      category: "Category B",
      state: "Inactive",
    },
    // Add more assets as needed
  ]);

  // State variables for filters, search, and sorting
  const [stateFilter, setStateFilter] = useState("All"); // Example: "Active", "Inactive", "All"
  const [categoryFilter, setCategoryFilter] = useState("All"); // Example: "Category A", "Category B", "All"
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // Default sort by "name"
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order: "asc" or "desc"

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Filtered and sorted assets based on current filters and search term
  let filteredAssets = assets.filter(
    (asset) =>
      (stateFilter === "All" || asset.state === stateFilter) &&
      (categoryFilter === "All" || asset.category === categoryFilter) &&
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort filtered assets based on sortBy and sortOrder
  if (sortBy) {
    filteredAssets.sort((a, b) => {
      const first = a[sortBy];
      const second = b[sortBy];
      if (sortOrder === "asc") {
        return first.localeCompare(second);
      } else {
        return second.localeCompare(first);
      }
    });
  }

  // Handle opening dialog for asset details
  const openAssetDialog = (asset) => {
    setSelectedAsset(asset);
    setOpenDialog(true);
  };

  // Handle closing dialog
  const closeAssetDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle between ascending and descending order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Default to ascending order when sorting a new column
      setSortBy(column);
      setSortOrder("asc");
    }
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
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
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
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Category"
              select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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
              <MenuItem value="Category A">Category A</MenuItem>
              <MenuItem value="Category B">Category B</MenuItem>
            </TextField>
          </Grid>

          {/* Search Box */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
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
                    <SearchIcon />
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ fontWeight: "bold", width: "15%" }} // Adjust width as needed
                onClick={() => handleSort("code")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Asset Code
                  {sortBy === "code" ? (
                    <IconButton size="small">
                      {sortOrder === "asc" ? (
                        <ArrowDropUpIcon />
                      ) : (
                        <ArrowDropDownIcon />
                      )}
                    </IconButton>
                  ) : (
                    <IconButton size="small">
                      <ArrowDropDownIcon />
                    </IconButton>
                  )}
                </div>
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", width: "40%" }} // Adjust width as needed
                onClick={() => handleSort("name")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Asset Name
                  {sortBy === "name" ? (
                    <IconButton size="small">
                      {sortOrder === "asc" ? (
                        <ArrowDropUpIcon />
                      ) : (
                        <ArrowDropDownIcon />
                      )}
                    </IconButton>
                  ) : (
                    <IconButton size="small">
                      <ArrowDropDownIcon />
                    </IconButton>
                  )}
                </div>
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", width: "15%" }} // Adjust width as needed
                onClick={() => handleSort("category")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Category
                  {sortBy === "category" ? (
                    <IconButton size="small">
                      {sortOrder === "asc" ? (
                        <ArrowDropUpIcon />
                      ) : (
                        <ArrowDropDownIcon />
                      )}
                    </IconButton>
                  ) : (
                    <IconButton size="small">
                      <ArrowDropDownIcon />
                    </IconButton>
                  )}
                </div>
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", width: "15%" }} // Adjust width as needed
                onClick={() => handleSort("state")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  State
                  {sortBy === "state" ? (
                    <IconButton size="small">
                      {sortOrder === "asc" ? (
                        <ArrowDropUpIcon />
                      ) : (
                        <ArrowDropDownIcon />
                      )}
                    </IconButton>
                  ) : (
                    <IconButton size="small">
                      <ArrowDropDownIcon />
                    </IconButton>
                  )}
                </div>
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", width: "15%" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow
                key={asset.id}
                hover
                onClick={() => openAssetDialog(asset)}
                style={{ cursor: "pointer" }} // Set cursor to pointer on hover
              >
                <TableCell>{asset.code}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>{asset.state}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" style={{ color: "#D6001C" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" style={{ color: "#D6001C" }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Asset Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeAssetDialog}
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
            onClick={closeAssetDialog}
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
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography variant="body1">Asset Code</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1">
                {selectedAsset && selectedAsset.code}
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <Typography variant="body1">Asset Name</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1">
                {selectedAsset && selectedAsset.name}
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <Typography variant="body1">Category</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1">
                {selectedAsset && selectedAsset.category}
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <Typography variant="body1">State</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1">
                {selectedAsset && selectedAsset.state}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageAssetPage;
