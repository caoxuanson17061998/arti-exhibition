"use client";

import ApiUser, {ICreateCourseData} from "@api/ApiUser";
import Tag from "@app/utils";
import CKEditorWrapper from "@components/CKEditorWrapper";
import {yupResolver} from "@hookform/resolvers/yup";
import ModalAddQuestion from "@module/admin/study/list/ModalAddQuestion";
import {useCategory} from "@module/admin/study/useStudyQueries";
import {useCourseDetail} from "@module/home/useDashboardQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardMedia,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import * as yup from "yup";

// Default placeholder image (a simple gray rectangle SVG data URL)
const DEFAULT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQzMCIgdmlld0JveD0iMCAwIDcwMCA0MzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDMwIiBmaWxsPSIjRjNGNEY2Ii8+Cjxzdmcgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMzE4IiB5PSIxODMiPgo8cGF0aCBkPSJNNTYgNDhWMTZDNTYgMTMuNzkgNTQuMjEgMTIgNTIgMTJIMTJDOS43OSAxMiA4IDEzLjc5IDggMTZWNDhDOCA1MC4yMSA5Ljc5IDUyIDEyIDUySDUyQzU0LjIxIDUyIDU2IDUwLjIxIDU2IDQ4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTYgMzJDMTkuMzEzNyAzMiAyMiAyOS4zMTM3IDIyIDI2QzIyIDIyLjY4NjMgMTkuMzEzNyAyMCAxNiAyMEMxMi42ODYzIDIwIDEwIDIyLjY4NjMgMTAgMjZDMTAgMjkuMzEzNyAxMi42ODYzIDMyIDE2IDMyWiIgZmlsbD0iIzY3NzQ4QyIvPgo8cGF0aCBkPSJNOCA0OEw4IDQwTDE2IDMyTDI0IDQwSDMyTDQ4IDI0TDU2IDMyVjQ4SDhaIiBmaWxsPSIjNjc3NDhDIi8+Cjwvc3ZnPgo8L3N2Zz4K";

// Helper function to get image URL and handle CORS issues
const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  // If it's a base64 data URL or blob URL (from file upload), use as is
  if (image.startsWith("data:") || image.startsWith("blob:")) {
    return image;
  }

  // If image is already a full URL, extract the path and use proxy
  if (image.startsWith("http")) {
    try {
      const url = new URL(image);
      return url.pathname; // This will go through Next.js proxy
    } catch (error) {
      console.warn("Invalid image URL:", image);
      return DEFAULT_IMAGE_PLACEHOLDER;
    }
  }

  // If it's a relative path, construct it
  return image.startsWith("/") ? image : `/${image}`;
};

// Form validation schema
const schema = yup.object({
  title: yup.string().required("Tiêu đề không được bỏ trống"),
  description: yup.string().required("Mô tả không được bỏ trống"),
  content: yup.string().required("Nội dung không được bỏ trống"),
  categoryId: yup.number().required("Danh mục không được bỏ trống"),
  isActive: yup.boolean().required(),
  quizzes: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required(),
        questions: yup
          .array()
          .of(
            yup.object({
              text: yup.string().required(),
              isMultiple: yup.boolean().required(),
              explanation: yup.string().notRequired(),
              answers: yup
                .array()
                .of(
                  yup.object({
                    text: yup.string().required(),
                    isCorrect: yup.boolean().required(),
                  }),
                )
                .required(),
            }),
          )
          .required(),
      }),
    )
    .required(),
});

type CourseFormData = yup.InferType<typeof schema>;

interface CreateUpdateLessonProps {
  changeTab?: (tab: string) => void;
  courseId?: string;
}

