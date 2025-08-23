import {MenuItem, TextField} from "@mui/material";
import {Controller} from "react-hook-form";

interface Props {
  name: string;
  control: any;
  label: string;
  options: string[];
}

export default function ControlledEnumSelect({
  name,
  control,
  label,
  options,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <TextField {...field} select fullWidth margin="normal" label={label}>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
