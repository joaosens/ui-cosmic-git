import { useState, useEffect } from "react";
import "./index.css"; // File with Tailwind
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading)
    return (
      <h1 className="text-center text-white/50 font-bold animate-pulse space-y-4">
        Loading...
      </h1>
    );
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-purple-900 text-white flex flex-col items-center justify-center">
      <div onClick={() =>
        setFlipped(!flipped)} className="cursor-pointer hover:scale-105 transition" > {/* If click stays with different state of 'flipped'*/}
        {flipped ? <AboutCard /> : <ProfileCard />} {/* Now changes by condition in compare with 'flipped'*/}
      </div>
      <StarTrigger onClick={() =>
        setShowStats(true)} />
      {showStats && <StatsReveal />}
    </div>
  );
}
export default App

