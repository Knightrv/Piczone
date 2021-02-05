import React,{useState,useContext} from "react";
import {Link,useHistory} from "react-router-dom";
import {UserContext} from "../../App";
import M from "materialize-css";

const Login = ()=>{
    const {state,dispatch} = useContext(UserContext);
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const history=useHistory();
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");

    const loginData=()=>{
        if(!re.test(email)){
            M.toast({html: "Invalid E-mail",classes:"#b71c1c red darken-3"});
            return;
        }
        fetch("/login",{
            method: "post",
            headers: {
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            
            if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-3"});
                return;
            }else{
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type: "USER",payload:data.user})
                M.toast({html: "Successfully Logged in :)",classes:"#7cb342 light-green darken-1"});
                history.push("/");
            }
        }).catch(err=>console.log(err))
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>PicZone</h2>
                <input type="email" placeholder="E-mail" value={email} onChange={event=>setEmail(event.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={event=>setPassword(event.target.value)}/>
                <button className="btn waves-effect waves-light #ff1744 red accent-3" type="submit" name="action" onClick={()=>loginData()}>Login</button>
                <h6><Link to="/register">Don't have an account?</Link></h6>
                <h6><Link to="/resetpassword">Forgot Password ?</Link></h6>
            </div>
        </div>
    );
}

export default Login;