import {lessonBanner} from "@app/config/images";
import Tag, {formatISODate} from "@app/utils";
import IconSearch from "@components/Icon/IconSearch";
import TagFilter from "@components/TagFilter";
import ConfirmDeleteDialog from "@components/common/ConfirmDeleteDialog";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
  Box,
  Button,
  Chip,
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
import axios from "axios";
import Image from "next/image";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";

export interface IListBlogProps {
  changeTab: (tab: string) => void;
  setPostId?: (id: string) => void;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name?: string;
    email: string;
  };
}

const STATUS_OPTIONS = [
  {label: "Đã xuất bản", value: "true"},
  {label: "Bản nháp", value: "false"},
];

const getAvatarUrl = (avatar?: string | null): string => {
  if (!avatar) {
    return lessonBanner as unknown as string;
  }

  // If avatar is a base64 data URL, return as-is
  if (avatar.startsWith("data:image/")) {
    return avatar;
  }

  // If avatar is already a full URL, extract the path and use proxy
  if (avatar.startsWith("http")) {
    try {
      const url = new URL(avatar);
      return url.pathname; // This will go through Next.js proxy
    } catch (error) {
      return lessonBanner as unknown as string;
    }
  }

  // If it's a relative path, construct it
  return avatar.startsWith("/") ? avatar : `/${avatar}`;
};

export default function ListBlog({changeTab, setPostId}: IListBlogProps) {
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [orderBy, setOrderBy] = useState<"title" | "createdAt" | "published">(
    "createdAt",
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const queryClient = useQueryClient();

  // Fetch posts from API
  const {data: postsData, isLoading: isLoadingPosts} = useQuery(
    ["posts", status],
    async () => {
      const publishedParam = status ? `?published=${status}` : "";
      const response = await axios.get(`/api/posts${publishedParam}`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const deletePostMutation = useMutation(
    async (postId: string) => {
      const response = await axios.delete(`/api/posts?id=${postId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      },
      onError: (error) => {
        console.error("Error deleting post:", error);
        alert("Có lỗi xảy ra khi xóa bài viết");
      },
    },
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Filter posts based on search and status
  const filteredPosts = useMemo(() => {
    if (!postsData) return [];

    const filtered = postsData.filter((post: Post) => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.description?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    return filtered;
  }, [postsData, debouncedSearch]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];
    sorted.sort((a, b) => {
      if (orderBy === "title") {
        return order === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (orderBy === "createdAt") {
        return order === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (orderBy === "published") {
        const aStatus = a.published ? "published" : "draft";
        const bStatus = b.published ? "published" : "draft";
        return order === "asc"
          ? aStatus.localeCompare(bStatus)
          : bStatus.localeCompare(aStatus);
      }
      return 0;
    });
    return sorted;
  }, [filteredPosts, order, orderBy]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedPosts.slice(start, end);
  }, [sortedPosts, page, rowsPerPage]);

  const totalItems = sortedPosts.length;

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status]);

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleSort = (property: "title" | "createdAt" | "published") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEditClick = (post: Post) => {
    if (setPostId) {
      setPostId(post.id);
    }
    changeTab("createUpdateBlog");
  };

  return (
    <div>
      <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
        <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Box>
            <h4 className="font-bold mb-1 text-2xl">Danh sách bài viết</h4>
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Blog</span> <Tag /> Danh sách bài
              viết
            </div>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="!bg-black !rounded-xl !py-2 !font-semibold !px-6"
            onClick={() => changeTab("createUpdateBlog")}
          >
            Thêm mới
          </Button>
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
            placeholder="Tìm kiếm..."
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
        {status && (
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
            </Box>
          </div>
        )}

        {/* Loading state */}
        {isLoadingPosts && (
          <Box className="flex justify-center items-center py-8">
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        )}

        {/* Table */}
        {!isLoadingPosts && (
          <TableContainer component={Paper} className="rounded-xl shadow-sm">
            <Table size="small">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "title"}
                      direction={orderBy === "title" ? order : "asc"}
                      onClick={() => handleSort("title")}
                      hideSortIcon={false}
                    >
                      Bài viết
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleSort("createdAt")}
                      hideSortIcon={false}
                    >
                      Ngày tạo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <TableSortLabel
                      active={orderBy === "published"}
                      direction={orderBy === "published" ? order : "asc"}
                      onClick={() => handleSort("published")}
                      hideSortIcon={false}
                    >
                      Trạng thái
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPosts.map((post) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Box className="flex items-center gap-3">
                        <Image
                          src={getAvatarUrl(post.image)}
                          alt={post.title}
                          className="!h-10 !w-10 rounded-xl flex-shrink-0"
                          width={40}
                          height={40}
                        />
                        <Box>
                          <Typography className="font-semibold text-sm md:text-base">
                            {post.title}
                          </Typography>
                          <Typography className="text-xs text-gray-500">
                            <span className="text-sm font-light">
                              Tác giả: {post.author.name || post.author.email}
                            </span>
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography className="text-xs md:text-sm">
                        {formatISODate(post.createdAt).date}
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        {formatISODate(post.createdAt).time}
                      </Typography>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {post.published ? (
                        <Chip
                          label="Đã xuất bản"
                          color="success"
                          size="small"
                          className="!bg-green-50 !text-green-700"
                        />
                      ) : (
                        <Chip
                          label="Bản nháp"
                          color="default"
                          size="small"
                          className="!bg-gray-100 !text-gray-500"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEditClick(post)}
                        size="small"
                        color="primary"
                      >
                        <DriveFileRenameOutlineIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(post)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography className="text-gray-400 py-8">
                        {isLoadingPosts ? "Đang tải..." : "Không có dữ liệu"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {!isLoadingPosts && totalItems > 0 && (
          <Box className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
            <Typography className="text-sm text-gray-500">
              Tổng cộng: {totalItems} bài viết
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={postToDelete?.title}
        isDeleting={deletePostMutation.isLoading}
      />
    </div>
  );
}
