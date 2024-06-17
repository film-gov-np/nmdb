import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
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
import enUS from "date-fns/locale/en-US";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./CustomToolbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Event({ event }) {
  return (
    <span>
      <strong>{event.name}</strong>
      {event.desc && ":  " + event.desc}
    </span>
  );
}

const MovieCalendar = () => {
  const [event, setEvent] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { components, defaultDate, views } = useMemo(
    () => ({
      components: {
        event: Event,
        toolbar: CustomToolbar,
      },
      views: ["month"],

      //   defaultDate: new Date(),
    }),
    [],
  );
  const fetchEvents = useCallback(async (year, month) => {
    debugger;
    let apiPath = `${ApiPaths.Path_Front_Movies}?Year=${year}&Month=${month}`;
    const response = await axiosInstance
      .get(apiPath)
      .then((response) => {
        let responseData = response.data;
        if (responseData?.isSuccess) return response.data.data;
        else throw new Error("Something went wrong");
      })
      .catch((err) => {
        throw new Error("Something went wrong");
      });

    setEvent(response.items);
  }, []);

  const handleRangeChange = (range) => {
    setCurrentDate(range);
  };
  const onSelectEvent = (arg) => {
    console.log(arg);
  };

  useEffect(() => {
    fetchEvents(getYear(currentDate), getMonth(currentDate) + 1);
  }, [fetchEvents, currentDate]);

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      <div className="h-[calc(100vh-4rem)]">
        <Calendar
          components={components}
          localizer={localizer}
          defaultView={Views.MONTH}
          events={event}
          startAccessor={(event) => new Date(event.releaseDate)}
          titleAccessor={(event) => <span>{event.name}</span>}
          endAccessor={(event) => new Date(event.releaseDate)}
          views={views}
          onNavigate={handleRangeChange}
          onSelectEvent={onSelectEvent}
          popup
        />
      </div>
    </main>
  );
};

export default MovieCalendar;
