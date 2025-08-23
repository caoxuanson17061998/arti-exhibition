import {Autocomplete, TextField} from "@mui/material";
import {Controller} from "react-hook-form";

interface Props {
  name: string;
  control: any;
  label: string;
  options: {id: string; name: string}[];
}

export default function ControlledMultiSelect({
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
        <Autocomplete
          multiple
          options={options}
          getOptionLabel={(option) => option.name}
          value={options.filter((opt) => field.value.includes(opt.id))}
          onChange={(_, newValue) =>
            field.onChange(newValue.map((item) => item.id))
          }
          renderInput={(params) => (
            <TextField {...params} label={label} margin="normal" />
          )}
        />
      )}
    />
  );
}
