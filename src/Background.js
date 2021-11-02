//Background.js
import React from 'react';

const Background = ( { children } ) =>
{
    return (
       
        <body style={{background: "#111111"}}>
            {children}
        </body>
    )
}

export default Background;