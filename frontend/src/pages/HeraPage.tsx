import React from "react";
import GoddessPageLayout from "../components/GoddessPageLayout";
import { GODDESSES } from "../../../constants";
import App from "../../hera-frontend/app"; // Import the App component

const HeraPage: React.FC = () => {
  const hera = GODDESSES.find((g) => g.id === "hera")!;

  return (
    <GoddessPageLayout goddess={hera}>
      <div>
        <App />
      </div>
    </GoddessPageLayout>
  );
};

export default HeraPage;