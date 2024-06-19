import { Box, Pagination } from "@mui/material";
import React from "react";

const PaginationBar = ({ pageCount, filterRequest, handlePageChange }) => {
  const page = filterRequest ? filterRequest.page : 1;

  return (
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
        page={page}
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
  );
};

export default PaginationBar;
