import { LinkNone2Icon } from "@radix-ui/react-icons";
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
]

export const movieStatuses = [
  {
    value: "Released",
    label: "Released",
    icon: CheckIcon,
  },
  {
    value: "Unreleased",
    label: "Post-Production",
    icon: LinkNone2Icon,
  },
  {
    value: "PostProduction",
    label: "Un-Released",
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
]
