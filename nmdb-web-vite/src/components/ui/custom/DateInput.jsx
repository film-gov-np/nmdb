import { useState } from "react";
import { Input } from "../input";

const DateInput = ({
  value = "",
  field,
  placeholder = "( YYYY - MM - DD )",
  ...props
}) => {
  const [date, setDate] = useState(value);

  const handleChange = (e) => {
    let input = e.target?.value;
    field.onChange(input);
    
    const inputLength = input.length;
    input = input.replace(/[^\d-]/g, "");
    if (inputLength > date.length) {
      if (input.length === 4 || input.length === 7) {
        input += "-";
      }
    }
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    setDate(input);
  };

  const handleKeyDown = (e) => {
    const input = e.target.value;
    const position = e.target.selectionStart;

    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      (input[position - 1] === "-" || input[position] === "-")
    ) {
      e.preventDefault();
      const updatedInput =
        e.key === "Backspace"
          ? input.slice(0, position - 1) + input.slice(position)
          : input.slice(0, position) + input.slice(position + 1);
      setDate(updatedInput);
    }
  };
  return (
    <Input
      type="text"
      value={date}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={10}
      pattern="\d{4}-\d{2}-\d{2}"
      {...props}
    />
  );
};

export default DateInput;
