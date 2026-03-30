export const ROUTES = {
  HOME: {
    route: "/",
    label: "Accueil",
  },
  PROFILE: {
    route: (userId: string) => `/profile/${userId}`,
    label: "Profil",
  },
};
