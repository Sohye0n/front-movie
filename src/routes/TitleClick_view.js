import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Board from '../components/Board';
import Interceptor from "../utils/L"

const TitleClick_view=()=>{
    const {idx}=useParams();
    const [nodeList,setNodeList]=useState([]);
    const [board,setBoard]=useState({});
    const [loading,setLoading]=useState(true);
    const getNodeList=async()=>{
        const resp=(await Interceptor.get(`/board/view/${idx}`)).data;
        console.log(resp)
        setNodeList(resp);
        setLoading(false);
    }

    useEffect(()=>{
        getNodeList();
      },[]);
    
    return(
        <div>
            {loading?(
                <h2>loading...</h2>
            ):(
                <Board
                    nodeList={nodeList}
                />
            )}
        </div>
    );
};

export default TitleClick_view;