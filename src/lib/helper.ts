export const getDashboardPath = (
  role: "client" | "developer" | "admin" | null
): string => {
  switch (role) {
    case "admin":
      return "/admin";
    case "developer":
      return "/developer/dashboard";
    case "client":
      return "/client/dashboard";
    default:
      return "/";
  }
};
