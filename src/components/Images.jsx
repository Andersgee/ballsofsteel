import React from "react";
import Img from "gatsby-image";
import useImages from "../hooks/use-images";
import { Grid, Box } from "@material-ui/core";

export default function Images() {
  const images = useImages();
  const h = 100;
  return (
    <Grid container justify="center" spacing={3} align="center">
      <Grid item xs={3}>
        <Box height={h}>
          <Img
            fluid={images["react_logo"]}
            style={{ maxHeight: "100%" }}
            imgStyle={{ objectFit: "contain" }}
          />
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Box height={h}>
          <Img
            fluid={images["gatsby_logo"]}
            style={{ maxHeight: "100%" }}
            imgStyle={{ objectFit: "contain" }}
          />
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Box height={h}>
          <Img
            fluid={images["materialui_logo"]}
            style={{ maxHeight: "100%" }}
            imgStyle={{ objectFit: "contain" }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
