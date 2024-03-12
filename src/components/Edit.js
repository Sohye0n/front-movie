import React,{Component,Fragment,useEffect, useState} from 'react';
import Graph from "vis-react";
import axios from "axios";
import Interceptor from "../utils/L";
import {useNavigate} from 'react-router-dom';


const Edit=({name,content,url})=>{
    return(
        <div>
            <img src={url} alt={name} style={{ width: '150px', height: 'auto' }}/>
            <p>{name}</p>
            <p>{content}</p>
        </div>
    )
}
export default Edit;