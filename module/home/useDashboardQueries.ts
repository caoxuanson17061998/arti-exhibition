import ApiUser from "@api/ApiUser";
import {
  IDashboardResponse,
  LessonResponse,
  Product,
  ProductCategoryEntity,
  QuizListResponse,
} from "@app/types";
import axios from "axios";
import {useQuery} from "react-query";

export const useDashboardData = () => {
  const getDashBoard = (): Promise<IDashboardResponse> => {
    return ApiUser.getDashBoard();
  };

  return useQuery("dataUser", getDashBoard, {
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useQuizDetail = (quizId?: string) => {
  return useQuery(
    ["quizDetail", quizId],
    () => ApiUser.getQuizDetail(quizId!),
    {
      enabled: !!quizId,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
};

export const useCourseDetail = (courseId?: string) => {
  return useQuery(
    ["courseDetail", courseId],
    () => ApiUser.getCourseDetail(courseId!),
    {
      enabled: !!courseId,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
};

export const useCourseList = (params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
}) => {
  const getListCourse = (): Promise<LessonResponse> => {
    return ApiUser.listCourse(params);
  };

  return useQuery(["dataListCourse", params], getListCourse, {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true,
  });
};

export const useQuizList = (params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
  level?: string;
}) => {
  const getListQuiz = (): Promise<QuizListResponse> => {
    return ApiUser.listQuiz(params);
  };

  return useQuery(["dataListQuiz", params], getListQuiz, {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true,
  });
};

export const useProductsQuery = () => {
  return useQuery<Product[]>(
    "products",
    async () => {
      const response = await axios.get("/api/products");
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  );
};

export const useCategoriesQuery = () => {
  return useQuery<ProductCategoryEntity[]>(
    "categories",
    async () => {
      const response = await axios.get("/api/categories");
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  );
};
