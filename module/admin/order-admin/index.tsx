import Tag, {formatISODate} from "@app/utils";
import IconSearch from "@components/Icon/IconSearch";
import TagFilter from "@components/TagFilter";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
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
import {notification} from "antd";
import axios from "axios";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";

interface OrderItem {
  id: string;
  productId?: string;
  productName: string;
  productDescription?: string;
  productImage?: string;
  sku?: string;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  scent?: string;
  customization?: {
    // Your Design customization
    selectedColor?: string;
    selectedColorImage?: string;
    selectedScents?: string[];
    title?: string;
    logoSize?: "S" | "M" | "L" | "Nhỏ" | "Vừa" | "Lớn";
    uploadedImage?: string;
    quantity?: number;
    approved?: boolean;

    // Legacy fields
    color?: string;
    label?: string;
    text?: string;
    design?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  tax?: number;
  note?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_OPTIONS = [
  {label: "Chờ xử lý", value: "pending", color: "default"},
  {label: "Đã xác nhận", value: "confirmed", color: "info"},
  {label: "Đang giao", value: "shipped", color: "warning"},
  {label: "Đã giao", value: "delivered", color: "success"},
  {label: "Đã hủy", value: "cancelled", color: "error"},
];

export function OrderAdmin() {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<
    "orderNumber" | "createdAt" | "status" | "total"
  >("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  // Fetch orders using react-query
  const {
    data: ordersResponse,
    isLoading: loading,
    error,
    isError,
    refetch: refetchOrders,
  } = useQuery(
    "orders",
    async () => {
      const response = await axios.get("/api/orders");
      return response.data;
    },
    {
      onError: (err: any) => {
        console.error("Fetch orders error:", err);
      },
    },
  );

  const orders = ordersResponse?.data || [];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Status filter
    if (status) {
      filtered = filtered.filter((order: Order) => order.status === status);
    }

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (order: Order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower) ||
          order.customerPhone.includes(searchLower),
      );
    }

    return filtered;
  }, [orders, status, debouncedSearch]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    sorted.sort((a, b) => {
      if (orderBy === "orderNumber") {
        return order === "asc"
          ? a.orderNumber.localeCompare(b.orderNumber)
          : b.orderNumber.localeCompare(a.orderNumber);
      }
      if (orderBy === "createdAt") {
        return order === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (orderBy === "status") {
        return order === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (orderBy === "total") {
        return order === "asc" ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });
    return sorted;
  }, [filteredOrders, order, orderBy]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedOrders.slice(start, end);
  }, [sortedOrders, page, rowsPerPage]);

