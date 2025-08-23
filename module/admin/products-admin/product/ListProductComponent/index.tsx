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
import Image from "next/image";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  thumbnailUrl?: string;
  colors: {color: {id: string; name: string; hexCode: string}}[];
  sizes: {size: {id: string; name: string}}[];
  categories: {category: {id: string; name: string}}[];
}

interface ListProductProps {
  changeTab: (tab: string) => void;
  setProductId?: (id: string) => void;
}

export default function ListProductComponent({
  changeTab,
  setProductId,
}: ListProductProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<"name" | "salePrice">("name");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const queryClient = useQueryClient();

  const {data: productsData, isLoading} = useQuery<Product[]>(
    ["products"],
    async () => {
      const res = await axios.get("/api/products");
      return res.data;
    },
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      const res = await axios.delete(`/api/products?id=${id}`);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("products");
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      },
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredProducts = useMemo(() => {
    if (!productsData) return [];
    if (!debouncedSearch) return productsData;
    return productsData.filter((p: Product) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [productsData, debouncedSearch]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      const valueA = orderBy === "name" ? a.name : a.salePrice;
      const valueB = orderBy === "name" ? b.name : b.salePrice;

      if (typeof valueA === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB as string)
          : (valueB as string).localeCompare(valueA);
      }
      return order === "asc"
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });
    return sorted;
  }, [filteredProducts, order, orderBy]);

  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedProducts.slice(start, start + rowsPerPage);
  }, [sortedProducts, page, rowsPerPage]);

  const handleDeleteConfirm = () => {
    if (productToDelete) deleteMutation.mutate(productToDelete.id);
  };

  const totalItems = sortedProducts.length;

  return (
    <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Box>
          <div className="text-gray-500 text-sm">
            <div className="font-bold text-2xl">Danh sách sản phẩm</div>
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Sản phẩm</span>
              <Tag /> <span className="text-[#212B36]">Danh sách sản phẩm</span>
            </div>
          </div>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !rounded-xl !py-2 !font-semibold !px-6"
          onClick={() => changeTab("createUpdateProduct")}
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
          placeholder="Tìm sản phẩm..."
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
                <TableCell>Ảnh</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={order}
                    onClick={() => {
                      setOrderBy("name");
                      setOrder(order === "asc" ? "desc" : "asc");
                    }}
                  >
                    Tên sản phẩm
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "salePrice"}
                    direction={order}
                    onClick={() => {
                      setOrderBy("salePrice");
                      setOrder(order === "asc" ? "desc" : "asc");
                    }}
                  >
                    Giá bán
                  </TableSortLabel>
                </TableCell>
                <TableCell>Màu sắc</TableCell>
                <TableCell>Kích thước</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.thumbnailUrl ? (
                      <Box
                        sx={{
                          position: "relative",
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={product.thumbnailUrl}
                          alt={product.name}
                          fill
                          sizes="48px"
                          style={{objectFit: "cover"}}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          backgroundColor: "#f0f0f0",
                        }}
                      />
                    )}
                  </TableCell>

                  <TableCell>{product.name}</TableCell>

                  <TableCell>
                    <span className="font-medium text-red-500">
                      {product.salePrice.toLocaleString()}₫
                    </span>
                    {product.salePrice !== product.originalPrice && (
                      <span className="ml-2 line-through text-gray-400 text-sm">
                        {product.originalPrice.toLocaleString()}₫
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Box className="flex flex-wrap gap-1">
                      {product.colors.map((c) => (
                        <Box
                          key={c.color.id}
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: c.color.hexCode,
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                          }}
                          title={c.color.name}
                        />
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box className="flex flex-wrap gap-1">
                      {product.sizes.map((s) => (
                        <Box
                          key={s.size.id}
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {s.size.name}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box className="flex flex-wrap gap-1">
                      {product.categories.map((cat) => (
                        <Box
                          key={cat.category.id}
                          className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded"
                        >
                          {cat.category.name}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setProductId?.(product.id);
                        changeTab("createUpdateProduct");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setProductToDelete(product);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography className="text-gray-400 py-8">
                      Không có sản phẩm nào phù hợp.
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
            Tổng cộng: {totalItems} sản phẩm
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
        itemName={productToDelete?.name}
        isDeleting={deleteMutation.isLoading}
      />
    </Box>
  );
}
