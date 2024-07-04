import {
  ArrowDropDown,
  ArrowDropUp
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { PaginationBar } from "../../components";
import { FilterReport } from "../../services/asset.service";

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const tableHead = {
  width: "auto",
  paddingLeft: "40px",
};

const buttonTableHead = {
  fontWeight: "bold",
  textTransform: "none",
  padding: 0,
  minWidth: "auto",
  color: "black",
}
const ReportPage = () => {
  const scrollRef = useRef(null);
  const [totalCount, setTotalCount] = useState();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRequest, setFilterRequest] = useState({
    sortColumn: "Category",
    sortOrder: "desc",
    page: 1,
    pageSize: "20",
  });

  const pageSize = filterRequest.pageSize || 1;
  const pageCount =
    Number.isNaN(totalCount) || totalCount === 0
      ? 1
      : Math.ceil(totalCount / pageSize);

  // Get reports from API
  const getReports = async (filterRequest) => {
    try {
      const res = await FilterReport(filterRequest);
      if (res.status === 200) {
        setReports(res.data.data);
        setTotalCount(res.data.totalCount);
      } else {
        setReports([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setReports([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports(filterRequest);
  }, [filterRequest]);

  const handlePageChange = (e, value) => {
    setFilterRequest((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const handleExport = () => {
  }

  const handleHeaderClick = (column) => {
    setFilterRequest((prev) => {
      let newSortOrder;
      let newSortColumn;

      if (column === prev.sortColumn) {
        if (prev.sortOrder === "desc") {
          newSortOrder = "";
          newSortColumn = column;
        } else {
          newSortOrder = "desc";
          newSortColumn = column;

        }
      } else {
        newSortOrder = "desc";
        newSortColumn = column;
      }
      console.log("1", column);
      console.log("2", prev.sortColumn);
      console.log("11", newSortOrder);
      console.log("22", prev.sortOrder);
      return {
        ...prev,
        sortColumn: newSortColumn,
        sortOrder: newSortOrder,
        page: 1,
      };
    });
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
      if (filterRequest.sortOrder === "desc") {
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
    } else {
      return (
        <div style={iconStyle}>
          <CustomArrowDropUp sx={{ color: "#bdbdbd" }} />
          <CustomArrowDropDown sx={{ color: "#bdbdbd" }} />
        </div>
      );
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
          Report
        </h2>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px", marginRight: "20px", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#D6001C",
              height: "56px",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>{" "}
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
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("Category")}
                      endIcon={getSortIcon("Category")}
                    >
                      Category
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("Total")}
                      endIcon={getSortIcon("Total")}
                    >
                      Total
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("Assigned")}
                      endIcon={getSortIcon("Assigned")}
                    >
                      Assigned
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      variant="text"
                      onClick={() => handleHeaderClick("Available")}
                      endIcon={getSortIcon("Available")}
                      sx={buttonTableHead}
                    >
                      Available
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("NotAvailable")}
                      endIcon={getSortIcon("NotAvailable")}
                    >
                      Not available
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("WaitingForRecycling")}
                      endIcon={getSortIcon("WaitingForRecycling")}
                    >
                      Waiting for recycling
                    </Button>
                  </TableCell>
                  <TableCell sx={tableHead}>
                    <Button
                      sx={buttonTableHead}
                      variant="text"
                      onClick={() => handleHeaderClick("Recycled")}
                      endIcon={getSortIcon("Recycled")}
                    >
                      Recycled
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ textAlign: "center", padding: "28px" }}
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {reports.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          sx={{
                            color: "red",
                            textAlign: "center",
                            padding: "28px",
                            fontWeight: "bold",
                          }}
                        >
                          No report found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((report, index) => (
                        <CustomTableRow
                          key={report.category}
                        >
                          <TableCell sx={{ paddingLeft: "40px" }}>
                            {report.category}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "50px" }}>
                            {report.total}
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingLeft: "60px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 150,
                            }}
                          >
                            {report.assigned}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "60px" }}>
                            {report.available}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "70px" }}>
                            {report.notAvailable}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "80px" }}>
                            {report.waitingForRecycling}
                          </TableCell>
                          <TableCell sx={{ paddingLeft: "60px" }}>
                            {report.recycled}
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
        <PaginationBar
          filterRequest={filterRequest}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </Paper>
    </>
  );
};

export default ReportPage;