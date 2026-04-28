import { useState } from "react";
import ProfileCard from "./components/ProfileCard.jsx";  // Components has capitalize letter in start place
import AboutCard from "./components/AboutCard.jsx"; // Components = .jsx  
import StarTrigger from "./components/Startrigger.jsx";
import StatsReveal from "./components/Statsreveal.jsx";
/*
- App.jsx doesn't needs format file in path, recognizes anyway
===> Hooks <===
- 'useState manages states for changes behavior conforms 'useEffect' action  
- 'useEffect' manages "What will happens" and leads next step to change state of UI
*/
function App() {
  const [flipped, setFlipped] = useState(false);
  const [showStats, setShowStats] = useState(false);
  return (
    <div className='app'>
      <div onClick={() =>
        setFlipped(!flipped)}> {/* If click stays with different state of 'flipped'*/}
        {flipped ? <AboutCard /> : <ProfileCard />} {/* Now changes by condition in compare with 'flipped'*/}
      </div>
      <StarTrigger onClick={() =>
        setShowStats(true)} />
      {showStats && <StatsReveal />}
    </div>
  );
}
export default App

