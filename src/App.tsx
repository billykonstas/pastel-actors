import React from "react";
import ActorsTable from "./components/ActorsTable";
import "./index.css";
function App() {
  return (
    <div className="sm:p-10 p-2 flex flex-col gap-20">
      <ActorsTable />
    </div>
  );
}

export default App;
