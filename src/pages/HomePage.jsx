import AddDay from "../components/AddDay";
import TotalHours from "../components/TotalHours";
import User from "../components/user";
import { UserProviderWrapper } from "../context/usercontext";
import "./HomePage.css";

function HomePage() {
  return (
      <div className="homepage-container">
        <div className="forms">
          <User />
          <AddDay />
        </div>
        <TotalHours />
      </div>
  );
}

export default HomePage;
