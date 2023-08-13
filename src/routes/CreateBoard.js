import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import Interceptor from "../utils/L";

const CreateBoard=()=>{
    const [Title,setTitle]=useState("");
    const [Content,setContent]=useState("");
    const [isPrivate,setIsPrivate]=useState(false);
    const navigate=useNavigate();

    const onTitleHandler=(event)=>{
        setTitle(event.currentTarget.value);
    }
    const onContentHandler=(event)=>{
        setContent(event.currentTarget.value);
    }
    const onSubmitHandler=async(event)=>{
        event.preventDefault();
        let data={
            title:Title,
            content:Content,
            isPrivate:isPrivate,
            id:0
        };

        try{
            const resp=await Interceptor.post("/newBoard",data);
            const boardID=resp.data;
            console.log(boardID);
            navigate(`/create/${String(boardID)}`);
        }
        catch(error){
            console.error(error);
        }

    }

    return(
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            width: '100%', height: '100vh'
            }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Title</label>
                <input type='Title' value={Title} onChange={onTitleHandler}/>
                <label>Content : write a short sentence to introuduce your network</label>
                <input type='Content' value={Content} onChange={onContentHandler}/>
                <label>Public</label>
                <select value={isPrivate} onChange={onContentHandler}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <br />
                <button formAction=''>
                    go
                </button>
            </form>
        </div>
    )
}

export default CreateBoard;