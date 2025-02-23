import AddDay from "../components/AddDay";
import TotalHours from "../components/TotalHours";

function HomePage() {
  return (
    <div className="homepage-container">
      <AddDay />
      <TotalHours />
    </div>
  );
}

export default HomePage;
