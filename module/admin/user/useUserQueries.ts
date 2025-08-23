import axios from "axios";
import {useQuery} from "react-query";

export const useListUserData = (params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  role?: string;
}) => {
  const listUser = async () => {
    // Build query string
    const searchParams = new URLSearchParams();

    if (params?.keyword && params.keyword.trim()) {
      searchParams.append("keyword", params.keyword.trim());
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.perPage) {
      searchParams.append("perPage", params.perPage.toString());
    }
    if (params?.role && params.role.trim()) {
      searchParams.append("role", params.role.trim());
    }

    const queryString = searchParams.toString();
    const url = `/api/users${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get(url);
    return response.data;
  };

  return useQuery(["dataListUser", params], listUser, {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
