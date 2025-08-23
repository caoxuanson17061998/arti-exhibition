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

interface Scent {
  id: string;
  name: string;
}

interface IListScentProps {
  changeTab: (tab: string) => void;
  setScentId?: (id: string) => void;
}

export default function ListScentComponent({
  changeTab,
  setScentId,
}: IListScentProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scentToDelete, setScentToDelete] = useState<Scent | null>(null);

  const queryClient = useQueryClient();

  const {data: scentsData, isLoading} = useQuery(["scents"], async () => {
    const res = await axios.get("/api/scents");
    return res.data;
  });

  const deleteMutation = useMutation(
    async (id: string) => {
      const res = await axios.delete(`/api/scents?id=${id}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("scents");
        setDeleteDialogOpen(false);
        setScentToDelete(null);
      },
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredScents = useMemo(() => {
    if (!scentsData) return [];
    if (!debouncedSearch) return scentsData;
    return scentsData.filter((s: Scent) =>
      s.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [scentsData, debouncedSearch]);

  const sortedScents = useMemo(() => {
    const sorted = [...filteredScents];
    sorted.sort((a, b) => {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    return sorted;
  }, [filteredScents, order]);

  const paginatedScents = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedScents.slice(start, start + rowsPerPage);
  }, [sortedScents, page, rowsPerPage]);

  const handleDeleteConfirm = () => {
    if (scentToDelete) deleteMutation.mutate(scentToDelete.id);
  };

  const totalItems = sortedScents.length;

  return (
    <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh sách mùi hương</h4>

          <div className="text-gray-500 text-sm">
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Sản phẩm</span>
              <Tag />{" "}
              <span className="text-[#212B36]">Danh sách mùi hương</span>
            </div>
          </div>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !rounded-xl !py-2 !font-semibold !px-6"
          onClick={() => changeTab("createUpdateScent")}
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
          placeholder="Tìm mùi hương..."
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
                    Tên hương
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedScents.map((scent) => (
                <TableRow key={scent.id}>
                  <TableCell>{scent.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setScentId?.(scent.id);
                        changeTab("createUpdateScent");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setScentToDelete(scent);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedScents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography className="text-gray-400 py-8">
                      Không có hương nào phù hợp.
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
            Tổng cộng: {totalItems} mùi hương
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
        itemName={scentToDelete?.name}
        isDeleting={deleteMutation.isLoading}
      />
    </Box>
  );
}
