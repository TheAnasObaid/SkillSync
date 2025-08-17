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

    if (user?.gender === "FEMALE") {
      themeToSet = THEME_FEMALE;
    } else if (user?.gender === "MALE") {
      themeToSet = THEME_MALE;
    }

    document.documentElement.setAttribute("data-theme", themeToSet);
  }, [user]);

  return null;
};

export default ThemeController;
