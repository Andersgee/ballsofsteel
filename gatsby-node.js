const path = require("path");

//programmatically create pages using templates/index.js for all of them.
//specialize them by using the passed context object
const names = [
  "generatedpage1",
  "generatedpage2"
];

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const templateindex = path.resolve(`src/templates/index.jsx`);
  names.forEach((name) => {
    createPage({
      path: `/${name}`,
      component: templateindex,
      context: { name: name },
    });
  });
};
