import React from "react";
import { graphql } from "gatsby";

export default function Files({ data }) {
  return (
    <div>
      <h1>List of all assets</h1>
      <table>
        <thead>
          <tr>
            <th>relativePath</th>
            <th>prettySize</th>
            <th>extension</th>
            <th>birthTime</th>
          </tr>
        </thead>
        <tbody>
          {data.allFile.nodes.map((node, i) => (
            <tr key={i}>
              <td>{node.relativePath}</td>
              <td>{node.prettySize}</td>
              <td>{node.extension}</td>
              <td>{node.birthTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const query = graphql`
  query {
    allFile {
      nodes {
        relativePath
        prettySize
        extension
        birthTime(fromNow: true)
      }
    }
  }
`;
