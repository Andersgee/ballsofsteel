require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    defaultTitle: `Balls of Steel`,
    titleTemplate: "%s · Balls of Steel",
    defaultDescription: `socket.io webgl2 game`,
    lang: `en`,
    siteUrl: "https://github.com/andersgee/gatsbystarter",
    defaultImage: "andyfx",
    author: "Anders Gustafsson",
  },
  plugins: [
    "gatsby-plugin-top-layout",
    "gatsby-plugin-material-ui",
    "gatsby-plugin-react-helmet",
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    "gatsby-transformer-plaintext",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets/`,
      },
    },
  ],
};
