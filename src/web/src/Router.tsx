import { useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FadeIn } from "./styles/globalStyle";
import { HashRouter, Link } from "react-router-dom";
import Mockup from './assets/img/mock.png'
import MockupLogo from './assets/img/logo.png'
import { fetchNui } from "./helpers/fetchNui";
import { useEffect } from "react";
type RoutesTypes = {
  path: string;
  component: JSXInternal.Element
}

export function Router() {

  const [pageLoaded, setPageLoaded] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  //

  const messageHandler = async (event: any) => {

    switch (event.data.action) {
      case "Change:Route":

        setPageLoaded(event.data.name);

        navigate(event.data.message.route);

        await fetchNui(`${event.data.name}.RouteChanged`, { name: "test" });

        break;
        
      case "Close:Route":

        navigate("/");

        setPageLoaded(undefined)

        break;
    }

  }

  const keydown = async (event: any) => {

    switch (event.code) {
      case "Escape":

        await fetchNui(`${pageLoaded}.RouteClosed`);

        navigate("/");

        setPageLoaded(undefined)

        break;
    }

  }

  useEffect(() => {

    window.addEventListener("message", messageHandler);

    window.addEventListener("keydown", keydown);

    return () => {
      window.removeEventListener("message", messageHandler);

      window.removeEventListener("keydown", keydown);

    };

  }, [messageHandler]);

  const routes: RoutesTypes[] = [
    {
      path: '/',
      component: <></>
    },
  ]

  return (
    <Routes>
      {routes.map((route: RoutesTypes) => (
        <Route path={route.path} element={route.component} />
      ))}
    </Routes>
  );
}
