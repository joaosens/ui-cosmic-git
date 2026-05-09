import { useState, useEffect, useRef } from "react";
import "./index.css"; // File with Tailwind
import ProfileCard from "./components/github/ProfileCard.jsx";  // Components has capitalize letter in start place
import AboutCard from "./components/github/AboutCard.jsx"; // Components = .jsx  
import StarTrigger from "./components/effects/Startrigger.jsx";
import StatsReveal from "./components/github/Statsreveal.jsx";
import BackgroundStars from "./components/effects/BackgroundStars.jsx";
import ShootingStar from "./components/effects/ShootingStar.jsx"
/*
- App.jsx doesn't needs format file in path, recognizes anyway
===> Hooks <===
- 'useState manages states for changes behavior conforms 'useEffect' action  
- 'useEffect' manages "What will happens" and leads next step to change state of UI
*/

function App() {
  const [flipped, setFlipped] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const statsRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {  // Timeout to preventing conflict with Loading time  
      statsRef.current?.scrollIntoView({  //Scrolls and centralize any Element
      behavior: "smooth",
      block: "end",
    })}, 350)
    return () => clearTimeout(timer);
    }, [showStats])

    return (
      <>
        
        {showStats && (
          <div className="
            fixed
            inset-0
            bg-black/50
            backdrop-blur-md
            z-20
          " />
        )}
    
        <div className="
          relative
          min-h-screen
          bg-gradient-to-br
          from-black
          via-gray-800
          to-purple-900
          text-white
          flex flex-col
          items-center
          justify-start
          py-20
        ">
    
          <BackgroundStars />
          <ShootingStar />   
          <div
            onClick={() => setFlipped(!flipped)}
            className="
              cursor-pointer
              hover:scale-105
              transition
            "
          >
            {flipped
              ? <AboutCard />
              : <ProfileCard />
            }
          </div>
          <StarTrigger
            onReveal={() =>  
              setShowStats(true)}
          />
    
          {showStats && (
            <StatsReveal onClick={() => 
              setShowStats(false)
            } ref={statsRef} />
          )}
    
          </div>   
      </>
    )
}
export default App