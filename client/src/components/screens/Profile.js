import React,{useEffect,useState,useContext,useRef} from "react";
import {UserContext} from "../../App";
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import {Link,useHistory} from "react-router-dom";
import M from "materialize-css";

const Profile = ()=>{
    const history = useHistory();
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [selectedImage,setSelectedImage] = useState(null);
    const [pics,setPics]=useState([]);
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);
    const {state,dispatch} = useContext(UserContext);
    const [name,setName] = useState("");
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
  
   const inputRef = useRef("");
    useEffect(()=>{
        fetch("/mypost",{
            headers : {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
           
            setPics(data.myPost);
        })
    },[])


    const uploadFields = ()=>{
        if(email!=="" && !re.test(email)){
            M.toast({html: "Invalid E-mail",classes:"#b71c1c red darken-3"});
            return;
        }
        fetch("/uploadpic",{
            method: "put",
            headers: {
                "Authorization" : "Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                username : username===""?undefined:username,
                name : name===""?undefined:name,
                email : email===""?undefined:email,
                pic: url
            })
        }).then(res=>res.json())
        .then(data=>{
           
            if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-3"});
                setName("");
                setEmail("");
                setImage("");
                setUrl(undefined);
                setUsername("");
                return;
            }else{
                localStorage.setItem("user",JSON.stringify({...state,...data}))
                dispatch({type:"UPDATEPIC",payload:data})
                M.toast({html: "Profile Successfully Updated",classes:"#7cb342 light-green darken-1"});
                setName("");
                setEmail("");
                setImage("");
                setUrl(undefined);
                setUsername("");
                history.push("/profile");
            }
        })   
    }

    const uploadPic=()=>{
        if(image!=""){
            const data = new FormData();
          
            data.append("file",image);
            data.append('upload_preset',"piczone"); 
            data.append('cloud_name','cloud-piczone');
            fetch("https://api.cloudinary.com/v1_1/cloud-piczone/image/upload",{
                method: "post",
                body: data
            }).then(res=>res.json())
            .then(data=>{
                setUrl(data.secure_url);
               
                inputRef.current.value="";
                uploadFields();
            })
            .catch(err=>console.log(err))
        }else{
            uploadFields();
        }
    }

    const deletePost = (postID)=>{
        fetch(`/deletepost/${postID}`,{
            method : "delete",
            headers : {
                Authorization : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
           
            const newPic = pics.filter(item=>item._id!==result._id);
            setPics(newPic);
            setSelectedImage(null);
        })
    }
    return (
        <div style={{maxWidth:"1050px",margin:"0px auto"}}>
            <div style={{display:"flex",justifyContent:"flex-start",margin:"20px 70px",borderBottom:"1px solid grey"}}>
                <div style={{marginBottom:"4px",marginRight:"60px"}}>
                    <img style={{width:"140px",height:"140px",borderRadius:"75px"}}
                        src={state?state.pic:"loading.."}
                    />
                </div>
                <div>
                    <h4>{state?state.username:"loading"}</h4>
                    <h5 style={{fontFamily:"cursive"}}>{state?state.name:"loading"}</h5>
                    <div style={{display:"flex",width:"108%",justifyContent:"space-between",position:"relative",left:"auto"}}>
                        <h6>{pics.length} posts</h6>
                        <h6>{state?state.followers.length:0} followers</h6>
                        <h6>{state?state.following.length:0} following</h6>
                    </div>
                </div>
                <div style={{position:"relative",right:"10px"}}>
                    <a href="#modal1" className="modal-trigger"><i className="material-icons black-text text-darken-4 right" data-tip data-for="editPic" style = {{padding:"10px"}}>edit</i></a>
                    <ReactTooltip id="editPic"><span>Edit Profile</span></ReactTooltip>
                </div>
                <div id="modal1" className="modal">
                    <input style={{padding:"10px",margin:"10px"}} type="text" placeholder="Username"  value={username} onChange={event=>setUsername(event.target.value)}/>
                    <input style={{padding:"10px",margin:"10px"}} type="text" placeholder="FullName" value={name} onChange={event=>setName(event.target.value)}/>
                    <input style={{padding:"10px",margin:"10px"}} type="email" placeholder="E-mail" value={email} onChange={event=>setEmail(event.target.value)}/>
                    <div className="file-field input-field modal-content">
                        <div className="btn waves-effect waves-light #ff1744 red accent-3">
                            <span>Update Profile Pic</span>
                            <input type="file" id="file1" onChange={event=>{console.log("EVENT :",event);setImage(event.target.files[0])}}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" ref={inputRef}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="#" className="modal-close waves-effect waves-green btn-flat" onClick={()=>{uploadPic()}}>Submit</a>
                    </div>
                </div>
            </div>
            <div className="gallery">
            {
                pics.map((item,index)=>{
                    return <img className="item" src={item.photo} alt={item.title} key={item._id} onClick={()=>setSelectedImage(item)}/>
                })
            }
                
            </div>
            {
               selectedImage && 
               <Modal isOpen={true} style={{
                   overlay:{
                       backgroundColor :"grey"
                   },
                   content:{
                       maxHeight:"880px",
                       maxWidth:"880px",
                       margin:"20px auto"
                   }
               }} ariaHideApp={false}>
               <div className="container" style={{height:"100%",width:"100%"}}>
               <div>
                <i className="material-icons black-text text-darken-4 right" data-tip data-for="deletePost" style = {{padding:"10px"}} onClick={()=>deletePost(selectedImage._id)}>delete</i>
                <ReactTooltip id="deletePost"><span>Delete Post</span></ReactTooltip>
                <i className="material-icons black-text text-darken-4 right" data-tip data-for="closePost" style={{padding:"10px"}} onClick={()=>setSelectedImage(null)}>close</i>
                <ReactTooltip id="closePost"><span>Close Post</span></ReactTooltip>
                </div>
                <div id="left">
                        <img src = {selectedImage.photo} style={{maxHeight:"500px",width:"100%",objectFit:"contain"}} />
                    </div>
                    <div id="right">
                        <div className="row" style={{overflow:"scroll"}}>
                            <h6>{selectedImage.likes.length} likes</h6>
                            <h6>{selectedImage.title}</h6>
                            <p>{selectedImage.body}</p>
                            {
                                selectedImage.comments.map((record,index)=>{
                                    return <h6><span style={{fontWeight:"500"}}>{record.postedBy.username+"  "}</span>{record.text}</h6>
                                })
                            }
                        </div>
                    </div>
                    </div>
               </Modal>
            }
        </div>
    );
}

export default Profile;