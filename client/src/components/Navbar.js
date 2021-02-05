import React,{useContext,useState,useEffect,useRef} from "react";
import {Link,useHistory} from "react-router-dom"; 
import {UserContext} from "../App";
import M from "materialize-css";

const Navbar = ()=>{
    const searchModal = useRef(null);
    const {state,dispatch} = useContext(UserContext);
    const [search,setSearch] = useState("");
    const [userDetails,setUserDetails] = useState([]);
    const history = useHistory();
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const fetchUsers = (query)=>{
        setSearch(query);
        fetch('/search-users',{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>setUserDetails(results.user))
    }
    const renderList = ()=>{
        if(state){
            return [
                <li key={"7"}><i data-target="modal2" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
                <li key={"1"}><Link to="/profile">Profile</Link></li>,
                <li key={"2"}><Link to="/create">Create Post</Link></li>,
                <li key={"6"}><Link to="/myfollowingposts">My Following Posts</Link></li>,
                <li key={"5"}>
                    <button className="btn waves-effect waves-light #ff1744 red accent-3" 
                        onClick={()=>{
                            localStorage.clear()
                            dispatch({type:"CLEAR"})
                            history.push("/login");
                        }}>Logout
                    </button>
                </li>
            ]
        }else{
            return [
                <li key={"3"}><Link to="/register">Register</Link></li>,
                <li key={"4"}><Link to="/login">Login</Link></li>
            ]
        }
    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state?"/":"/login"} className="brand-logo left">PICZONE</Link>
                    <Link to="#" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></Link>
                    <ul className="right hide-on-med-and-down">
                        {renderList()}
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                {renderList()}
            </ul>
            <div id="modal2" className="modal input-field" ref={searchModal}>
                <input 
                    style={{margin:"10px",padding:"10px"}}
                    type = "text"
                    placeholder= "Search Username"
                    value = {search}
                    onChange = {(event)=>fetchUsers(event.target.value)}
                />
                <ul className="collection">
                {
                    userDetails.map((item,index)=>{
                        return <Link to={item._id!==state._id?"/profile/"+item._id:"/profile"} onClick={()=>{M.Modal.getInstance(searchModal.current).close();setSearch("");setUserDetails([]);}}><li className="collection-item">{item.username}</li></Link>
                    })
                }
                </ul>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch("");setUserDetails([]);}}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;