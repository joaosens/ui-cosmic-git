import { useState } from "react";

function BackgroundStars() { 
    const [stars] = useState(()=>  {// If not return anything or hasn't variables and conditions doesn't need a curly brackets 
        return Array.from({ length:200 }, ()=>{ // Needs parentheses for objects in arrow functions
          const random = Math.random();
          let type = "small";
          if (random >= 0.98) type = "hero";
          else if (random > 0.9) type = "medium";
          return {type, 
            size: random * 1.5 + 0.5,
            top: Math.random() * 100,
            left: Math.random() * 100,
            opacity: Math.random(),
            animationDelay: Math.random() * 5,
            blur: Math.random() > 0.7,
          };
          });});
    return( 
      <div className="absolute 
      inset-0 
      z-0 
      overflow-hidden 
      bg-[radial-gradient(circle_at_top,rgba(80,100,255,0.12),transparent_45%)">
        {stars.map((star,i)=> {
        return(
          <div key={i} className="absolute 
          rounded-full 
          bg-white 
          animate-twinkle 
          mix-blend-screen"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            opacity: `${star.opacity}`,
            animationDelay: `${star.animationDelay}s`,
            filter: `${star.type !== "small"  ? "blur(1px)" : "none"}`,
            boxShadow: `${star.type === "hero" ? "0 0 20px rgba(180,220,255,0.7)" : "0 0 5px rgba(50,255,235,0.8)"}`
          }} />);
      })}</div>
    )
 }

export default BackgroundStars;