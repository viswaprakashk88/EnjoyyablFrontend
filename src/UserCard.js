import React, { useEffect, useState } from 'react';

function UserCard ({userData}) {
    const backend = process.env.REACT_APP_BACKEND;
    const connections = JSON.parse(window.localStorage.getItem("connections"));
    const [friendStatus, setFriendStatus] = useState("Connect");
    var name = userData.name.split(' '),tempName="";
    for (let i=0;i<name.length;i++) {tempName +=  name[i].charAt(0).toUpperCase() + name[i].slice(1) + " ";}
    name = tempName.slice(0,tempName.length-1);
    useEffect( () => {
        console.log(userData);
        if (connections && userData.user in connections && document.getElementById("requestButton_" + userData.user)) {

            setFriendStatus(connections[userData.user] === "friends" ? "✅Friends" : (connections[userData.user] === "accept" ? "✅Accept" : "Request Sent"));
            
            document.getElementById("requestButton_" + userData.user).disabled = true;
            document.getElementById("requestButton_" + userData.user).classList.remove("userCardRequestButtonEnabled");
            document.getElementById("requestButton_" + userData.user).classList.add("userCardRequestButtonDisabled");
        } else {
            setFriendStatus("Connect");
            document.getElementById("requestButton_" + userData.user).disabled = false;
            document.getElementById("requestButton_" + userData.user).classList.add("userCardRequestButtonEnabled");
            document.getElementById("requestButton_" + userData.user).classList.remove("userCardRequestButtonDisabled");
        }
    });
    const request = async (e) => {
        const date = new Date();
        const splittedParts = e.target.value.split("&#&");
        const nameCurrentUser = JSON.parse(window.localStorage.getItem("userInfo"));


        var result = await fetch(`${backend}/sendConnectionRequest`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                backendToken: window.localStorage.getItem("backendToken"),
                sendFromUsername : window.localStorage.getItem("username"),
                sendToUsername : splittedParts[0],
                sendTime : date.getTime(),
                sendName : splittedParts[1],
                sendMyName : nameCurrentUser.name
            })
        });
        result = await result.json();
        setFriendStatus("Request Sent")
        document.getElementById("requestButton_" + userData.user).disabled = true;
        document.getElementById("requestButton_" + userData.user).classList.remove("userCardRequestButtonEnabled");
        document.getElementById("requestButton_" + userData.user).classList.add("userCardRequestButtonDisabled");
    }
    return (
        <>
            <tr className = 'userCardSection'>
                <td className = "userCardName">
                    <h3>{name}</h3>
                    <h5  className = "userCardUsername">@{userData.user}</h5>
                </td>
                <td className = "userCardButton">
                    <button id = {"requestButton_" + userData.user} className = "userCardRequestButton userCardRequestButtonEnabled" value = { userData.user + "&#&" + userData.name }  onClick = {request}>{friendStatus}</button>
                </td>
            </tr>
            <tr className = "spacing">
                <td></td>
            </tr>
            <tr className = "spacing">
                <td></td>
            </tr>
        </>
    );
}

export default UserCard;