import React from "react";
import MuiLink from "@material-ui/core/Link";
import { Link as GatsbyLink } from "gatsby";

const Link = React.forwardRef(function Link(props, ref) {
  const external = props.to.startsWith("http");
  if (external) {
    return <MuiLink href={props.to} ref={ref} {...props} />;
  } else {
    return <MuiLink component={GatsbyLink} ref={ref} {...props} />;
  }
});

export default Link;
