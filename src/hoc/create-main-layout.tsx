import React from "react"
// Components
import Header from "../components/header"
import Footer from "../components/footer"
import { Base } from "./create-main-layout.styles"
// Styles
// import { Base, Content } from "./create-main-layout.styles"
// Libs

interface Props {}

function withMainLayout<T extends Props>(WrappedComponent: React.ComponentType<T>) {
  return (props: T) => (
    <Base>
      <Header />
      <WrappedComponent {...props} />
      <Footer />
    </Base>
  )
}

export default withMainLayout
