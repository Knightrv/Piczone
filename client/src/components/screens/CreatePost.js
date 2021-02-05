import React, { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = ()=>{
    const [title,setTitle] = useState("");
    const [caption,setCaption] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl]= useState("");
    const history=useHistory();
    useEffect(()=>{
        if(url){
            fetch("/createpost",{
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    caption,
                    image:url
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error,classes:"#b71c1c red darken-3"});
                    return;
                }else{
                    M.toast({html: "Post created Successfully :)",classes:"#7cb342 light-green darken-1"});
                    history.push("/");
                }
            }).catch(err=>console.log(err))
        }
    },[url])
    const postData=()=>{
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
    return (
        <div className="card input-field" style={{margin:"20px auto",maxWidth:"550px",padding:"20px"}}>
            <input type="text" placeholder="Title" value={title} onChange={event=>setTitle(event.target.value)}/>
            <input type="text" placeholder="Caption" value={caption} onChange={event=>setCaption(event.target.value)}/>
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #ff1744 red accent-3">
                    <span>Upload Image</span>
                    <input type="file" onChange={event=>setImage(event.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #ff1744 red accent-3" type="submit" name="action" style={{margin:"10px auto",display:"flex"}} onClick={()=>postData()}>Post</button>
        </div>
    )
}

export default CreatePost;