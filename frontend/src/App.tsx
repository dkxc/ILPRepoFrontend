import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [filter, setFilter] = useState(localStorage.getItem("filter") || 0); // 0 - No filter, 1 - filter by Name
  useEffect(() => {
    setFilter(1);
    localStorage.setItem("filter", filter.toString());
  });

  return (
    <>
      <div className="text-primary font-test dark:text-primary-dark font-primary">
        {filter}
      </div>
    </>
  );
}

export default App;
