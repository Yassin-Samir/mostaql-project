import { createContext, useState } from "react";

export const Context = createContext({ editRoute: null, route: "" });
function EditContext() {
  const [route, setRoute] = useState("");
  function editRoute(routeParam) {
    setRoute(routeParam);
  }
  return { route, editRoute };
}

export default function GlobalRouteContext({ children }) {
  const { editRoute, route } = EditContext();
  return (
    <Context.Provider value={{ route, editRoute }}>{children}</Context.Provider>
  );
}
