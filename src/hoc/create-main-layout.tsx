import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Components
import Header from "~/components/header";
import Footer from "~/components/footer";
import { Box } from "@mui/material";
// Libs
import { RouterProps } from "~/types";

interface Props {}

function withRouter<T extends Props>(Component: React.ComponentType<T>) {
  function ComponentWithRouterProp(props: T) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} location={location} navigate={navigate} params={params} />;
  }

  return ComponentWithRouterProp;
}

function withMainLayout<T extends Props>(Component: React.ComponentType<T>) {
  const WrappedComponent = withRouter(Component);
  const WrappedHeader = withRouter(Header);
  return (props: T) => (
    <Box sx={{ position: "relative", minWidth: "100vw", minHeight: "100vh" }}>
      <WrappedHeader />
      <Box sx={{ minHeight: "calc( 100vh - 88px )" }}>
        <WrappedComponent {...props} />
      </Box>
      {/* <Footer /> */}
    </Box>
  );
}

export default withMainLayout;
