import React from "react";
import GoddessPageLayout from "../components/GoddessPageLayout";
import { GODDESSES } from "../../../constants";
import NikeApp from "./nike";

const NikePage: React.FC = () => {
  const nike = GODDESSES.find((g) => g.id === "nike")!;

  return (
    <GoddessPageLayout goddess={nike}>
      <NikeApp />
    </GoddessPageLayout>
  );
};

export default NikePage;
