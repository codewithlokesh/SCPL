import frontendRouteMap from "./frontendRouteMap";

export default function route() {
  return [
    {
      path: frontendRouteMap.USERHOME.path,
      name: "User Home",
      // element: <h2>User Home</h2>,
    },
  ];
}
