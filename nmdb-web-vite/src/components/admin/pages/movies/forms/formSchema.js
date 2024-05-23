import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { movieCategories, movieStatuses } from "../constants";

export const formSchema = z.object({
  name: z.string().min(2).optional().or(z.literal("")),
  nepaliName: z.string().min(2).optional().or(z.literal("")),
  shootingDate: z.date().optional().or(z.literal("")),
  releaseDate: z.date().optional().or(z.literal("")),
  runtime: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  imageFile: z.instanceof(FileList).optional().or(z.literal("")),
  category: z
    .enum(movieCategories.map((c) => c.value))
    .optional()
    .or(z.literal("")),
  status: z
    .enum(movieStatuses.map((s) => s.value))
    .optional()
    .or(z.literal("")),
  tagline: z.string().optional().or(z.literal("")),
  officialSiteUrl: z.string().optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  flimingLocation: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  oneLiner: z.string().optional().or(z.literal("")),
  fullMovieLink: z.string().optional().or(z.literal("")),
  trailerLink: z.string().optional().or(z.literal("")),

  genre: z.array(z.any()),
  language: z.array(z.any()),
  studio: z.array(z.any()),

  censor: z.object({
    applicationDate: z.string().optional().or(z.literal("")),
    certificateNumber: z.string(),
    censoredDate: z.date().optional().or(z.literal("")),
    censorType: z.string(),
    movieType: z.string(),
    reelLength: z.string(),
    reelSize: z.string(),
    movieLength: z.string(),
    validForInYears: z.string(),
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
  image: "",
  imageFile: "",
  category: "",
  status: "",
  tagline: "",
  officialSiteUrl: "",
  budget: "",
  flimingLocation: "",
  color: "",
  oneLiner: "",
  fullMovieLink: "",
  trailerLink: "",

  genre: [{ id: 1, name: "Romantic" }],
  language: [],
  studio: [
    {
      id: 4,
      name: "Royal Nepal Film Corporation",
      nepaliName: null,
      chairmanName: "NA",
      isRunning: true,
    },
  ],

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
    description:""
  },

  theatres: [{ theatre: [], showingDate: "" }],

  crewRoles: [
    { roleId: "10", roleName: "Director", crews: [] },
    { roleId: "27", roleName: "Producer", crews: [] },
    { roleId: "1", roleName: "Actor", crews: [] },
    { roleId: "2", roleName: "Actress", crews: [] },
  ],
};
