import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  eachYearOfInterval,
  format,
  getDay,
  getMonth,
  getYear,
  parse,
  setMonth,
  setYear,
  startOfWeek,
} from "date-fns";

const CustomToolbar = (props) => {
  const { date, onNavigate, label } = props;
  const currentYear = getYear(date);
  const currentMonth = getMonth(date);

  const handleYearChange = (value) => {
    debugger;
    const newYear = parseInt(value, 10);
    const newDate = setYear(date, newYear);
    onNavigate("DATE", newDate);
  };

  const handleMonthChange = (value) => {
    const newMonth = parseInt(value, 10);
    const newDate = setMonth(date, newMonth);
    onNavigate("DATE", newDate);
  };

  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToCurrent = () => {
    const now = new Date();
    onNavigate("TODAY", now);
  };

  return (
    <div className="rbc-toolbar flex">
      <span className="rbc-btn-group">
        <button type="button" onClick={goToBack}>
          &lt;
        </button>
        <button type="button" onClick={goToCurrent}>
          Today
        </button>
        <button type="button" onClick={goToNext}>
          &gt;
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <div className="flex">
        <Select className="flex"
          defaultValue={currentYear}
          value={currentYear}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {eachYearOfInterval({
              start: new Date("1900", 0),
              end: new Date(currentYear + 9, 0),
            }).map((year) => (
              <SelectItem key={year} value={getYear(year)}>
                {getYear(year)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={currentMonth}
          value={currentMonth}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={i}>
                {format(setMonth(new Date(), i), "MMMM")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomToolbar;
