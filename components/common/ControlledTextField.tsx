import {TextField} from "@mui/material";
import {Control, Controller, FieldError} from "react-hook-form";

interface ControlledTextFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  error?: FieldError;
  multiline?: boolean;
  rows?: number;
}

export default function ControlledTextField({
  name,
  control,
  label,
  type = "text",
  error,
  multiline = false,
  rows,
}: ControlledTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          label={label}
          margin="normal"
          error={!!error}
          helperText={error?.message}
          multiline={multiline}
          rows={rows}
        />
      )}
    />
  );
}
