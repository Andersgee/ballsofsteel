import React from "react";
import SEO from "../components/seo";
import { Container, Typography } from "@material-ui/core";
import Link from "../components/Link";

export default function About() {
  return (
    <>
      <SEO title={"about"} />
      <Container>
        <Typography variant="body1">About</Typography>
        <Link to="/">Go to the main page</Link>
      </Container>
    </>
  );
}
