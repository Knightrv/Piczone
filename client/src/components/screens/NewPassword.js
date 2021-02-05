import React,{useState} from "react";
import {useHistory,useParams} from "react-router-dom";
import M from "materialize-css";

const NewPassword = ()=>{
    const history=useHistory();
    const [password,setPassword]=useState("");
    const {token} = useParams();
    const updatePassword=()=>{
        fetch("/new-password",{
            method: "post",
            headers: {
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
        
            if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-3"});
                return;
            }else{
                M.toast({html: data.message,classes:"#7cb342 light-green darken-1"});
                history.push("/login");
            }
        }).catch(err=>console.log(err))
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>PicZone</h2>
                <input type="password" placeholder="Enter new password" value={password} onChange={event=>setPassword(event.target.value)}/>
                <button className="btn waves-effect waves-light #ff1744 red accent-3" type="submit" name="action" onClick={()=>updatePassword()}>Update Password</button>
            </div>
        </div>
    );
}

export default NewPassword;