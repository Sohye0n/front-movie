import React, {useEffect, useState} from 'react';
import Interceptor from "../utils/L"
import Network from '../components/Network';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import axios from "axios"

const CreateNetwork=()=>{
    const {idx}=useParams();
    const [nodeList,setNodeList]=useState([]);
    const [loading,setLoading]=useState(true);

    const getNodeList=async()=>{
        console.log(idx);
        const resp=(await Interceptor.get(`/network/${idx}`)).data;
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
                <Network
                    nodeList={nodeList}
                    boardId={idx}
                />
            )}
        </div>
    );
};

export default CreateNetwork;