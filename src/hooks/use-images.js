import { useStaticQuery, graphql } from "gatsby";

function vec2obj(vec) {
  //using "name" as key
  let obj = {};
  for (let v of vec) {
    obj[v.name] = v.childImageSharp.fluid;
  }
  return obj;
}

export default function useImages() {
  const { allFile } = useStaticQuery(
    graphql`
      {
        allFile(filter: { relativeDirectory: { eq: "images" } }) {
          nodes {
            name
            childImageSharp {
              fluid {
                base64
                aspectRatio
                src
                srcSet
                sizes
                maxWidth: presentationWidth
                maxHeight: presentationHeight
              }
            }
          }
        }
      }
    `
  );
  return vec2obj(allFile.nodes);
}