  const totalItems = sortedOrders.length;

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (
    property: "orderNumber" | "createdAt" | "status" | "total",
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleStatusChange = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  // Update order status using mutation
  const updateOrderStatusMutation = useMutation(
    async ({orderId, status}: {orderId: string; status: string}) => {
      console.log("Updating order status:", {orderId, status});
      console.log("Request URL:", `/api/orders?id=${orderId}`);

      const response = await axios.patch(`/api/orders?id=${orderId}`, {
        status: status,
      });

      console.log("Update response:", response.data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
        notification.success({
          message: "Cập nhật trạng thái thành công!",
        });
        handleStatusCancel();
      },
      onError: (err: any) => {
        console.error("Update status error:", err);
        notification.error({
          message: "Lỗi cập nhật trạng thái",
          description:
            err.response?.data?.message ||
            err.message ||
            "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
        });
      },
    },
  );

  const handleStatusUpdate = () => {
    if (!selectedOrder || !newStatus) return;
    updateOrderStatusMutation.mutate({
      orderId: selectedOrder.id,
      status: newStatus,
    });
  };

  const handleStatusCancel = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleDetailClose = () => {
    setDetailDialogOpen(false);
    setSelectedOrder(null);
  };

  const getStatusChip = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return (
      <Chip
        label={statusOption?.label || status}
        color={statusOption?.color as any}
        size="small"
        variant="filled"
      />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography>Đang tải đơn hàng...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex flex-col items-center justify-center h-64 gap-4">
        <Typography color="error">
          Lỗi: {error instanceof Error ? error.message : "Có lỗi xảy ra"}
        </Typography>
        <Button onClick={() => refetchOrders()} variant="contained">
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
        <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Box>
            <h4 className="font-bold mb-1 text-2xl">Quản lý đơn hàng</h4>
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Đơn hàng</span> <Tag /> Danh sách
              đơn hàng
            </div>
          </Box>
        </Box>

        {/* Filter bar */}
        <Paper
          className="flex flex-col md:flex-row md:items-center gap-2 py-3 mb-4 bg-gray-50"
          elevation={0}
        >
          <FormControl className="w-full md:w-48">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Trạng thái"
              size="medium"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {STATUS_OPTIONS.map((st) => (
                <MenuItem key={st.value} value={st.value}>
                  {st.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <OutlinedInput
            className="w-full md:w-72"
            size="medium"
            placeholder="Tìm kiếm đơn hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            }
          />
        </Paper>

        {/* Filter tags */}
        {(status || debouncedSearch) && (
          <div className="flex flex-col gap-2 mb-3">
            <Typography className="text-sm mr-2">
              {totalItems}{" "}
              <span className="text-[#637381]"> kết quả được tìm thấy</span>
            </Typography>
            <Box className="flex flex-wrap gap-2 mb-2 items-center">
              {status && (
                <TagFilter
                  label="Trạng thái"
                  value={STATUS_OPTIONS.find((s) => s.value === status)?.label}
                  onClick={() => setStatus("")}
                />
              )}
              {debouncedSearch && (
                <TagFilter
                  label="Tìm kiếm"
                  value={debouncedSearch}
                  onClick={() => setSearch("")}
                />
              )}
            </Box>
          </div>
        )}

        {/* Table */}
        <TableContainer component={Paper} className="rounded-xl shadow-sm">
          <Table size="small">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>STT</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "orderNumber"}
                    direction={orderBy === "orderNumber" ? order : "asc"}
                    onClick={() => handleSort("orderNumber")}
                    hideSortIcon={false}
                  >
                    Mã đơn hàng
                  </TableSortLabel>
                </TableCell>
                <TableCell>Thông tin khách hàng</TableCell>
                <TableCell>Địa chỉ giao hàng</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "total"}
                    direction={orderBy === "total" ? order : "asc"}
                    onClick={() => handleSort("total")}
                    hideSortIcon={false}
                  >
                    Tổng tiền
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleSort("createdAt")}
                    hideSortIcon={false}
                  >
                    Ngày đặt
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleSort("status")}
                    hideSortIcon={false}
                  >
                    Trạng thái
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order: Order, index: number) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography className="font-medium">
                      {page * rowsPerPage + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className="font-semibold text-sm md:text-base">
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography className="font-medium text-sm">
                        {order.customerName}
                      </Typography>
                      <Typography className="text-xs text-gray-500">
                        {order.customerEmail}
                      </Typography>
                      <Typography className="text-xs text-gray-500">
                        {order.customerPhone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography className="text-xs text-gray-600 max-w-[200px] truncate">
                      {order.shippingAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {order.items
                        .slice(0, 2)
                        .map((item: OrderItem, index: number) => (
                          <Typography
                            key={index}
                            className="text-xs md:text-sm"
                          >
                            {item.productName} x{item.quantity}
                          </Typography>
                        ))}
                      {order.items.length > 2 && (
                        <Typography className="text-xs text-gray-500">
                          +{order.items.length - 2} sản phẩm khác
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography className="text-xs text-gray-600">
                        {order.paymentMethod === "cod"
                          ? "COD"
                          : order.paymentMethod === "bank_transfer"
                          ? "Chuyển khoản"
                          : order.paymentMethod}
                      </Typography>
                      <Typography className="text-xs text-gray-500">
                        {order.shippingMethod === "standard"
                          ? "Tiêu chuẩn"
                          : order.shippingMethod === "express"
                          ? "Nhanh"
                          : order.shippingMethod}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography className="font-medium text-sm md:text-base">
                      {formatPrice(order.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className="text-xs md:text-sm">
                      {formatISODate(order.createdAt).date}
                    </Typography>
                    <Typography className="text-xs text-gray-400">
                      {formatISODate(order.createdAt).time}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell align="right">
                    <Box className="flex gap-1">
                      <IconButton
                        onClick={() => handleViewDetail(order)}
                        size="small"
                        color="info"
                        title="Xem chi tiết"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      </IconButton>
                      <IconButton
                        onClick={() => handleStatusChange(order)}
                        size="small"
                        color="primary"
                        title="Thay đổi trạng thái"
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography className="text-gray-400 py-8">
                      {orders.length === 0
                        ? "Chưa có đơn hàng nào"
                        : "Không có dữ liệu phù hợp"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalItems > 0 && (
          <Box className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
            <Typography component="div" className="text-sm text-gray-500">
              Hàng mỗi trang:
              <Select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                size="small"
                className="!ml-2 !w-16"
              >
                {[5, 10, 20].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
              <span className="ml-2">
                {page * rowsPerPage + 1} -
                {Math.min((page + 1) * rowsPerPage, totalItems)} của{" "}
                {totalItems}
              </span>
            </Typography>
            <TablePagination
              component="div"
              count={totalItems}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20]}
              labelRowsPerPage=""
              className="!p-0"
            />
          </Box>
        )}
      </Box>

      {/* Status Change Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleStatusCancel}
        aria-labelledby="status-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="status-dialog-title">
          Thay đổi trạng thái đơn hàng
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-4">
            Thay đổi trạng thái cho đơn hàng:{" "}
            <strong>{selectedOrder?.orderNumber}</strong>
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Trạng thái mới</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Trạng thái mới"
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusCancel} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleStatusUpdate}
            color="primary"
            variant="contained"
            disabled={
              !newStatus ||
              newStatus === selectedOrder?.status ||
              updateOrderStatusMutation.isLoading
            }
          >
            {updateOrderStatusMutation.isLoading
              ? "Đang cập nhật..."
              : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleDetailClose}
        aria-labelledby="detail-dialog-title"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="detail-dialog-title" className="pb-2">
          <Box className="flex items-center justify-between">
            <Typography className="text-xl font-bold">
              Chi tiết đơn hàng: {selectedOrder?.orderNumber}
            </Typography>
            <Box className="flex items-center gap-2">
              {selectedOrder && getStatusChip(selectedOrder.status)}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent className="!pt-4">
          {selectedOrder && (
            <Box className="space-y-6">
              {/* Order Summary */}
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <Box className="text-center">
                  <Typography className="text-sm text-gray-600">
                    ID Đơn hàng
                  </Typography>
                  <Typography className="font-semibold text-gray-800">
                    {selectedOrder.id}
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography className="text-sm text-gray-600">
                    Ngày đặt hàng
                  </Typography>
                  <Typography className="font-semibold text-gray-800">
                    {formatISODate(selectedOrder.createdAt).date}
                  </Typography>
                  <Typography className="text-xs text-gray-500">
                    {formatISODate(selectedOrder.createdAt).time}
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography className="text-sm text-gray-600">
                    Tổng giá trị
                  </Typography>
                  <Typography className="font-bold text-lg text-blue-600">
                    {formatPrice(selectedOrder.total)}
                  </Typography>
                </Box>
              </Box>

              <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Box>
                  <Typography className="font-semibold mb-3 text-lg text-gray-800 border-b pb-2">
                    👤 Thông tin khách hàng
                  </Typography>
                  <Box className="space-y-3">
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-20 flex-shrink-0">
                        Họ tên:
                      </Typography>
                      <Typography className="font-medium">
                        {selectedOrder.customerName}
                      </Typography>
                    </Box>
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-20 flex-shrink-0">
                        Email:
                      </Typography>
                      <Typography className="break-all">
                        {selectedOrder.customerEmail}
                      </Typography>
                    </Box>
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-20 flex-shrink-0">
                        SĐT:
                      </Typography>
                      <Typography className="font-medium">
                        {selectedOrder.customerPhone}
                      </Typography>
                    </Box>
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-20 flex-shrink-0">
                        Địa chỉ:
                      </Typography>
                      <Typography className="break-words">
                        {selectedOrder.shippingAddress}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Order Information */}
                <Box>
                  <Typography className="font-semibold mb-3 text-lg text-gray-800 border-b pb-2">
                    📋 Thông tin đơn hàng
                  </Typography>
                  <Box className="space-y-3">
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-24 flex-shrink-0">
                        Mã đơn:
                      </Typography>
                      <Typography className="font-medium">
                        {selectedOrder.orderNumber}
                      </Typography>
                    </Box>
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-24 flex-shrink-0">
                        Trạng thái:
                      </Typography>
                      <Box>{getStatusChip(selectedOrder.status)}</Box>
                    </Box>
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-24 flex-shrink-0">
                        Thanh toán:
                      </Typography>
                      <Typography>
                        {selectedOrder.paymentMethod === "cod"
                          ? "💰 Thanh toán khi nhận hàng (COD)"
                          : selectedOrder.paymentMethod === "bank_transfer"
                          ? "🏦 Chuyển khoản ngân hàng"
                          : selectedOrder.paymentMethod === "credit_card"
                          ? "💳 Thẻ tín dụng"
                          : selectedOrder.paymentMethod === "e_wallet"
                          ? "📱 Ví điện tử"
                          : selectedOrder.paymentMethod}
                      </Typography>
                    </Box>
                    <Box className="flex items-start gap-3">
                      <Typography className="text-sm text-gray-600 w-24 flex-shrink-0">
                        Vận chuyển:
                      </Typography>
                      <Typography>
                        {selectedOrder.shippingMethod === "standard"
                          ? "🚚 Giao hàng tiêu chuẩn"
                          : selectedOrder.shippingMethod === "express"
                          ? "⚡ Giao hàng nhanh"
                          : selectedOrder.shippingMethod === "same_day"
                          ? "🚀 Giao hàng trong ngày"
                          : selectedOrder.shippingMethod}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Products */}
              <Box>
                <Typography className="font-semibold mb-3 text-lg text-gray-800 border-b pb-2">
                  🛍️ Sản phẩm đặt hàng ({selectedOrder.items.length} sản phẩm)
                </Typography>
                <Box className="space-y-4">
                  {selectedOrder.items.map((item: OrderItem, index: number) => (
                    <Paper
                      key={index}
                      className="p-4 shadow-sm border border-gray-200"
                    >
                      <Box className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Product Image and Basic Info */}
                        <Box className="lg:col-span-1">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                          ) : (
                            <Box className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                              <Typography className="text-gray-500 text-sm">
                                Không có ảnh
                              </Typography>
                            </Box>
                          )}
                          <Typography className="font-semibold text-sm text-blue-600">
                            #{index + 1} -{" "}
                            {item.sku ||
                              item.id ||
                              `SP${String(index + 1).padStart(3, "0")}`}
                          </Typography>
                        </Box>

                        {/* Product Details */}
                        <Box className="lg:col-span-2">
                          <Typography className="font-bold text-lg text-gray-800 mb-2">
                            {item.productName}
                          </Typography>

                          {item.productDescription && (
                            <Typography className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {item.productDescription}
                            </Typography>
                          )}

                          <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Basic Properties */}
                            {(item.category ||
                              item.brand ||
                              item.material ||
                              item.scent) && (
                              <Box>
                                <Typography className="font-semibold text-sm text-gray-700 mb-2">
                                  📦 Thông tin cơ bản
                                </Typography>
                                <Box className="space-y-1">
                                  {item.category && (
                                    <Typography className="text-xs text-gray-600">
                                      • Danh mục:{" "}
                                      <span className="font-medium">
                                        {item.category}
                                      </span>
                                    </Typography>
                                  )}
                                  {item.brand && (
                                    <Typography className="text-xs text-gray-600">
                                      • Thương hiệu:{" "}
                                      <span className="font-medium">
                                        {item.brand}
                                      </span>
                                    </Typography>
                                  )}
                                  {item.material && (
                                    <Typography className="text-xs text-gray-600">
                                      • Chất liệu:{" "}
                                      <span className="font-medium">
                                        {item.material}
                                      </span>
                                    </Typography>
                                  )}
                                  {item.scent && (
                                    <Typography className="text-xs text-gray-600">
                                      • Hương thơm:{" "}
                                      <span className="font-medium">
                                        {item.scent}
                                      </span>
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            )}

                            {/* Physical Properties */}
                            {(item.color ||
                              item.size ||
                              item.weight ||
                              item.dimensions) && (
                              <Box>
                                <Typography className="font-semibold text-sm text-gray-700 mb-2">
                                  📏 Thông số kỹ thuật
                                </Typography>
                                <Box className="space-y-1">
                                  {item.color && (
                                    <Typography className="text-xs text-gray-600">
                                      • Màu sắc:{" "}
                                      <span className="font-medium">
                                        {item.color}
                                      </span>
                                    </Typography>
                                  )}
                                  {item.size && (
                                    <Typography className="text-xs text-gray-600">
                                      • Kích thước:{" "}
                                      <span className="font-medium">
                                        {item.size}
                                      </span>
                                    </Typography>
                                  )}
                                  {item.weight && (
                                    <Typography className="text-xs text-gray-600">
                                      • Trọng lượng:{" "}
                                      <span className="font-medium">
                                        {item.weight}g
                                      </span>
                                    </Typography>
                                  )}
                                  {item.dimensions && (
                                    <Typography className="text-xs text-gray-600">
                                      • Chi tiết:{" "}
                                      <span className="font-medium">
                                        {item.dimensions}
                                      </span>
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            )}
                          </Box>

                          {/* Customization */}
                          {item.customization && (
                            <Box className="mt-3 border-2 border-purple-200 rounded-lg overflow-hidden">
                              <Box className="bg-purple-100 p-3 border-b border-purple-200">
                                <Typography className="font-bold text-base text-purple-800 flex items-center gap-2">
                                  🎨 THIẾT KẾ TÙY CHỈNH - QUAN TRỌNG!
                                </Typography>
                                <Typography className="text-xs text-purple-600 mt-1">
                                  ⚠️ Admin cần thực hiện chính xác theo yêu cầu
                                  dưới đây
                                </Typography>
                              </Box>

                              <Box className="p-4 bg-white space-y-4">
                                {/* Your Design Customization */}
                                {(item.customization.selectedColor ||
                                  item.customization.selectedScents ||
                                  item.customization.title) && (
                                  <Box>
                                    <Typography className="font-semibold text-sm text-purple-700 mb-3 flex items-center gap-2">
                                      🕯️ Thiết kế từ Your Design
                                    </Typography>

                                    {/* Product Color */}
                                    {item.customization.selectedColor && (
                                      <Box className="mb-3 p-3 bg-purple-50 rounded-lg">
                                        <Typography className="font-semibold text-xs text-purple-700 mb-2">
                                          1️⃣ MÀU SẢN PHẨM:
                                        </Typography>
                                        <Box className="flex items-center gap-3">
                                          {item.customization
                                            .selectedColorImage && (
                                            <Box className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-purple-300">
                                              <img
                                                src={
                                                  item.customization
                                                    .selectedColorImage
                                                }
                                                alt={
                                                  item.customization
                                                    .selectedColor
                                                }
                                                className="w-full h-full object-cover"
                                              />
                                            </Box>
                                          )}
                                          <Typography className="font-bold text-purple-800">
                                            {item.customization.selectedColor}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    )}

                                    {/* Scents */}
                                    {item.customization.selectedScents &&
                                      item.customization.selectedScents.length >
                                        0 && (
                                        <Box className="mb-3 p-3 bg-purple-50 rounded-lg">
                                          <Typography className="font-semibold text-xs text-purple-700 mb-2">
                                            2️⃣ MÙI HƯƠNG (
                                            {
                                              item.customization.selectedScents
                                                .length
                                            }
                                            /3):
                                          </Typography>
                                          <Box className="flex flex-wrap gap-2">
                                            {item.customization.selectedScents.map(
                                              (
                                                scent: string,
                                                scentIndex: number,
                                              ) => (
                                                <Chip
                                                  key={scentIndex}
                                                  label={scent}
                                                  size="small"
                                                  className="!bg-purple-200 !text-purple-800 !font-medium"
                                                />
                                              ),
                                            )}
                                          </Box>
                                        </Box>
                                      )}

                                    {/* Label Design */}
                                    {(item.customization.title ||
                                      item.customization.logoSize ||
                                      item.customization.uploadedImage) && (
                                      <Box className="mb-3 p-3 bg-purple-50 rounded-lg">
                                        <Typography className="font-semibold text-xs text-purple-700 mb-2">
                                          3️⃣ THIẾT KẾ NHÃN:
                                        </Typography>
                                        <Box className="space-y-2">
                                          {item.customization.title && (
                                            <Box className="flex items-start gap-2">
                                              <Typography className="text-xs text-purple-600 min-w-[80px]">
                                                📝 Nội dung:
                                              </Typography>
                                              <Typography className="text-xs font-bold text-purple-800 bg-white px-2 py-1 rounded border">
                                                {item.customization.title}
                                              </Typography>
                                            </Box>
                                          )}
                                          {item.customization.logoSize && (
                                            <Box className="flex items-center gap-2">
                                              <Typography className="text-xs text-purple-600 min-w-[80px]">
                                                📏 Size logo:
                                              </Typography>
                                              <Chip
                                                label={
                                                  item.customization
                                                    .logoSize === "S"
                                                    ? "Nhỏ"
                                                    : item.customization
                                                        .logoSize === "M"
                                                    ? "Vừa"
                                                    : item.customization
                                                        .logoSize === "L"
                                                    ? "Lớn"
                                                    : item.customization
                                                        .logoSize
                                                }
                                                size="small"
                                                color={
                                                  item.customization
                                                    .logoSize === "S" ||
                                                  item.customization
                                                    .logoSize === "Nhỏ"
                                                    ? "default"
                                                    : item.customization
                                                        .logoSize === "M" ||
                                                      item.customization
                                                        .logoSize === "Vừa"
                                                    ? "primary"
                                                    : "secondary"
                                                }
                                              />
                                            </Box>
                                          )}
                                          {item.customization.uploadedImage && (
                                            <Box className="flex items-start gap-2">
                                              <Typography className="text-xs text-purple-600 min-w-[80px]">
                                                🖼️ Ảnh upload:
                                              </Typography>
                                              <Box className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-purple-300">
                                                <img
                                                  src={
                                                    item.customization
                                                      .uploadedImage
                                                  }
                                                  alt="Custom uploaded"
                                                  className="w-full h-full object-cover"
                                                />
                                              </Box>
                                            </Box>
                                          )}
                                        </Box>
                                      </Box>
                                    )}

                                    {/* Additional Info */}
                                    <Box className="flex items-center justify-between p-2 bg-purple-100 rounded-lg">
                                      {item.customization.quantity && (
                                        <Typography className="text-xs text-purple-700">
                                          🔢 SL tùy chỉnh:{" "}
                                          <span className="font-bold">
                                            {item.customization.quantity}
                                          </span>
                                        </Typography>
                                      )}
                                      {item.customization.approved && (
                                        <Chip
                                          label="✅ Đã phê duyệt"
                                          size="small"
                                          className="!bg-green-200 !text-green-800"
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                )}

                                {/* Legacy Customization */}
                                {(item.customization.color ||
                                  item.customization.label ||
                                  item.customization.text ||
                                  item.customization.design) && (
                                  <Box className="border-t border-purple-200 pt-3">
                                    <Typography className="font-semibold text-xs text-purple-700 mb-2">
                                      🔧 Tùy chỉnh khác:
                                    </Typography>
                                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {item.customization.color && (
                                        <Typography className="text-xs text-purple-600">
                                          • Màu:{" "}
                                          <span className="font-medium">
                                            {item.customization.color}
                                          </span>
                                        </Typography>
                                      )}
                                      {item.customization.label && (
                                        <Typography className="text-xs text-purple-600">
                                          • Nhãn:{" "}
                                          <span className="font-medium">
                                            {item.customization.label}
                                          </span>
                                        </Typography>
                                      )}
                                      {item.customization.text && (
                                        <Typography className="text-xs text-purple-600">
                                          • Text:{" "}
                                          <span className="font-medium">
                                            {item.customization.text}
                                          </span>
                                        </Typography>
                                      )}
                                      {item.customization.design && (
                                        <Typography className="text-xs text-purple-600">
                                          • Design:{" "}
                                          <span className="font-medium">
                                            {item.customization.design}
                                          </span>
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          )}

                          {/* Notes */}
                          {item.note && (
                            <Box className="mt-3 p-3 bg-yellow-50 rounded-lg">
                              <Typography className="font-semibold text-sm text-yellow-700 mb-1">
                                📝 Ghi chú
                              </Typography>
                              <Typography className="text-xs text-yellow-600">
                                {item.note}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Pricing and Quantity */}
                        <Box className="lg:col-span-1">
                          <Box className="bg-gray-50 p-4 rounded-lg h-full">
                            <Typography className="font-semibold text-sm text-gray-700 mb-3 text-center">
                              💰 Thông tin giá
                            </Typography>

                            <Box className="space-y-3">
                              <Box className="text-center">
                                <Typography className="text-xs text-gray-500">
                                  Số lượng
                                </Typography>
                                <Chip
                                  label={`${item.quantity} cái`}
                                  color="primary"
                                  variant="filled"
                                  size="small"
                                  className="!mt-1"
                                />
                              </Box>

                              <Box className="text-center">
                                <Typography className="text-xs text-gray-500">
                                  Đơn giá
                                </Typography>
                                <Typography className="font-semibold text-gray-800">
                                  {formatPrice(item.unitPrice)}
                                </Typography>
                              </Box>

                              {item.discount && item.discount > 0 && (
                                <Box className="text-center">
                                  <Typography className="text-xs text-gray-500">
                                    Giảm giá
                                  </Typography>
                                  <Typography className="font-medium text-red-600">
                                    -{formatPrice(item.discount)}
                                  </Typography>
                                </Box>
                              )}

                              {item.tax && item.tax > 0 && (
                                <Box className="text-center">
                                  <Typography className="text-xs text-gray-500">
                                    Thuế
                                  </Typography>
                                  <Typography className="font-medium text-gray-600">
                                    +{formatPrice(item.tax)}
                                  </Typography>
                                </Box>
                              )}

                              <hr className="border-gray-300" />

                              <Box className="text-center">
                                <Typography className="text-xs text-gray-500">
                                  Thành tiền
                                </Typography>
                                <Typography className="font-bold text-lg text-blue-600">
                                  {formatPrice(item.totalPrice)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))}

                  {/* Order Total */}
                  <Paper className="p-4 bg-blue-50 border-2 border-blue-200">
                    <Box className="flex justify-between items-center">
                      <Box>
                        <Typography className="font-semibold text-gray-700">
                          Tổng đơn hàng (
                          {selectedOrder.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          sản phẩm)
                        </Typography>
                        <Typography className="text-sm text-gray-600">
                          Gồm {selectedOrder.items.length} loại sản phẩm khác
                          nhau
                        </Typography>
                      </Box>
                      <Typography className="font-bold text-2xl text-blue-600">
                        {formatPrice(selectedOrder.total)}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>

              {/* Additional Information */}
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <Box>
                  <Typography className="font-semibold text-sm text-gray-700 mb-1">
                    📊 Thống kê đơn hàng
                  </Typography>
                  <Typography className="text-xs text-gray-600">
                    • Tổng số sản phẩm:{" "}
                    {selectedOrder.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    )}{" "}
                    món
                  </Typography>
                  <Typography className="text-xs text-gray-600">
                    • Số loại sản phẩm: {selectedOrder.items.length} loại
                  </Typography>
                  <Typography className="text-xs text-gray-600">
                    • Giá trung bình:{" "}
                    {formatPrice(
                      selectedOrder.total /
                        selectedOrder.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        ),
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography className="font-semibold text-sm text-gray-700 mb-1">
                    ⏰ Thời gian
                  </Typography>
                  <Typography className="text-xs text-gray-600">
                    • Ngày đặt: {formatISODate(selectedOrder.createdAt).date}
                  </Typography>
                  <Typography className="text-xs text-gray-600">
                    • Giờ đặt: {formatISODate(selectedOrder.createdAt).time}
                  </Typography>
                  <Typography className="text-xs text-gray-600">
                    • Đã qua:{" "}
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(selectedOrder.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    ngày
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="!p-4 !pt-2 border-t">
          <Button
            onClick={handleDetailClose}
            color="primary"
            variant="outlined"
          >
            Đóng
          </Button>
          <Button
            onClick={() => {
              handleDetailClose();
              handleStatusChange(selectedOrder!);
            }}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            disabled={updateOrderStatusMutation.isLoading}
          >
            Cập nhật trạng thái
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
