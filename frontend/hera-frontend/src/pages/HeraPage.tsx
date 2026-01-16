import React from "react";
import GoddessPageLayout from "../components/GoddessPageLayout.js";
import { GODDESSES } from "../constants.js";
import App from "../../app.js"; // Import the App component

const HeraPage: React.FC = () => {
  const hera = GODDESSES.find((g) => g.id === "hera")!;
console.log("BACKEND URL:", import.meta.env.VITE_PANTHEON_BACKEND_URL);

  return (
    
    <GoddessPageLayout goddess={hera}>
      <div>
        <App />
      </div>
    </GoddessPageLayout>
  );
};

export default HeraPage;