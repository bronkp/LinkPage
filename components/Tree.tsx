"use client";
import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { tree } from "next/dist/build/templates/app-page";
import Header from "./Header";
import LinkItem from "./LinkItem";
import Special from "./Special";
import SpecialContainer from "./SpecialContainer";
import TreeContainer from "./TreeContainer";
import { TreeType } from "../types/types";
type TreeProps = {
  demo?: TreeType;
};
const Tree: React.FC<TreeProps> = ({ demo }) => {
  const [tree, setTree] = useState<TreeType>();
  const [loading, setLoading] = useState(true);
  const [pfp, setPFP] = useState("");
  let context = useAuthContext();
  const params = useParams();
  const { uid } = params;
  const fetchData = async () => {
    try {
      //@ts-ignore
      const { data, error } = await context.client
        .from("TreePages")
        .select()
        .eq("url", uid);
      let newTree = data[0];
      let url = context.client?.storage
        .from("tree-pfps")
        .getPublicUrl(newTree?.pfp!);
      newTree.pfp = url?.data.publicUrl;
      setTree(newTree);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (demo) {
      setLoading(false);

      let edittedDemo = { ...demo };
      setTree(edittedDemo);
      setLoading(false);
    } else {
      fetchData();
    }

    console.log(demo);
  }, []);
  useEffect(() => {
    setTree(demo);
  }, [demo]);
  return (
    <>
      {!loading && (
        <TreeContainer demoTree={demo ? true : false}>
          <Header pfp={tree.pfp} name={tree!.name} />
          {tree?.links.map((link, key) => (
            <LinkItem key={key} link={link} />
          ))}
          <SpecialContainer>
            {tree?.special_links?.map((special, key) => (
              <Special key={key} special={special} />
            ))}
          </SpecialContainer>
        </TreeContainer>
      )}
    </>
  );
};

export default Tree;
