import { FC } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Header, { headerHeight } from "~/components/header";
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
    <Box sx={{ position: "relative", width: "100%", maxWidth: "100vw", height: "100%", maxHeight: "100vh" }}>
      <WrappedHeader />
      <Box sx={{ height: `calc( 100vh - ${headerHeight} )`, overflow: "auto" }}>
        <WrappedComponent {...props} />
      </Box>
    </Box>
  );
}

export default withMainLayout;
