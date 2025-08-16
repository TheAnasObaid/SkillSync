"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const THEME_DEFAULT = "skillsync-pro";
const THEME_MALE = "skillsync-blue";
const THEME_FEMALE = "skillsync-pink";

const ThemeController = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    let themeToSet = THEME_DEFAULT;

    if (user?.gender === "female") {
      themeToSet = THEME_FEMALE;
    } else if (user?.gender === "male") {
      themeToSet = THEME_MALE;
    }

    // This is the safe way to change the theme on the client
    document.documentElement.setAttribute("data-theme", themeToSet);
  }, [user]); // This effect re-runs whenever the user object changes

  // This component renders nothing itself
  return null;
};

export default ThemeController;
