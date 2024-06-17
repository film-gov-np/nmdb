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

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    const newDate = setYear(date, newYear);
    onNavigate("DATE", newDate);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
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
    <div className="rbc-toolbar">
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
      <span className="custom-toolbar">
        <label>
          Year:
          <select value={currentYear} onChange={handleYearChange}>
            {eachYearOfInterval({
              start: new Date(currentYear - 10, 0),
              end: new Date(currentYear + 9, 0),
            }).map((year) => (
              <option key={year} value={getYear(year)}>
                {getYear(year)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Month:
          <select value={currentMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(setMonth(new Date(), i), "MMMM")}
              </option>
            ))}
          </select>
        </label>
      </span>
    </div>
  );
};

export default CustomToolbar;