export default function CreateUpdateLesson({
  changeTab,
  courseId,
}: CreateUpdateLessonProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{
    data: any;
    questionIndex?: number;
    isNewQuestion?: boolean;
  } | null>(null);

  const queryClient = useQueryClient();

  // Load course detail if editing
  const {data: courseDetail, isLoading: isLoadingCourseDetail} =
    useCourseDetail(courseId);

  // Load categories
  const {data: categoriesData, isLoading: isLoadingCategories} =
    useCategory(undefined);

  const createCourseMutation = useMutation(ApiUser.createCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries("dataListCourse");
      if (changeTab) {
        changeTab("listLesson");
      }
    },
    onError: (error) => {
      console.error("Error creating course:", error);
    },
  });

  const updateCourseMutation = useMutation(
    (variables: {id: string; data: ICreateCourseData | FormData}) =>
      ApiUser.updateCourse(variables.id, variables.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dataListCourse");
        queryClient.invalidateQueries(["courseDetail", courseId]);
        if (changeTab) {
          changeTab("listLesson");
        }
      },
      onError: (error) => {
        console.error("Error updating course:", error);
      },
    },
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
    reset,
  } = useForm<CourseFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      categoryId: 0,
      isActive: false,
      quizzes: [],
    },
  });

  // Transform API data to form format
  const transformApiDataToForm = (apiData: any): CourseFormData => {
    return {
      title: apiData.title || "",
      description: apiData.description || "",
      content: apiData.content || "",
      categoryId: apiData.categoryId || 0,
      isActive: apiData.status === "published",
      quizzes: apiData.quizzes || [],
    };
  };

  // Reset form when API data is loaded
  useEffect(() => {
    if (courseDetail && !isLoadingCourseDetail) {
      const formData = transformApiDataToForm(courseDetail);
      reset(formData);

      // Set preview image from backend if exists and reset selected file
      setSelectedFile(null);
      if (courseDetail.image) {
        setPreviewImage(courseDetail.image);
      } else {
        setPreviewImage(null);
      }
    }
  }, [courseDetail, isLoadingCourseDetail, reset]);

  const onSubmit = (data: CourseFormData) => {
    if (courseId) {
      // Update existing course with file upload support
      if (selectedFile) {
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("content", data.content || "");
        formData.append("categoryId", data.categoryId.toString());
        formData.append("status", data.isActive ? "published" : "draft");
        formData.append("image", selectedFile);

        // Convert quizzes to questions format for BE
        if (data.quizzes && data.quizzes.length > 0) {
          const questions = data.quizzes.flatMap((quiz) => quiz.questions);
          formData.append("questions", JSON.stringify(questions));
        }

        updateCourseMutation.mutate({id: courseId, data: formData});
      } else {
        // Update without image
        const courseData: ICreateCourseData = {
          title: data.title,
          description: data.description || "",
          content: data.content || "",
          categoryId: data.categoryId,
          status: data.isActive ? "published" : "draft",
          quizzes: data.quizzes || [],
        };
        updateCourseMutation.mutate({id: courseId, data: courseData});
      }
    } else {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("content", data.content || "");
        formData.append("categoryId", data.categoryId.toString());
        formData.append("status", data.isActive ? "published" : "draft");
        formData.append("image", selectedFile);

        if (data.quizzes && data.quizzes.length > 0) {
          const questions = data.quizzes.flatMap((quiz) => quiz.questions);
          formData.append("questions", JSON.stringify(questions));
        }

        createCourseMutation.mutate(formData);
      } else {
        const courseData: ICreateCourseData = {
          title: data.title,
          description: data.description || "",
          content: data.content || "",
          categoryId: data.categoryId,
          status: data.isActive ? "published" : "draft",
          quizzes: data.quizzes || [],
        };
        createCourseMutation.mutate(courseData);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    // Reset to original image from backend or null
    if (courseDetail?.image) {
      setPreviewImage(courseDetail.image);
    } else {
      setPreviewImage(null);
    }
  };

  const quizzes = watch("quizzes") || [];
  const currentQuiz = quizzes[0] || null; // Luôn làm việc với quiz đầu tiên

  const removeQuestion = (questionIndex: number) => {
    if (!currentQuiz) return;
    const newQuizzes = [...quizzes];
    newQuizzes[0].questions.splice(questionIndex, 1);
    setValue("quizzes", newQuizzes);
  };

  const handleAddQuiz = (data: any) => {
    setIsModalOpen(false);
    const newQuestion = {
      text: data.nameQuestion || "",
      isMultiple: false,
      explanation: data.explanation || "",
      answers: [
        {text: data.answerA || "", isCorrect: data.correctAnswer === "A"},
        {text: data.answerB || "", isCorrect: data.correctAnswer === "B"},
        {text: data.answerC || "", isCorrect: data.correctAnswer === "C"},
        {text: data.answerD || "", isCorrect: data.correctAnswer === "D"},
      ],
    };

    if (editingQuiz !== null) {
      if (editingQuiz.questionIndex !== undefined) {
        // Edit question existing
        const newQuizzes = [...quizzes];
        newQuizzes[0].questions[editingQuiz.questionIndex] = newQuestion;
        setValue("quizzes", newQuizzes);
      } else {
        // Thêm question mới vào quiz hiện có hoặc tạo quiz mới
        if (currentQuiz) {
          const newQuizzes = [...quizzes];
          newQuizzes[0].questions.push(newQuestion);
          setValue("quizzes", newQuizzes);
        } else {
          // Tạo quiz mới với question đầu tiên
          const newQuiz = {
            title: data.nameQuestion || "Quiz mới",
            explanation: data.explanation || "",
            questions: [newQuestion],
          };
          setValue("quizzes", [newQuiz]);
        }
      }
      setEditingQuiz(null);
    } else {
      // Tạo quiz mới (fallback)
      if (currentQuiz) {
        const newQuizzes = [...quizzes];
        newQuizzes[0].questions.push(newQuestion);
        setValue("quizzes", newQuizzes);
      } else {
        const newQuiz = {
          title: data.nameQuestion || "Quiz mới",
          explanation: data.explanation || "",
          questions: [newQuestion],
        };
        setValue("quizzes", [newQuiz]);
      }
    }
  };

  const handleEditQuestion = (questionIndex: number) => {
    if (!currentQuiz || !currentQuiz.questions[questionIndex]) return;

    const question = currentQuiz.questions[questionIndex];
    const correctAnswerIndex = question.answers.findIndex(
      (answer: any) => answer.isCorrect,
    );
    const correctAnswerLetter = ["A", "B", "C", "D"][correctAnswerIndex];

    const editData = {
      nameQuestion: question.text,
      answerA: question.answers[0]?.text || "",
      answerB: question.answers[1]?.text || "",
      answerC: question.answers[2]?.text || "",
      answerD: question.answers[3]?.text || "",
      correctAnswer: correctAnswerLetter,
      explanation: question.explanation || "",
    };

    setEditingQuiz({
      data: editData,
      questionIndex,
      isNewQuestion: false,
    });
    setIsModalOpen(true);
  };

  const handleAddQuestionToQuiz = () => {
    setEditingQuiz({
      data: null,
      isNewQuestion: true,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const isEditMode = !!courseId;
  const pageTitle = isEditMode ? "Cập nhật bài học" : "Thêm bài học";
  const buttonText = isEditMode ? "Cập nhật bài học" : "Tạo bài học";

  return (
    <>
      <div className="p-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh sách bài học</h4>
          <div className="text-gray-500 text-sm">
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Bài học</span> <Tag />{" "}
              {pageTitle}
            </div>
          </div>
        </Box>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-4"
      >
        <Accordion defaultExpanded className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Chi tiết</div>
              <div className="text-[#637381] font-light">
                Tiêu đề, mô tả ngắn, hình ảnh...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Controller
              name="title"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Bài học"
                  fullWidth
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder="Vd: Bài học 1"
                  className="border border-[#919EAB52]"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Mô tả ngắn"
                  multiline
                  rows={4}
                  fullWidth
                  className="border border-[#919EAB52]"
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Nhập mô tả ngắn về nội dung bài học..."
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({field}) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  className="border border-[#919EAB52]"
                >
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    label="Danh mục"
                    {...field}
                    error={!!errors.categoryId}
                    disabled={isLoadingCategories}
                  >
                    <MenuItem value={0}>Chọn danh mục</MenuItem>
                    {categoriesData?.data?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography color="error" variant="caption" sx={{mt: 1}}>
                      {errors.categoryId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Typography component="div" className="font-medium">
              <div className="mt-4 mb-1 font-medium">Nội dung</div>
            </Typography>
            <Controller
              name="content"
              control={control}
              render={({field}) => (
                <CKEditorWrapper
                  value={field.value || ""}
                  onChange={(data: string) => {
                    field.onChange(data);
                  }}
                  placeholder="Nhập nội dung bài học..."
                />
              )}
            />

            <div className="mt-6 w-full">
              <div className="font-medium mb-2">Hình thu nhỏ</div>
              <input
                accept="image/*"
                className="hidden"
                id="upload-image"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="upload-image" className="w-full">
                <Card
                  className="w-full max-w-md h-48 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
                  sx={{
                    backgroundColor: previewImage ? "transparent" : "#f7f7f7",
                  }}
                >
                  {previewImage ? (
                    <CardMedia
                      component="img"
                      image={getImageUrl(previewImage)}
                      alt={selectedFile ? "Ảnh mới được chọn" : "Ảnh hiện tại"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE_PLACEHOLDER;
                      }}
                    />
                  ) : (
                    <Box className="text-center">
                      <Typography className="text-gray-500 mb-2">
                        Kích thước: 700x430 pixel
                      </Typography>
                      <Typography className="text-gray-500">
                        {isEditMode
                          ? "Thay đổi ảnh (JPG, PNG, SVG, WEBP)"
                          : "Tải ảnh lên (JPG, PNG, SVG, WEBP)"}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </label>
              <Typography component="div" className="font-light">
                <div className="flex items-center gap-1 mb-2 mt-2">
                  <InfoIcon fontSize="small" color="disabled" />
                  <span className="break-words">
                    <span className="text-[#212B36] font-semibold">
                      Kích thước:{" "}
                    </span>{" "}
                    700x430 pixel,{" "}
                    <span className="text-[#212B36] font-semibold">
                      {" "}
                      Hỗ trợ tệp:{" "}
                    </span>{" "}
                    JPG, JPEG, PNG, GIF, WEBP
                  </span>
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-between text-green-600 text-sm mt-1">
                    <span>
                      ✓ Đã chọn: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Xóa
                    </button>
                  </div>
                )}
                {!selectedFile && courseDetail?.image && previewImage && (
                  <div className="flex items-center justify-between text-blue-600 text-sm mt-1">
                    <span>✓ Ảnh hiện tại từ hệ thống</span>
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Ẩn ảnh
                    </button>
                  </div>
                )}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Bài kiểm tra</div>
              <div className="text-[#637381] font-light">
                Các câu hỏi trong bài kiểm tra...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="mb-4">
              {/* Hiển thị danh sách questions */}
              {currentQuiz?.questions && currentQuiz.questions.length > 0 ? (
                currentQuiz.questions.map(
                  (question: any, questionIndex: number) => (
                    <Box
                      key={questionIndex}
                      className="mb-3 border rounded-md p-3 bg-gray-50 flex justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <IconButton size="small" style={{cursor: "grab"}}>
                          <MenuIcon fontSize="small" />
                        </IconButton>
                        <div>
                          <div className="font-medium">
                            {question?.text || `Câu hỏi ${questionIndex + 1}`}
                          </div>
                          {question?.explanation && (
                            <div className="text-sm text-gray-600 mt-1">
                              Giải thích: {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <IconButton
                          size="small"
                          onClick={() => removeQuestion(questionIndex)}
                          color="error"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditQuestion(questionIndex)}
                          color="primary"
                        >
                          <DriveFileRenameOutlineIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </Box>
                  ),
                )
              ) : (
                <div className="text-gray-500 text-center py-4 border rounded-md bg-gray-50">
                  Chưa có câu hỏi nào
                </div>
              )}

              {/* Button thêm câu hỏi */}
              <button
                onClick={() => handleAddQuestionToQuiz()}
                className="mt-2 bg-[#919EAB14] flex gap-2 w-full items-center justify-center py-2 rounded-lg"
                type="button"
              >
                <AddIcon className="text-[#212B36]" />
                <div className="text-[#212B36] font-semibold">
                  {currentQuiz ? "Thêm câu hỏi" : "Tạo câu hỏi đầu tiên"}
                </div>
              </button>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Controller
              name="isActive"
              control={control}
              render={({field}) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                  }
                  label="Xuất bản"
                />
              )}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (changeTab) {
                  changeTab("listLesson");
                }
              }}
              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-[#212B36] text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900"
              disabled={
                createCourseMutation.isLoading || updateCourseMutation.isLoading
              }
            >
              {createCourseMutation.isLoading || updateCourseMutation.isLoading
                ? "Đang xử lý..."
                : buttonText}
            </button>
          </div>
        </Box>
      </Box>
      <ModalAddQuestion
        isModalOpen={isModalOpen}
        handleOk={handleAddQuiz}
        handleCancel={handleCloseModal}
        initialData={editingQuiz?.data}
      />
    </>
  );
}
