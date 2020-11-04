import React from "react";
import { Typography, List, ListItem } from "@material-ui/core";
import Link from "./Link";
import Images from "./Images";

export default function Stuff() {
  const VAR1 = process.env.GATSBY_VAR1;
  return (
    <Typography variant="body1" component="span">
      <List>
        <ListItem>
          theme.js to specify custom color palette and fontfamily (use
          plugins/gatsby-plugin-top-layout/TopLayout.js to get another font)
        </ListItem>
        <ListItem>
          environment variable: {VAR1} (use .env.development and
          .env.production)
        </ListItem>
        <ListItem>
          <Link to="/about">Internal Link</Link>/
          <Link to="https://material-ui.com/">External link</Link>
        </ListItem>
        <ListItem>
          <Link to="/generatedpage1">generatedpage1</Link>
        </ListItem>
        <ListItem>
          <Link to="/generatedpage2">generatedpage2</Link>
        </ListItem>
        <ListItem>
          (use gatsby-node.js to generate pages based on a template)
        </ListItem>
        <ListItem>
          gatsby imagesharp
          <Images />
        </ListItem>
      </List>
    </Typography>
  );
}

/*
<>
      <Typography component="span">
        process.env variable: {SOMETHING_CLIENTAVAILABLE}
        <br />
        <Link to="/about">Internal Link</Link>
        <br />
        <MuiLink href="https://material-ui.com/">External link</MuiLink>
        <br />
        <Link to="/generatedpage1">generatedpage1</Link>
        <br />
        <Link to="/generatedpage2">generatedpage2</Link>
        <br />
        <Link to="/generatedpage2">generatedpage2</Link>
        <br />
      </Typography>
      <Typography>how to gatsby imagesharp:</Typography>
      <Images />
    </>
    */
