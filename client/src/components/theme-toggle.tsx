import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-2 border-gradient bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 hover:scale-110">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-180 dark:scale-0 text-yellow-500" />
          <Moon className="absolute h-5 w-5 rotate-180 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-purple-200 dark:border-purple-800">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-200"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
        >
          <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-yellow-400 to-blue-400"></div>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}