import { FC } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Header from "~/components/header";
import { Box } from "@mui/material";

import { RouterProps } from "~/types";

function withRouter<T extends Record<string, unknown>>(Component: FC<T & RouterProps>) {
  function ComponentWithRouterProp(props: T) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} location={location} navigate={navigate} params={params} />;
  }

  return ComponentWithRouterProp;
}

function withMainLayout<T extends Record<string, unknown>>(Component: FC<T & RouterProps>) {
  const WrappedComponent = withRouter(Component);
  const WrappedHeader = withRouter(Header);

  return (props: T) => (
    <Box sx={{ position: "relative", minWidth: "100vw", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ minHeight: "calc( 100vh - 88px )" }}>
        <WrappedComponent {...props} />
      </Box>
    </Box>
  );
}

export default withMainLayout;
