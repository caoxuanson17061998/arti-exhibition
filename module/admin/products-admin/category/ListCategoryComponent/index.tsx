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

interface Category {
  id: string;
  name: string;
}

interface IListCategoryProps {
  changeTab: (tab: string) => void;
  setCategoryId?: (id: string) => void;
}

export default function ListCategoryComponent({
  changeTab,
  setCategoryId,
}: IListCategoryProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const queryClient = useQueryClient();

  const {data: categoriesData, isLoading} = useQuery(
    ["categories"],
    async () => {
      const res = await axios.get("/api/categories");
      return res.data;
    },
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      const res = await axios.delete(`/api/categories?id=${id}`);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("categories");
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      },
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredCategories = useMemo(() => {
    if (!categoriesData) return [];
    if (!debouncedSearch) return categoriesData;
    return categoriesData.filter((c: Category) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [categoriesData, debouncedSearch]);

  const sortedCategories = useMemo(() => {
    const sorted = [...filteredCategories];
    sorted.sort((a, b) => {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    return sorted;
  }, [filteredCategories, order]);

  const paginatedCategories = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedCategories.slice(start, start + rowsPerPage);
  }, [sortedCategories, page, rowsPerPage]);

  const handleDeleteConfirm = () => {
    if (categoryToDelete) deleteMutation.mutate(categoryToDelete.id);
  };

  const totalItems = sortedCategories.length;

  return (
    <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Box>
          <div className="text-gray-500 text-sm">
            <h4 className="font-bold mb-1 text-2xl">Danh sách danh mục</h4>
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Sản phẩm</span>
              <Tag />{" "}
              <span className="text-[#212B36]">
                Danh sách danh mục danh mục
              </span>
            </div>
          </div>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !rounded-xl !py-2 !font-semibold !px-6"
          onClick={() => changeTab("createUpdateCategory")}
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
          placeholder="Tìm danh mục..."
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
                    Tên danh mục
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setCategoryId?.(category.id);
                        changeTab("createUpdateCategory");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setCategoryToDelete(category);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography className="text-gray-400 py-8">
                      Không có danh mục nào phù hợp.
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
            Tổng cộng: {totalItems} danh mục
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
        itemName={categoryToDelete?.name}
        isDeleting={deleteMutation.isLoading}
      />
    </Box>
  );
}
