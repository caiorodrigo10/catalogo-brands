import { useEffect } from "react";

export const VideoPlayer = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f75ed6f75d1000a4d35bd/player.js";
    script.async = true;
    script.id = "scr_673f75ed6f75d1000a4d35bd";
    
    if (!document.getElementById(script.id)) {
      document.body.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById(script.id);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="mb-10 rounded-2xl overflow-hidden shadow-lg px-2 sm:px-0">
      <div 
        id="vid_673f75ed6f75d1000a4d35bd" 
        style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }}
        className="rounded-2xl overflow-hidden"
      >
        <img 
          id="thumb_673f75ed6f75d1000a4d35bd" 
          src="https://images.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f75ed6f75d1000a4d35bd/thumbnail.jpg" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: 'block',
          }} 
          alt="thumbnail"
          className="rounded-2xl"
        />
        <div 
          id="backdrop_673f75ed6f75d1000a4d35bd" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            width: '100%', 
            height: '100%',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
          className="rounded-2xl"
        />
      </div>
    </div>
  );
};