import React from "react";
import SEO from "../components/seo";
import { Container, Typography } from "@material-ui/core";
import Link from "../components/Link";

export default function Index(props) {
  const name = props.pageContext.name;
  return (
    <>
      <SEO title={name} description={`description about ${name} goes here`} />
      <Container>
        <Typography variant="body1">
          This is a generated page with name {name} and its own SEO
        </Typography>
        <Link to="/">Home</Link>
      </Container>
    </>
  );
}
