import { Paths } from "@/constants/routePaths";
import { Facebook, Mail, MapPin, Phone, Smartphone, Youtube } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { Separator } from "../ui/separator";
import { TwitterLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  return (
    <footer className="mt-12 bg-muted/20 px-12 pt-12 shadow-lg content-baseline">
      <div className="mx-auto grid w-full max-w-screen-2xl gap-6 p-4 py-6 lg:py-8">
        <div className="grid md:grid-cols-[5fr_2px_4fr] md:gap-8">
          <div className="space-y-8">
            <div>
              <img src="/nmdb-logo.png" class="max-h-28 max-w-sm" alt="NMDB" />
            </div>
            <p className="max-w-lg text-sm text-muted-foreground">
              Film Development Board (FDB) is established on 30 June 2000 by the
              Government of Nepal according to the existed Motion Picture
              (Production, Exhibition and Distribution) Act amended on 20th
              November 1991.
            </p>
          </div>
          <Separator orientation="vertical" />
          <div className="flex justify-evenly">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight ">
                Useful Links
              </h3>
              <ul className="space-y-2 text-muted-foreground">
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
              <h3 className="text-lg font-semibold leading-none tracking-tight ">
                Contact Information
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <NavLink to={"tel:014812387"} className="flex items-center hover:underline">
                    <Phone className="mr-4 h-4 w-4" />
                    +977 1 4812332, 4812387
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"mailto:nmdb@gmail.com"}
                    className="flex items-center hover:underline"
                  >
                    <Mail className="mr-4 h-4 w-4" />
                    nmdb@gmail.com
                  </NavLink>
                </li>
                <li>
                  <div className="flex items-center">
                    <MapPin className="mr-4 h-4 w-4" />
                    Chabahil, Kathmandu, Nepal
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-8 grid-flow-col justify-evenly">
          <span class="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <NavLink to="https://flim.gov.np" className="hover:underline">
              Flim Development Board
            </NavLink>
            . All Rights Reserved.
          </span>
          <div className="flex space-x-4 text-muted-foreground">
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
