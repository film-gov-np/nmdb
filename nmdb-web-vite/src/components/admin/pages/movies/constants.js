import {
  ExclamationTriangleIcon,
  LinkNone2Icon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CheckIcon, Film, Video } from "lucide-react";

export const movieCategories = [
  {
    label: "Movie",
    value: "Movie",
    icon: Video,
  },
  {
    label: "Documentary",
    value: "Documentary",
    icon: Film,
  },
  {
    label: "TVShow",
    value: "TV-Show",
    icon: Film,
  },
];

export const movieStatuses = [
  {
    value: "Released",
    label: "Released",
    icon: CheckIcon,
  },
  {
    value: "Unreleased",
    label: "Un-Released",
    icon: LinkNone2Icon,
  },
  {
    value: "PostProduction",
    label: "Post-Production",
  },
  {
    value: "Censored",
    label: "Censored",
  },
  {
    value: "ComingSoon",
    label: "Coming Soon",
    icon: StopwatchIcon,
  },
  {
    value: "Unknown",
    label: "Unknown",
    icon: ExclamationTriangleIcon,
  },
];

export const movieColors = [
  {
    value: "BlackAndWhite",
    label: "Black And White",
  },
  {
    value: "EastmanColor",
    label: "Eastman Color",
  },
  {
    value: "KodakColor",
    label: "Kodak Color",
  },
  {
    value: "GewaColor",
    label: "Gewa Color",
  },
  {
    value: "FujiColor",
    label: "Fuji Color",
  },
  {
    value: "AgfaColor",
    label: "Agfa Color",
  },
];

export const movieCensorTypes = [
  {
    value: "PG",
    label: "PG",
  },
  {
    value: "UA",
    label: "UA",
  },
  {
    value: "A",
    label: "A",
  },
];
export const movieTypes = [
  {
    value: "Celluliod",
    label: "Celluliod",
  },
  {
    value: "Digital",
    label: "Digital",
  },
  {
    value: "Video",
    label: "Video",
  },
];
export const movieValidFor = [
  {
    value: "5",
    label: "5",
  },
  {
    value: "10",
    label: "10",
  },
];
