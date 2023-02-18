import { nativeTheme } from "electron";

// Switch between dark and light mode
const toggleDarkMode = (theme: string) => {
  if (theme === "dark") {
    nativeTheme.themeSource = "dark";
  }
  else if (theme === "light") {
    nativeTheme.themeSource = "light";
  }
  else if (theme === "system") {
    nativeTheme.themeSource = "system";
  }
}

export default toggleDarkMode;