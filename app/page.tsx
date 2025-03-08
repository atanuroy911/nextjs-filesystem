"use client";

import { randomUUID } from "crypto";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [root, setRoot] = useState("");

  // After a brief look at a file system implementation in C.
  // I remembered that we need to use trees.
  // We are going to make a tree structure

  const addNode = (id, name) => {
    setData((prevData) => {
      const addChild = (nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                children: [
                  ...node.children,
                  { id: randomUUID, name, children: [] },
                ],
              }
            : { ...node, children: addChild(node.children) }
        );

      return id === null
        ? [...prevData, { id: randomUUID, name, children: [] }]
        : addChild(prevData);
    });
  };

  const FileDir = ({ node, depth }) => {
    const indentationClass = `ml-${depth * 4}`; 
    return (
      <li key={node.id} className={`${indentationClass}`}>
        {node.name}
        <button
          onClick={() => {
            const nextChildName = `${node.name}Child${node.children.length + 1}`;
            addNode(node.id, nextChildName);
          }}
        >
          Add Child
        </button>
        {node.children.length > 0 && (
          <ul>
            {node.children.map((childNode) => (
              <FileDir key={childNode.id} node={childNode} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <input
        type="text"
        value={root}
        placeholder="Enter root name"
        onChange={(e) => setRoot(e.target.value)}
      />
      <button
        onClick={() => {
          if (root) {
            addNode(null, root);
            setRoot("");
          }
        }}
      >
        Add Root
      </button>

      <ul>
        {data.map((node) => (
          <FileDir key={node.id} node={node} depth={0} />
        ))}
      </ul>
    </>
  );
}
