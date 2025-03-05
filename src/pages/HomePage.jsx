import { useState } from "react";
import AddDay from "../components/AddDay";
import TotalHours from "../components/TotalHours";
import User from "../components/user";
import { UserProviderWrapper } from "../context/usercontext";
import "./HomePage.css";

function HomePage() {
  const [refresh, setRefresh] = useState(false);

  const handleAddHours = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <UserProviderWrapper>
      <div className="homepage-container">
        <div className="forms">
          <User />
          <AddDay onAddHours={handleAddHours} />
        </div>
        <TotalHours refresh={refresh} />
      </div>
    </UserProviderWrapper>
  );
}

export default HomePage;
