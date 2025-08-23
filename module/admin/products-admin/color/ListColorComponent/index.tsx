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

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

interface IListColorProps {
  changeTab: (tab: string) => void;
  setColorId?: (id: string) => void;
}

export default function ListColor({changeTab, setColorId}: IListColorProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<"name" | "hexCode">("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);

  const queryClient = useQueryClient();

  const {data: colorsData, isLoading} = useQuery(["colors"], async () => {
    const res = await axios.get("/api/colors");
    return res.data;
  });

  const deleteMutation = useMutation(
    async (id: string) => {
      const res = await axios.delete(`/api/colors?id=${id}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("colors");
        setDeleteDialogOpen(false);
        setColorToDelete(null);
      },
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredColors = useMemo(() => {
    if (!colorsData) return [];
    if (!debouncedSearch) return colorsData;
    return colorsData.filter((c: Color) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [colorsData, debouncedSearch]);

  const sortedColors = useMemo(() => {
    const sorted = [...filteredColors];
    sorted.sort((a, b) => {
      if (orderBy === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return order === "asc"
        ? a.hexCode.localeCompare(b.hexCode)
        : b.hexCode.localeCompare(a.hexCode);
    });
    return sorted;
  }, [filteredColors, order, orderBy]);

  const paginatedColors = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedColors.slice(start, start + rowsPerPage);
  }, [sortedColors, page, rowsPerPage]);

  const handleDeleteConfirm = () => {
    if (colorToDelete) deleteMutation.mutate(colorToDelete.id);
  };

  const totalItems = sortedColors.length;

  return (
    <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh sách màu sắc</h4>
          <div className="text-gray-400 text-sm flex mt-2">
            <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
            <span className="text-[#212B36]">Sản phẩm</span>
            <Tag /> <span className="text-[#212B36]">Danh sách màu sắc</span>
          </div>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !rounded-xl !py-2 !font-semibold !px-6"
          onClick={() => changeTab("createUpdateColor")}
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
          placeholder="Tìm màu..."
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
                    active={orderBy === "name"}
                    direction={order}
                    onClick={() => {
                      setOrderBy("name");
                      setOrder(order === "asc" ? "desc" : "asc");
                    }}
                  >
                    Tên màu
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "hexCode"}
                    direction={order}
                    onClick={() => {
                      setOrderBy("hexCode");
                      setOrder(order === "asc" ? "desc" : "asc");
                    }}
                  >
                    Mã màu
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedColors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell>{color.name}</TableCell>
                  <TableCell>
                    <Box className="flex items-center gap-2">
                      <span>{color.hexCode}</span>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: color.hexCode,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setColorId?.(color.id);
                        changeTab("createUpdateColor");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setColorToDelete(color);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedColors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography className="text-gray-400 py-8">
                      Không có màu nào phù hợp.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <Box className="flex justify-between items-center mt-4">
          <Typography className="text-sm text-gray-500">
            Tổng cộng: {totalItems} màu
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
        itemName={colorToDelete?.name}
        isDeleting={deleteMutation.isLoading}
      />
    </Box>
  );
}
