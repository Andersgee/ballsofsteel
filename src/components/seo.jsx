import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useLocation } from "@reach/router";
import { useStaticQuery, graphql } from "gatsby";

const SEO = ({ title, description, image, article }) => {
  const { pathname } = useLocation();
  const { allSite } = useStaticQuery(query);

  const {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    siteUrl,
    defaultImage,
  } = allSite.nodes[0].siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    //image: `${siteUrl}/images/${title || defaultImage}.png`,
    image: `${siteUrl}/images/${defaultImage}.png`,
    url: `${siteUrl}${pathname}`,
  };

  const ogtitle = title ? `${seo.title} · ${defaultTitle}` : defaultTitle;

  return (
    <Helmet title={seo.title} titleTemplate={title ? titleTemplate : null}>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      {seo.url && <meta property="og:url" content={seo.url} />}
      {article && <meta property="og:type" content="article" />}
      <meta property="og:title" content={ogtitle} />
      <meta property="og:description" content={seo.description} />
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogtitle} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image && <meta name="twitter:image" content={seo.image} />}
    </Helmet>
  );
};

export default SEO;

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
};

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
};

const query = graphql`
  query SEO {
    allSite {
      nodes {
        siteMetadata {
          defaultTitle
          titleTemplate
          defaultDescription
          siteUrl
          defaultImage
        }
      }
    }
  }
`;
