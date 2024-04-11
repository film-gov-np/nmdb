import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2),
  name_nepali: z.string().min(2).optional().or(z.literal('')),
  runtime: z.string(),
  date_shooting: z.date(),
  date_release: z.date(),
  file: z.instanceof(FileList).optional().or(z.literal('')),

});

export const resolver = zodResolver(formSchema);

export const defaultValues = {
  name: "",
  name_nepali: "",
  runtime: "",
  date_shooting: "",
  date_release: "",
  file: "",

  status: "",
  genre: "",
  language: "",
  studio: "",
  date_release: "",
  date_application: "",
  certificate_number: "",
  censor_type: "",
  movie_type: "",
  
  theater: [{name:"", showingDate: ""}],
  
  crew_and_roles: [{ director: [] }, { producer: [] }],
  
};
