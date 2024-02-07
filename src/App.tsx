import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminAccount } from "./api/account/account.api";
import "./App.css";
import NoInternet from "./Pages/Error/NoInternet/NoInternet";
import RootNavigator from "./Routes/RootNavigator/RootNavigator";
import { useRoutingStore } from "./store/routingRuleFilter";

function App() {
  const location = useLocation();
  const [isOnline, setOnline] = useState(true);
  const { removeAll } = useRoutingStore();
  // const navigate = useNavigate();
  // // On initization set the isOnline state.
  // const { mutate } = useMutation(AdminAccount, {
  //   onSuccess: (data: any) => {},
  //   // onError: (err) => {
  //   //   // navigate("/login");
  //   // },
  // });
  // useEffect(() => {
  //   // mutate({});
  // }, []);
  // useEffect(() => {

  // }, []);

  useEffect(() => {
    setOnline(navigator.onLine);
    const routingPath = location.pathname.split("/");

    if (!(routingPath[1] == "routing-rule")) {
      removeAll();
    }
  }, [location.pathname]);

  // event listeners to update the state
  window.addEventListener("online", () => {
    setOnline(true);
  });

  window.addEventListener("offline", () => {
    setOnline(false);
  });

  return <>{isOnline ? <RootNavigator /> : <NoInternet />}</>;
}

export default App;
