import React, {useEffect,useState,useContext} from "react";
import {UserContext} from "../../App";
import {Link} from "react-router-dom";

const Home = ()=>{
    const [data,setData] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    useEffect(()=>{
        fetch("/allposts",{
            headers : {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
        
            setData(data.posts);
        })
    },[])

    const likePost = (id)=>{
        fetch('/like',{
            method : "put",
            headers : {
                "Authorization" : "Bearer "+localStorage.getItem("jwt"),
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                postID : id
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result;
                }else{
                    return item;
                }
            })
            
            setData(newData);
        }).catch(err=>console.log(err))
    }
    
    const unlikePost = (id)=>{
        fetch('/unlike',{
            method : "put",
            headers : {
                "Authorization" : "Bearer "+localStorage.getItem("jwt"),
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                postID : id
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result;
                }else{
                    return item;
                }
            })
          
            setData(newData);
        }).catch(err=>console.log(err))
    }

    const makeComment = (text,postID)=>{
        fetch("/comment",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postID,
                text 
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>console.log(err))
    }

    return (
        <div>
            <div className="home">
            {
                data.map((item,index)=>{
                  
                    return (
                    <div className="card home-card" key={item._id}>
                        <div style={{marginBottom:"4px",marginTop:"4px",marginLeft:"10px"}}>
                        <Link to={item.postedBy._id!==state._id?"/profile/"+item.postedBy._id:"/profile"}>
                            <img style={{width:"50px",height:"50px",borderRadius:"25px",margin:"10px"}}
                                src={item.postedBy.pic}
                            /></Link>
                             <h5 style={{padding:"16px",display:"inline",position:"relative",bottom:"20px"}}><Link to={item.postedBy._id!==state._id?"/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.username}</Link></h5>
                        </div>
                        <div className="card-image">
                            <img src= {item.photo} />
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id)
                                ?   <i className="material-icons blue-text text-darken-4" onClick={()=>unlikePost(item._id)}>thumb_up</i>
                                :   <i className="material-icons black-text text-lighten-4" onClick = {()=>{likePost(item._id)}}>thumb_up</i>
                            }
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.map((record,index)=>{
                                    return <h6><span style={{fontWeight:"500"}}>{record.postedBy.username+"  "}</span>{record.text}</h6>
                                })
                            }
                            <form onSubmit = {event=>{
                                makeComment(event.target[0].value,item._id);
                                event.target[0].value="";
                                event.preventDefault();
                            }}> 
                                <input type="text"  placeholder="Add comment"/>
                            </form>
                        </div>
                    </div>  
                    )
                })}
                  
            </div>
        </div>
    );
}

export default Home;