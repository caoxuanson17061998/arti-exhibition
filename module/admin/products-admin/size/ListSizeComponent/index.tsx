import Tag from "@app/utils";
import IconSearch from "@components/Icon/IconSearch";
import ConfirmDeleteDialog from "@components/common/ConfirmDeleteDialog";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";

interface Size {
  id: string;
  name: string;
}

interface IListSizeProps {
  changeTab: (tab: string) => void;
  setSizeId?: (id: string) => void;
}

export default function ListSizeComponent({
  changeTab,
  setSizeId,
}: IListSizeProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<Size | null>(null);

  const queryClient = useQueryClient();

  const {data: sizesData, isLoading} = useQuery(["sizes"], async () => {
    const res = await axios.get("/api/sizes");
    return res.data;
  });

  const deleteMutation = useMutation(
    async (id: string) => {
      const res = await axios.delete(`/api/sizes?id=${id}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sizes");
        setDeleteDialogOpen(false);
        setSizeToDelete(null);
      },
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredSizes = useMemo(() => {
    if (!sizesData) return [];
    if (!debouncedSearch) return sizesData;
    return sizesData.filter((s: Size) =>
      s.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [sizesData, debouncedSearch]);

  const sortedSizes = useMemo(() => {
    const sorted = [...filteredSizes];
    sorted.sort((a, b) => {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    return sorted;
  }, [filteredSizes, order]);

  const paginatedSizes = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedSizes.slice(start, start + rowsPerPage);
  }, [sortedSizes, page, rowsPerPage]);

  const handleDeleteConfirm = () => {
    if (sizeToDelete) deleteMutation.mutate(sizeToDelete.id);
  };

  const totalItems = sortedSizes.length;

  return (
    <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh sách kích thước</h4>

          <div className="text-gray-500 text-sm">
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Sản phẩm</span>
              <Tag />{" "}
              <span className="text-[#212B36]">Danh sách kích thước</span>
            </div>
          </div>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !rounded-xl !py-2 !font-semibold !px-6"
          onClick={() => changeTab("createUpdateSize")}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper
        className="flex flex-col md:flex-row md:items-center gap-2 py-3 mb-4 bg-gray-50"
        elevation={0}
      >
        <OutlinedInput
          className="w-full md:w-72"
          size="medium"
          placeholder="Tìm kích thước..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <IconSearch />
            </InputAdornment>
          }
        />
      </Paper>

      {isLoading ? (
        <Typography className="text-center py-8">Đang tải...</Typography>
      ) : (
        <TableContainer component={Paper} className="rounded-xl shadow-sm">
          <Table size="small">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>
                  <TableSortLabel
                    active
                    direction={order}
                    onClick={() => {
                      setOrder(order === "asc" ? "desc" : "asc");
                    }}
                  >
                    Tên kích thước
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell>{size.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setSizeId?.(size.id);
                        changeTab("createUpdateSize");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSizeToDelete(size);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedSizes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography className="text-gray-400 py-8">
                      Không có kích thước nào phù hợp.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalItems > 0 && (
        <Box className="flex justify-between items-center mt-4">
          <Typography className="text-sm text-gray-500">
            Tổng cộng: {totalItems} kích thước
          </Typography>
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage=""
          />
        </Box>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={sizeToDelete?.name}
        isDeleting={deleteMutation.isLoading}
      />
    </Box>
  );
}
