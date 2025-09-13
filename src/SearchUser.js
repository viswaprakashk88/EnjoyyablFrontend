import React, { useEffect, useState} from 'react';
import UserCard from './UserCard';
import LoadingAnimation from './LoadingAnimation.gif';
import SearchUserAnimation from './SearchUser.gif';


function SearchUser () {
    const backend = process.env.REACT_APP_BACKEND;
    const [currentSearch, setCurrentSearch] = useState("");
    const [searchedUserList, setSearchedUserList] = useState([]);
    const [load, setLoad] = useState("");
    const [searched, setSearched] = useState(false);
    var dict = {};
    useEffect ( () => {
        //Getting the already cached data into the page
        if (window.localStorage.getItem("searchedUser") && window.localStorage.getItem("searchedUser") !== "" )
        {
            document.getElementById("searchUser").value = window.localStorage.getItem("searchedUser");
            setSearchedUserList(window.localStorage.getItem("searchedUserList") !== "undefined" ? JSON.parse(window.localStorage.getItem("searchedUserList")) : []);
            // setCurrentSearch(window.localStorage.getItem("searchedUser"));
        }
    },[]);
    //Searching for Users
    const searchUser = async (e) => {
        const searchUserValue = document.getElementById("searchUser").value;
        if (e.key === "Enter") {
            setSearched(true);
            setCurrentSearch("Showing Results For " + searchUserValue);
            //Retrieving Users having "searchUserValue" in their Name or Username
            var users = await fetch(`${backend}/searchUser`, {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    backendToken: window.localStorage.getItem("backendToken"),
                    userHint : searchUserValue,
                    username: window.localStorage.getItem("username")
                })
            });
            users = await users.json();
            //Getting the connection requests sent by the current user 
            var requests = await fetch(`${backend}/getRequests`, {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    backendToken: window.localStorage.getItem("backendToken"),
                    userHint : searchUserValue,
                    username: window.localStorage.getItem("username")
                })
            });
            requests = await requests.json();
            console.log("Requests and Friends");
            console.log(requests);
            var tempRequests = requests["requests"];
            console.log(tempRequests);
            for(var i = 0; i < tempRequests.length; i++)
            {
                if (tempRequests[i].toUsername === window.localStorage.getItem("username")) {
                    dict[tempRequests[i].fromUsername] = tempRequests[i].frienshipStatus === "friends" ? "friends" : "accept";
                }
                else if (tempRequests[i].fromUsername === window.localStorage.getItem("username")) {
                    dict[tempRequests[i].toUsername] = tempRequests[i].frienshipStatus === "friends" ? "friends" : "requested";
                }
            }
            window.localStorage.setItem("connections", JSON.stringify(dict));
            const temp = currentSearch + "" ;
            //Caching the retrieved users
            if(users.items){
                window.localStorage.setItem("searchedUser", searchUserValue);
                window.localStorage.setItem("searchedUserList", JSON.stringify(users.items));
                setSearchedUserList(users.items);
            }
            else {
                setSearched(false);
                setCurrentSearch("No Result For " + searchUserValue);
            }
        }
        else {
            setCurrentSearch("");
            window.localStorage.removeItem("searchedUser");
            window.localStorage.removeItem("searchedUserList");
            
            setSearched(false);
        }
        if(window.localStorage.getItem("searchedUser") && window.localStorage.getItem("searchedUser") !== searchUserValue){
            window.localStorage.removeItem("searchedUser");
            window.localStorage.removeItem("searchedUserList");
            setSearchedUserList([]);
        }
    };

    return (
        <div>
            <center>
                <input type = "text" name = 'searchuser' id = 'searchUser' onKeyDown = {searchUser} className = "searchBar" placeholder='Hit Enter To Search Users' spellCheck = "false"/>
                <br />
                <h4 style = { {color: "#14f5cf", paddingBottom: "10px"} }>{ currentSearch !== "" && currentSearch}</h4>
                <table>
                    <tbody>
                        {searchedUserList.map((item, index) => (
                            (item.user !== window.localStorage.getItem("username"))?
                                <UserCard key={index} data-index={index} userData = {item} />
                            : null
                        ))}
                        
                    </tbody>
                </table>
                {searchedUserList.length < 1 && searched && <img src = {LoadingAnimation} style = {{width: "100px",height: "100px"}} />}
                {!searched && searchedUserList.length < 1 && <img style = {{width: "270px",height: "200px", borderRadius: "10px"}} src = {SearchUserAnimation} />}
            </center>
            <br/>
            <br/>
            <br/><br/>
            <br/>
            <br/><br/>
        </div>
        
    );
}
export default SearchUser;