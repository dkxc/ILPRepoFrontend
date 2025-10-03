import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./App.tsx", [
    index("./pages/trainee/Dashboard.tsx"),
    route("myproject", "./pages/trainee/MyProject.tsx"),
  ]),
] satisfies RouteConfig;
