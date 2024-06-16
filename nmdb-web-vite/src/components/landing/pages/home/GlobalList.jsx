import Celebrities from "../celebrities/Celebrities";
import Movies from "../movies/Movies";
import CinemaHall from "./CinemaHall";

const GlobalList = ({ search }) => {
  return (
    <div className="">
      <Movies
        search={search}
        showFilters={false}
        itemsPerPage={14}
        className={"min-h-60"}
        showBackButton={false}
      />
      <Celebrities
        search={search}
        showFilters={false}
        itemsPerPage={14}
        className={"min-h-60 -mt-8"}
        showBackButton={false}
      />
      <CinemaHall
        search={search}
        showFilters={false}
        itemsPerPage={14}
        className={"min-h-60 -mt-8"}
        showBackButton={false}
      />
    </div>
  );
};

export default GlobalList;
