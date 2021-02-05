import React,{useState} from "react";
import {useHistory}  from "react-router-dom";
import M from "materialize-css";


const ResetPassword = ()=>{
    const [email,setEmail]  = useState("");
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const history =useHistory();
    const checkEmail= ()=>{
        if(!re.test(email)){
            M.toast({html: "Invalid E-mail",classes:"#b71c1c red darken-3"});
            return;
        }
        fetch('/reset-password',{
            method:"post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                email
            })
        }).then(res=>res.json())
        .then(data=>{
       
            if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-3"});
                return;
            }else{
                M.toast({html: data.message,classes:"#7cb342 light-green darken-1"});
                history.push("/resetpassword/"+data.token);
            }
        }).catch(err=>console.log(err))
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>PicZone</h2>
                <input type="email" placeholder="Enter e-mail" value={email} onChange={event=>setEmail(event.target.value)}/>
                <button className="btn waves-effect waves-light #ff1744 red accent-3" type="submit" name="action" onClick={()=>checkEmail()}>Reset Password</button>
            </div>
        </div>
    );
}




export default ResetPassword;