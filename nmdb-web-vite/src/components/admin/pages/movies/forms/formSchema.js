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
  file: z.instanceof(FileList).optional().or(z.literal("")),
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

  genre: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  studio: z.string().optional().or(z.literal("")),

  censor: z.object({
    applicationDate: z.string() .optional().or(z.literal("")),
    certificateNumber: z.string(),
    censoredDate: z.date().optional().or(z.literal("")),
    censorType: z.string(),
    movieType: z.string(),
    reelLength: z.string(),
    reelSize: z.string(),
    movieLength: z.string(),
    validForInYears: z.string(),
    
  }),

  // theaters: z.array(),

  // crewRoles: z.array()
});

export const resolver = zodResolver(formSchema);

export const defaultValues = {
  name: "",
  nepaliName: "",
  shootingDate: "",
  releaseDate: "",
  runtime: "",
  image: "",
  file: "",
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

  genre: "",
  language: "",
  studio: "",

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
  },

  // theaters: [{ theaterId: "", name: "", address: "", showingDate: "" }],

  // crew_and_roles: [
  //   { roleId: "", roleNickName:"", crews: [] },
  // ],
};
