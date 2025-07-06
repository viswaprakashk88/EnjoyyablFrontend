import React, { createContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './LoginPage';
import Temp from './Temp';
import Login from './Login';

export const PlayerContext = createContext();




const extractedSong = JSON.parse(window.localStorage.getItem("songDetails"));

function IndexHelp () {
    const [spotifyPlayer, setSpotifyPlayer] = useState(null);
    const [songDetails, setSongDetails] = useState(extractedSong);
    const [partyMode, setPartyMode] = useState(false);
    const [groupTab, setGroupTab] = useState(1);
    const [groupName, setGroupName] = useState("");
    const [groupMembers,setGroupMembers] = useState([]);
    const [createdOn, setCreatedOn] = useState("");
    const [groupId, setGroupId] = useState("");

    //This code is for Test API fetching data from Spring Boot Backend
    // async function springTest () {
    //   var response = await fetch ("http://localhost:3002/firstCall");
    //   console.log(response);
    // }
    // useEffect( () => {
    //   springTest();
    // }, []);

    


    //Spotify Web Playback Initialiazation
    window.onSpotifyWebPlaybackSDKReady = async () => {
        const player = new window.Spotify.Player({
            name : 'Prakash Application for Spotify',
            getOAuthToken : callback => { callback(window.localStorage.getItem('accessToken'))},
            volume : 1.0
        });
        //Setting the spotifyPlayer
        setSpotifyPlayer(player);
        console.log(spotifyPlayer);
    }
    return (
        (spotifyPlayer) ?
            (<PlayerContext.Provider value={{ spotifyPlayer, setSpotifyPlayer, songDetails, setSongDetails, partyMode, setPartyMode, groupTab, setGroupTab, groupName, setGroupName, groupMembers, setGroupMembers, createdOn, setCreatedOn, groupId, setGroupId}}>
                <App />
            </PlayerContext.Provider> )
            : (<App/>)
        // <Temp/>
    );


}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(    
    <IndexHelp />
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
