import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import {} from "@radix-ui/react-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export function ModeToggle({ mode }) {
  const { setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState("system");
  return mode === "icon" ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Select
      defaultValue={selectedTheme}
      onValueChange={(value) => {
        setTheme(value);
        setSelectedTheme(value);
      }}
    >
      <SelectTrigger className="h-6 w-[100px] px-2 ">
        <Sun className="mr-1 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute mr-1 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light" className="flex-column flex">
          <div className="flex w-full flex-row">Light</div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex w-full flex-row">Dark</div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex w-full flex-row">System</div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
