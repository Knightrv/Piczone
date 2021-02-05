import React,{useEffect,createContext,useReducer,useContext} from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import {BrowserRouter,Route,useHistory,Switch} from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import UserProfile from "./components/screens/UserProfile";
import ResetPassword from "./components/screens/ResetPassword";
import Register from "./components/screens/Register";
import CreatePost from "./components/screens/CreatePost";
import FollowingProfile from "./components/screens/FollowingProfile";
import NewPassword from "./components/screens/NewPassword";
import {reducer,initialState} from "./reducers/userReducer";
import 'materialize-css/dist/css/materialize.min.css';


export const UserContext = createContext();

const Routing = ()=>{ 
		const history = useHistory();
		const {state,dispatch} = useContext(UserContext);
		useEffect(()=>{
			const user = JSON.parse(localStorage.getItem("user"));
			if(user){
					dispatch({type:"USER",payload:user});
			}else{
				if(!history.location.pathname.startsWith('/resetpassword')){
					history.push("/login");
				}
			}
		},[])
    return (
      <Switch>
				<Route exact path="/">
						<Home />
				</Route>
				<Route path="/register">
					<Register />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				<Route exact path="/profile">
					<Profile />
				</Route>
				<Route path="/create">
					<CreatePost />
				</Route>
				<Route path="/profile/:userID">
					<UserProfile />
				</Route>
				<Route path="/myfollowingposts">
					<FollowingProfile />
				</Route>
				<Route exact path="/resetpassword" >
					<ResetPassword />
				</Route>
				<Route path="/resetpassword/:token">
					<NewPassword />
				</Route>
      </Switch> 
    )
}

function App() {
	const [state,dispatch] = useReducer(reducer,initialState)
  return (
		<UserContext.Provider value={{state,dispatch}}>
			<BrowserRouter> 
				<Navbar />
				<Routing />
			</BrowserRouter>
		</UserContext.Provider>
  );  
}

export default App;
