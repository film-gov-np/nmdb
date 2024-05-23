import {
  ExclamationTriangleIcon,
  LinkNone2Icon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CheckIcon, Film, Video } from "lucide-react";

export const movieCategories = [
  {
    label: "Movie",
    value: 1,
    icon: Video,
  },
  {
    label: "Documentary",
    value: 2,
    icon: Film,
  },
  {
    label: "TV-Show",
    value: 3,
    icon: Film,
  },
];

export const movieStatuses = [
  {
    value: 1,
    label: "Released",
    icon: CheckIcon,
  },
  {
    value: 2,
    label: "Un-Released",
    icon: LinkNone2Icon,
  },
  {
    value: 3,
    label: "Post-Production",
  },
  {
    value: 4,
    label: "Censored",
  },
  {
    value: 5,
    label: "Coming Soon",
    icon: StopwatchIcon,
  },
  {
    value: 6,
    label: "Unknown",
    icon: ExclamationTriangleIcon,
  },
];

export const movieColors = [
  {
    value: 1,
    label: "Black And White",
  },
  {
    value: 2,
    label: "Eastman Color",
  },
  {
    value: 3,
    label: "Kodak Color",
  },
  {
    value: 4,
    label: "Gewa Color",
  },
  {
    value: 5,
    label: "Fuji Color",
  },
  {
    value: 6,
    label: "Agfa Color",
  },
];

export const movieCensorTypes = [
  {
    value: 1,
    label: "PG",
  },
  {
    value: 2,
    label: "UA",
  },
  {
    value: 3,
    label: "A",
  },
];
export const movieTypes = [
  {
    value: 1,
    label: "Celluliod",
  },
  {
    value: 2,
    label: "Digital",
  },
  {
    value: 3,
    label: "Video",
  },
];
export const movieValidFor = [
  {
    value: 5,
    label: "5",
  },
  {
    value: 10,
    label: "10",
  },
];
