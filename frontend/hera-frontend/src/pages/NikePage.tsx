import React from "react";
import GoddessPageLayout from "../components/GoddessPageLayout.js";
import { GODDESSES } from "../constants.js";
import NikeApp from "./nike.js";

const NikePage: React.FC = () => {
  const nike = GODDESSES.find((g) => g.id === "nike")!;

  return (
    <GoddessPageLayout goddess={nike}>
      <NikeApp />
    </GoddessPageLayout>
  );
};

export default NikePage;
