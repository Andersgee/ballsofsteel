import { useStaticQuery, graphql } from "gatsby";

export default function useGlsl() {
  const { allFile } = useStaticQuery(
    graphql`
      {
        allFile(filter: { extension: { eq: "glsl" } }) {
          edges {
            node {
              name
              childPlainText {
                content
              }
            }
          }
        }
      }
    `
  );

  let glsl = nameasindex(allFile.edges);
  return glsl;
}

function nameasindex(vec) {
  let obj = {};
  for (let i in vec) {
    obj[vec[i].node.name] = vec[i].node.childPlainText.content;
  }
  return obj;
}
