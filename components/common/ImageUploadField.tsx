import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import {useRef, useState} from "react";
import {Controller} from "react-hook-form";

interface ImageUploadFieldProps {
  name: string;
  control: any;
  label: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSizeMB?: number;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ImageUploadField({
  name,
  control,
  label,
  multiple = false,
  maxFiles = 1,
  maxFileSizeMB = 1,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => {
        const handleFiles = async (files: FileList | null) => {
          if (!files) return;

          const fileArray = Array.from(files).slice(0, maxFiles);
          const validFiles: File[] = [];
          const oversizedFiles: File[] = [];

          for (const file of fileArray) {
            const sizeMB = file.size / 1024 / 1024;
            if (sizeMB <= maxFileSizeMB) {
              validFiles.push(file);
            } else {
              oversizedFiles.push(file);
            }
          }

          if (oversizedFiles.length > 0) {
            const names = oversizedFiles.map((f) => `"${f.name}"`).join(", ");
            setError(
              `Các ảnh ${names} vượt quá ${maxFileSizeMB}MB và đã bị bỏ qua.`,
            );
          } else {
            setError("");
          }

          if (validFiles.length === 0) return;

          try {
            const base64List = await Promise.all(validFiles.map(fileToBase64));

            if (multiple) {
              const current = Array.isArray(field.value) ? field.value : [];
              // Filter out any empty or invalid values
              const validBase64 = base64List.filter(b64 => b64 && b64.trim() !== '');
              field.onChange([...current, ...validBase64]);
            } else {
              // Ensure we have a valid base64 string
              const base64 = base64List[0];
              field.onChange(base64 && base64.trim() !== '' ? base64 : '');
            }
          } catch (err) {
            console.error("Error converting to base64:", err);
            setError("Đã xảy ra lỗi khi xử lý ảnh.");
          }
        };

        const handleRemove = (index?: number) => {
          if (multiple && Array.isArray(field.value)) {
            const updated = [...field.value];
            updated.splice(index!, 1);
            field.onChange(updated);
          } else {
            field.onChange(''); // Set to empty string instead of null
          }
        };

        const value = field.value || (multiple ? [] : "");

        return (
          <Box className="mb-4">
            <Typography fontWeight="500" gutterBottom>
              {label}
            </Typography>

            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              hidden
              ref={inputRef}
              onChange={(e) => handleFiles(e.target.files)}
            />

            <Button
              variant="outlined"
              onClick={() => inputRef.current?.click()}
              sx={{mt: 1}}
            >
              {multiple ? "Tải lên ảnh" : "Chọn ảnh"}
            </Button>

            {error && (
              <FormHelperText error className="mt-1">
                {error}
              </FormHelperText>
            )}

            <Stack
              direction="row"
              spacing={2}
              mt={2}
              flexWrap="wrap"
              rowGap={2}
            >
              {multiple && Array.isArray(value)
                ? value.map((url: string, index: number) => (
                    <Card
                      key={index}
                      sx={{
                        position: "relative",
                        width: {xs: "100%", sm: 140, md: 160},
                        height: {xs: 140, sm: 140, md: 160},
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid #ddd",
                      }}
                    >
                      <Image
                        src={url}
                        alt={`image-${index}`}
                        fill
                        style={{
                          objectFit: "contain",
                          padding: 8,
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          "position": "absolute",
                          "top": 4,
                          "right": 4,
                          "backgroundColor": "white",
                          "&:hover": {backgroundColor: "#f0f0f0"},
                        }}
                        onClick={() => handleRemove(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Card>
                  ))
                : value && (
                    <Card
                      sx={{
                        position: "relative",
                        width: "100%",
                        maxWidth: 200,
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid #ddd",
                      }}
                    >
                      <Image
                        src={value}
                        alt="thumbnail"
                        fill
                        style={{
                          objectFit: "contain",
                          padding: 8,
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          "position": "absolute",
                          "top": 4,
                          "right": 4,
                          "backgroundColor": "white",
                          "&:hover": {backgroundColor: "#f0f0f0"},
                        }}
                        onClick={() => handleRemove()}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Card>
                  )}
            </Stack>
          </Box>
        );
      }}
    />
  );
}
