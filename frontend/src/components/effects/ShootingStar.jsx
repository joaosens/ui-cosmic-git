function ShootingStar() {
    return (
        <div id="wrapper" className="relative absolute animate-shootingstar">
            <div id="head" className="rounded-full 
            w-[5px] h-[5px] 
            bg-[rgba(178, 213, 243, 0.8)] 
            blur-[1px]">
                <span className="shadow-[8px_3px_20px_rgba(175,238,238,0.7)] animate-twinkle-sh">
                </span> 
            </div>
            <div id="tail" className="absolute
            right-full 
            top-1/2 
            -translate-y-1/2
            w-[100px] 
            h-[2px] 
            bg-gradient-to-l 
            from-cyan-100/80 via-cyan-100/30 to-transparent
            blur-[1px]
            shadow-[8px_5px_10px_rgba(165,243,252,0.5)]
            animate-twinkle-sh">    
            </div> 
        </div>
    )
} 

export default ShootingStar;