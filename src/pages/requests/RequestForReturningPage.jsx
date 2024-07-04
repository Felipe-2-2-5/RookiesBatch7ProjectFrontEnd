import {
  ArrowDropDown,
  ArrowDropUp,
  Clear as Cancelcon,
  DisabledByDefault as CloseIcon,
  Check as CompleteIcon,
  FilterAltOutlined as FilterIcon,
  Search as SearchIcon,
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
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { ComfirmationPopup, NotificationPopup } from "../../components";
import { requestStateEnum } from "../../enum/requestStateEnum";
import {
  CancelReturnRequest,
  CompeleteReturnRequest,
  GetReturnRequest,
  ReturnRequestFilterRequest,
} from "../../services/requestsForReturning.service";

const formatDate = (dateString) => {
  if (!dateString) return ""; // Handle null or undefined dateString

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

const RequestForReturningPage = () => {
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);

  const [filterRequest, setFilterRequest] = useState({
    state: "",
    returnedDate: null,
    searchTerm: "",
    sortColumn: "returnedDate",
    sortOrder: "descend",
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

  const [returnRequests, setReturnRequests] = useState([]);

  useEffect(() => {
    const getReturnRequests = async (filterRequest) => {
      const res = await ReturnRequestFilterRequest(filterRequest);
      const fetchedReturnRequests = res.data.data;
      setTotalCount(res.data.totalCount);
      setReturnRequests(fetchedReturnRequests);

      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      setLoading(false);
    };

    getReturnRequests(filterRequest);
  }, [filterRequest]);

  const [selectedState, setSelectedState] = useState("All");
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setFilterRequest((prevState) => ({
      ...prevState,
      state: selectedState === "All" ? "" : selectedState,
      sortColumn: "returnedDate",
      sortOrder: "",
      page: 1,
    }));
  };

  const [selectedDate, setSelectedDate] = useState(null); // eslint-disable-next-line
  const [cleared, setCleared] = useState(false);
  const [dateError, setDateError] = useState(false);

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
  const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);

  const handleDetailDialog = async (returnRequest) => {
    const res = await GetReturnRequest(returnRequest.id);
    setSelectedReturnRequest({ ...res.data });
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReturnRequest(null);
  };

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelRequest = async () => {
    try {
      await CancelReturnRequest(requestToCancel);
      setCancelDialogOpen(false);
      setSelectedReturnRequest(null);
      const res = await ReturnRequestFilterRequest(filterRequest);
      const fetchedReturnRequests = res?.data?.data;
      setReturnRequests(fetchedReturnRequests);
      setSuccess(true);
      setMessage("The request has been successfully cancelled.");
    } catch (err) {
      setSuccess(false);
      setMessage("An error occurred while cancelling the request.");
    }
  };
  const handleCancelRequestClick = (id, e) => {
    e.stopPropagation();
    setRequestToCancel(id);
    setCancelDialogOpen(true);
  };

  const handleConfirmPopupClose = () => {
    setOpenConfirmPopup(false);
    setSelectedReturnRequest(null);
  };

  const handleCompleteRequest = async () => {
    try {
      console.log(selectedReturnRequest);
      await CompeleteReturnRequest(selectedReturnRequest.id);
      setSuccess(true);
      setMessage("The request has been successfully completed.");
    } catch (error) {
      setSuccess(false);
      setMessage("An error occurred while completing the request.");
    }
    //setOpenDialog(false);
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
          Request List
        </h2>

        <ComfirmationPopup
          open={cancelDialogOpen}
          handleClose={() => setCancelDialogOpen(false)}
          handleConfirm={handleCancelRequest}
          title="Are you sure?"
          content="Do you want to cancel this returning request?"
          closeContent="No"
          confirmContent="Yes"
        />
        <ComfirmationPopup
          open={openConfirmPopup}
          title="Are you sure?"
          let
          content='Do you want to mark this returning request as "Completed"?'
          Okbutton="Yes"
          handleClose={handleConfirmPopupClose}
          handleConfirm={handleCompleteRequest}
        />
        <NotificationPopup
          open={!!message}
          handleClose={() => setMessage("")}
          title={success ? "Success" : "Error"}
          content={message}
          closeContent="Close"
        />
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            {/* State Filter */}
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
                State
              </InputLabel>
              <Select
                label="State"
                value={selectedState}
                name="state"
                IconComponent={(props) => (
                  <FilterIcon
                    {...props}
                    style={{ transform: "none" }}
                  />
                )}
                onChange={handleStateChange}
                sx={{ "& .MuiOutlinedInput-input": { color: "black" } }}>
                <MenuItem value="All">All</MenuItem>
                {Object.values(requestStateEnum).map((state) => (
                  <MenuItem
                    key={state}
                    value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Returned date Filter */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                slotProps={{
                  field: { clearable: true, onClear: () => setCleared(true) },
                }}
                label="Returned Date"
                value={selectedDate}
                onChange={(newValue) => {
                  if (newValue instanceof Date && !isNaN(newValue.getTime())) {
                    setSelectedDate(newValue);
                    setDateError(false);
                    setFilterRequest((prev) => ({
                      ...prev,
                      returnedDate: format(newValue, "dd/MM/yyyy"),
                    }));
                  } else {
                    setSelectedDate(null);
                    setDateError(true);
                    setFilterRequest((prev) => ({
                      ...prev,
                      returnedDate: "",
                    }));
                  }
                }}
                clearable
                sx={{
                  width: 240,
                  marginLeft: "16px",
                  "& .MuiInputLabel-root": {
                    color: "black",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                  },
                }}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    margin="dense"
                    required
                    error={dateError}
                    helperText={dateError ? "Invalid date" : ""}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                    sx={{
                      width: 240,
                      marginLeft: "16px",
                      "& .MuiInputLabel-root": {
                        color: "black",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "black",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                )}
                format="dd/MM/yyyy"
              />
            </LocalizationProvider>
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
                    onClick={handleSearchClick}>
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
        </Box>

        {/* Request Table */}
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
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      paddingLeft: "40px",
                    }}>
                    No.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("assetCode")}
                      endIcon={getSortIcon("assetCode")}
                      sx={buttonTableHead}>
                      Asset Code
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("assetName")}
                      endIcon={getSortIcon("assetName")}
                      sx={buttonTableHead}>
                      Asset Name
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("requestedBy")}
                      endIcon={getSortIcon("requestedBy")}
                      sx={buttonTableHead}>
                      Requested By
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("assignedDate")}
                      endIcon={getSortIcon("assignedDate")}
                      sx={buttonTableHead}>
                      Assigned Date
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("acceptedBy")}
                      endIcon={getSortIcon("acceptedBy")}
                      sx={buttonTableHead}>
                      Accepted By
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("returnedDate")}
                      endIcon={getSortIcon("returnedDate")}
                      sx={buttonTableHead}>
                      Returned Date
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "15%",
                      paddingLeft: "40px",
                    }}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("state")}
                      endIcon={getSortIcon("state")}
                      sx={buttonTableHead}>
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
                    {returnRequests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          sx={{
                            color: "red",
                            textAlign: "center",
                            padding: "28px",
                            fontWeight: "bold",
                          }}>
                          No Request for Returning found
                        </TableCell>
                      </TableRow>
                    ) : (
                      returnRequests.map((returnRequest, index) => (
                        <TableRow
                          key={returnRequest.id}
                          hover
                          onClick={() => handleDetailDialog(returnRequest)}
                          style={{ cursor: "pointer" }}>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {returnRequest.assignment.asset.assetCode}
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingLeft: "40px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 150,
                            }}>
                            {returnRequest.assignment.asset.assetName}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {returnRequest.requestor?.userName}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {formatDate(returnRequest.assignment.assignedDate)}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {returnRequest.acceptor?.userName}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {formatDate(returnRequest.returnedDate)}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {requestStateEnum[returnRequest.state]}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {requestStateEnum[returnRequest.state] ===
                            "Completed" ? (
                              <>
                                <IconButton
                                  aria-label="complete"
                                  disabled>
                                  <CompleteIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="cancel"
                                  disabled>
                                  <Cancelcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  aria-label="complete"
                                  sx={{
                                    color: "#D6001C",
                                    "&:hover": {
                                      backgroundColor: "#bcbcbc",
                                    },
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}>
                                  <CompleteIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="cancel"
                                  sx={{
                                    color: "#000000",
                                    "&:hover": {
                                      backgroundColor: "#bcbcbc",
                                    },
                                  }}
                                  onClick={(e) =>
                                    handleCancelRequestClick(
                                      returnRequest?.id,
                                      e
                                    )
                                  }>
                                  <Cancelcon />
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

      {/* Request Details Dialog*/}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md">
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
          Detailed Request Information
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 10,
              top: 12,
              color: "#D6001C",
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            borderTop: "1px solid black",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            overflowY: "auto",
            wordWrap: "break-word",
            wordBreak: "break-all",
          }}>
          {selectedReturnRequest ? (
            <>
              <Typography
                variant="h6"
                sx={{ marginTop: 2 }}
                gutterBottom>
                {/* Request Details */}
              </Typography>
              <Grid
                container
                spacing={2}>
                <Grid
                  item
                  xs={5}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}>
                    Asset Code:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}>
                  <Typography variant="body1">
                    {selectedReturnRequest.assignment.asset?.assetCode}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={5}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}>
                    Asset Name:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}>
                  <Typography variant="body1">
                    {selectedReturnRequest.assignment.asset?.assetName}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={5}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}>
                    Requested By:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}>
                  <Typography variant="body1">
                    {selectedReturnRequest.requestor?.userName}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={5}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}>
                    Assigned Date:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}>
                  <Typography variant="body1">
                    {formatDate(selectedReturnRequest.assignment?.assignedDate)}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={5}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}>
                    Accepted By:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}>
                  <Typography variant="body1">
                    {selectedReturnRequest.acceptor?.userName}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={5}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}>
                    Returned Date:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}>
                  <Typography variant="body1">
                    {formatDate(selectedReturnRequest.returnedDate)}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={5}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}>
                    State:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}>
                  <Typography variant="body1">
                    {requestStateEnum[selectedReturnRequest.state]}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestForReturningPage;
