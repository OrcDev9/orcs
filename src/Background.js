//Background.js
import React from 'react';
import background from "./media/newbg.png"
const Background = ( { children } ) =>
{
    return (
       
        <body style={{background: "#111111", backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
      
            {children}
        </body>
    )
}

export default Background;