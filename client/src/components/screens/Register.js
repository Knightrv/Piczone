import React,{useState,useEffect} from "react";
import {Link,useHistory} from "react-router-dom";
import M from "materialize-css";

const Register = ()=>{
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const history=useHistory();
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [username,setUsername]=useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);

    useEffect(()=>{
        if(url){
            uploadFields();
        }
    },[url])

    const uploadPic=()=>{
        const data = new FormData();
        data.append("file",image);
        data.append('upload_preset',"piczone"); 
        data.append('cloud_name','cloud-piczone');
        fetch("https://api.cloudinary.com/v1_1/cloud-piczone/image/upload",{
            method: "post",
            body: data
        }).then(res=>res.json())
        .then(data=>setUrl(data.secure_url))
        .catch(err=>console.log(err))
    }
    const uploadFields = ()=>{
        if(!re.test(email)){
            M.toast({html: "Invalid E-mail",classes:"#b71c1c red darken-3"});
            return;
        }
        fetch("/register",{
            method: "post",
            headers: {
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                username,
                name,
                email,
                password,
                pic: url
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

    const postData=()=>{
        if(image){
            uploadPic();
        }else{
            uploadFields();
        }
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>PicZone</h2>
                <input type="text" placeholder="Username" value={username} onChange={event=>setUsername(event.target.value)}/>
                <input type="text" placeholder="FullName" value={name} onChange={event=>setName(event.target.value)}/>
                <input type="email" placeholder="E-mail" value={email} onChange={event=>setEmail(event.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={event=>setPassword(event.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #ff1744 red accent-3">
                        <span>Upload Profile Pic</span>
                        <input type="file" onChange={event=>setImage(event.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #ff1744 red accent-3" type="submit" name="action" onClick={()=>postData()}>Register</button>
                <h6><Link to="/login">Already have an account?</Link></h6>
            </div>
        </div>
    ); 
}

export default Register;