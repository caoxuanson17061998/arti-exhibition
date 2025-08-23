import {MenuItem, TextField} from "@mui/material";
import {Controller} from "react-hook-form";

interface Props {
  name: string;
  control: any;
  label: string;
}

export default function ControlledBooleanSelect({name, control, label}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <TextField
          {...field}
          select
          fullWidth
          margin="normal"
          label={label}
          onChange={(e) => field.onChange(e.target.value === "true")}
          value={String(field.value)}
        >
          <MenuItem value="false">False</MenuItem>
          <MenuItem value="true">True</MenuItem>
        </TextField>
      )}
    />
  );
}
