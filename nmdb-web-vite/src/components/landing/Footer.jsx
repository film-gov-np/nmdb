import { Paths } from "@/constants/routePaths";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { Separator } from "../ui/separator";
import { TwitterLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  return (
    <footer className="mt-12  px-4 md:px-6 lg:px-12 pt-12 shadow-lg content-baseline bg-secondary text-muted">
      <div className="mx-auto grid w-full max-w-screen-2xl gap-6 p-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_2px_4fr] gap-8">
          <div className="flex flex-col  items-center lg:items-start">
            <div className="space-y-6">
                <div className="shadow-2xl bg-accent/30 dark:bg-accent/10 rounded-2xl p-2">
                  <img src="/nmdb-logo.png" className="max-h-28 max-w-[16rem] sm:max-w-xs md:max-w-sm" alt="NMDB" />
                </div>
                <p className="max-w-lg text-sm text-muted">
                  Film Development Board (FDB) is established on 30 June 2000 by the
                  Government of Nepal according to the existed Motion Picture
                  (Production, Exhibition and Distribution) Act amended on 20th
                  November 1991.
                </p>
            </div>
          </div>
          <Separator className="hidden lg:block"  orientation="vertical" />
          <div className="flex space-x-4 justify-evenly ">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight text-primary">
                Useful Links
              </h3>
              <ul className="space-y-2 text-muted">
                <li>
                  <NavLink to={Paths.Route_Movies} className="hover:underline">Movies</NavLink>
                </li>
                <li>
                  <NavLink to={Paths.Route_Celebrities} className="hover:underline">Celebrities</NavLink>
                </li>
                <li>
                  <NavLink to={Paths.Route_Movies} className="hover:underline">Movie Calendar</NavLink>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight text-primary">
                Contact Information
              </h3>
              <ul className="space-y-2 text-muted">
                <li>
                  <NavLink to={"tel:014812387"} className="flex items-center hover:underline">
                    <Phone className="mr-1 lg:mr-4 h-4 w-4" />
                    +977 1 4812332, 4812387
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"mailto:nmdb@gmail.com"}
                    className="flex items-center hover:underline"
                  >
                    <Mail className="mr-1 lg:mr-4 h-4 w-4" />
                    nmdb@gmail.com
                  </NavLink>
                </li>
                <li>
                  <div className="flex items-center">
                    <MapPin className="mr-1 lg:mr-4 h-4 w-4" />
                    Chabahil, Kathmandu, Nepal
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-8 grid-flow-col justify-evenly">
          <span className="text-sm text-muted">
            © {new Date().getFullYear()}{" "}
            <NavLink to="https://flim.gov.np" className="hover:underline">
              Flim Development Board
            </NavLink>
            . All Rights Reserved.
          </span>
          <div className="flex space-x-4 text-muted">
            <NavLink to={"https://www.facebook.com/nepalfilm"} className="hover:underline" target="_blank"><Facebook className="h-4 w-4"/></NavLink>
            <NavLink to={"https://twitter.com/FilmBoardNepal"} target="_blank"><TwitterLogoIcon className="h-4 w-4"/></NavLink>
            <NavLink to={"https://www.youtube.com/channel/UCc3KX2q4b0ZgLB59V452qFA"} target="_blank"><Youtube className="h-4 w-4"/></NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
