import React, { useEffect, useState } from 'react';

function RequestCard ({userData}) {
    const backend = process.env.REACT_APP_BACKEND;
    var name = userData.fromName;
    const username = userData.fromUsername;
    const [buttonText, setButtonText] = useState("Accept");
    
    const accept = async (e) => {
        setButtonText("✅Friends")
        document.getElementById("requestButton_" + e.target.value).classList.add("userCardRequestButtonDisabled");
        document.getElementById("requestButton_" + e.target.value).classList.remove("userCardRequestButtonEnabled");
        const time = e.target.value;
        var acceptance = await fetch(`${backend}/acceptRequest`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                backendToken: window.localStorage.getItem("backendToken"),
                username : window.localStorage.getItem("username"),
                time : time
            })
        });
        acceptance = await acceptance.json();
        console.log(acceptance);
        window.localStorage.removeItem("requestsList");
        window.localStorage.removeItem("requestsCount");
    }

    return (
        <>
            <tr className = 'userCardSection'>
                <td className = "userCardName">
                    <h3>{name}</h3>
                    <h5  className = "userCardUsername">@{username}</h5>
                </td>
                <td className = "userCardButton">
                    <button id = {"requestButton_" + userData.time} className = "userCardRequestButton userCardRequestButtonEnabled" value = { userData.time } onClick = {accept} >{buttonText}</button>
                </td>
            </tr>
            <br/>
        </>
    );
}
export default RequestCard;