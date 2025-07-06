import React, { useEffect } from 'react';

function Temp () {

    useEffect(() => {
        async function getAccessToken () {
            var accessTokenResponse = await fetch('http://localhost:3002/firstCall', {
                method: "POST",
                headers: { 
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                code: "ThisIsTheCode"
                }),
            });
        accessTokenResponse = await accessTokenResponse.json();
        console.log(accessTokenResponse);
        }
        getAccessToken();
    }, []);
    return (<>Good Morning</>);
}


export default Temp;