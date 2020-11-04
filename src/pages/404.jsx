import React from "react";
import SEO from "../components/seo";
import { Container, Typography } from "@material-ui/core";
import Link from "../components/Link";

export default function Notfound() {
  return (
    <>
      <SEO title={"404"} />
      <Container>
        <Typography variant="body1">404 - Not found</Typography>
        <Link to="/">Go to the main page</Link>
      </Container>
    </>
  );
}
