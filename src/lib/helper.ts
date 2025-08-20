export const getDashboardPath = (
  role: "CLIENT" | "DEVELOPER" | "ADMIN" | null
): string => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "DEVELOPER":
      return "/developer/dashboard";
    case "CLIENT":
      return "/client/dashboard";
    default:
      return "/";
  }
};
