import { RouterProvider } from "react-router";
import { router } from "@app/providers/router.tsx";

const AppRouterProvider = () => {
  return <RouterProvider router={router} />
};

export default AppRouterProvider;
