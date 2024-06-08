import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  movieCategories,
  movieCensorTypes,
  movieColors,
  movieStatuses,
  movieTypes,
  movieValidFor,
} from "../constants";

export const formSchema = z.object({
  name: z.string().min(2),
  nepaliName: z.string().min(2).optional().or(z.literal("")),
  shootingDate: z.date().optional().or(z.literal("")),
  releaseDate: z.date().optional().or(z.literal("")),
  runtime: z.coerce.number().positive().or(z.literal("")),
  thumbnailImage: z.string().optional().or(z.literal("")),
  thumbnailImageFile: z.instanceof(FileList).optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  coverImageFile: z.instanceof(FileList).optional().or(z.literal("")),
  category: z.union(movieCategories.map((c) => z.literal(c.value.toString()))),
  status: z.union(movieStatuses.map((s) => z.literal(s.value.toString()))),
  tagline: z.string().optional().or(z.literal("")),
  officialSiteUrl: z.string().optional().or(z.literal("")),
  budget: z.coerce.number().positive().or(z.literal("")),
  filmingLocaion: z.string().optional().or(z.literal("")),
  color: z.union(movieColors.map((c) => z.literal(c.value.toString()))),
  oneLiner: z.string().optional().or(z.literal("")),
  fullMovieLink: z.string().optional().or(z.literal("")),
  trailerLink: z.string().optional().or(z.literal("")),

  genres: z.array(z.any()),
  languages: z.array(z.any()),
  productionHouses: z.array(z.any()),

  censor: z.object({
    applicationDate: z.date().optional().or(z.literal("")),
    certificateNumber: z.string(),
    censoredDate: z.date().optional().or(z.literal("")),
    censorType: z
      .union(movieCensorTypes.map((c) => z.literal(c.value.toString())))
      .optional()
      .or(z.literal("")),
    movieType: z
      .union(movieTypes.map((c) => z.literal(c.value.toString())))
      .optional()
      .or(z.literal("")),
    reelLength: z.string(),
    reelSize: z.string(),
    movieLength: z.string().optional().or(z.literal("")),
    validForInYears: z
      .union(movieValidFor.map((c) => z.literal(c.value.toString())))
      .optional()
      .or(z.literal("")),
    description: z.string(),
  }),

  theatres: z.array(z.any()),

  crewRoles: z.array(z.any()),
});

export const resolver = zodResolver(formSchema);

export const defaultValues = {
  name: "",
  nepaliName: "",
  shootingDate: "",
  releaseDate: "",
  runtime: "",
  thumbnailImage: "",
  thumbnailImageFile: "",
  coverImage: "",
  coverImageFile: "",
  category: "",
  status: "",
  tagline: "",
  officialSiteUrl: "",
  budget: "",
  filmingLocaion: "",
  color: "",
  oneLiner: "",
  fullMovieLink: "",
  trailerLink: "",

  genres: [],
  languages: [],
  productionHouses: [],

  censor: {
    applicationDate: "",
    certificateNumber: "",
    censoredDate: "",
    censorType: "",
    movieType: "",
    reelLength: "",
    reelSize: "",
    movieLength: "",
    validForInYears: "",
    description: "",
  },

  theatres: [{ movieTheatreDetails: [], showingDate: "" }],

  crewRoles: [
    { roleId: "10", roleName: "Director", crews: [] },
    { roleId: "27", roleName: "Producer", crews: [] },
    { roleId: "1", roleName: "Actor", crews: [] },
    { roleId: "2", roleName: "Actress", crews: [] },
  ],
};
