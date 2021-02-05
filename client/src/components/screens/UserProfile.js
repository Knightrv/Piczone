import React,{useEffect,useState,useContext} from "react";
import {UserContext} from "../../App";
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import {useParams,useHistory} from "react-router-dom";

const UserProfile = ()=>{
    const {userID} = useParams();
    const {state,dispatch} = useContext(UserContext);
    const [selectedImage,setSelectedImage] = useState(null);
    const [showFollow,setShowFollow] = useState(state?!state.following.includes(userID):true);
    const [userProfile,setProfile]=useState(null);

   const history = useHistory();
 
    useEffect(()=>{
        fetch("/user/"+userID,{
            headers : {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
           
            if(data.error && data.error==="same"){
                history.push("/profile");
            }
            else{
                setProfile(data);
            }
        })
    },[])
    const followUser = ()=>{
        fetch('/follow',{
            method: "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                followId : userID
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following: data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState=>{
                
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : [...prevState.user.followers,data._id]
                    }
                }
            }))
            setShowFollow(false);
        })
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method: "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                unfollowId : userID
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following: data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState=>{
                
                const newFollower = prevState.user.followers.filter(item=>item !=data._id);
              
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : newFollower
                    }
                }
            }))
            setShowFollow(true);
        })
    }

    return (
        <>
        {!userProfile?<h2>Loading..</h2>:
        <div style={{maxWidth:"1050px",margin:"0px auto"}}>
            <div style={{display:"flex",justifyContent:"flex-start",margin:"20px 70px",borderBottom:"1px solid grey"}}>
                <div style={{marginBottom:"4px",marginRight:"60px"}}>
                    <img style={{width:"140px",height:"140px",borderRadius:"75px"}} src={userProfile?userProfile.user.pic:"loading"}/>
                </div>
                <div>
                    <h4>{userProfile.user.username}</h4>
                    <h5 style={{fontFamily:"cursive"}}>{userProfile.user.name}</h5>
                    <div style={{display:"flex",width:"108%",justifyContent:"space-between",position:"relative",left:"auto"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {showFollow && <button style={{margin:"10px"}} className="btn waves-effect waves-light #ff1744 red accent-3" type="submit" name="action" onClick={()=>followUser()}>Follow</button>}
                    {!showFollow && <button style={{margin:"10px"}} className="btn waves-effect waves-light #ff1744 red accent-3" type="submit" name="action" onClick={()=>unfollowUser()}>Unfollow</button>}
                </div>
            </div>
            <div className="gallery">
            {
                userProfile.posts.map((item,index)=>{
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
        
        }
        </>
    );
}

export default UserProfile;