import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const PrivateRouter = ({ authenticationPath, outlet }: PrivateRouteProps) => {
  const { token } = useAuthStore();

  if (token) return outlet;

  return (
    <Navigate
      to={{
        pathname: authenticationPath,
      }}
      replace
    />
  );
};

export default PrivateRouter;

export type PrivateRouteProps = {
  authenticationPath: string;
  outlet: JSX.Element;
};
