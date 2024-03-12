import React, {useEffect, useState} from 'react';
import Interceptor from "../utils/L"
import Network from '../components/Network';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import axios from "axios"
import TMDB from '../utils/TMDB';

const CreateNetworkTv=()=>{
    const {tvidx,boardidx}=useParams();
    let arr=[];
    const [nodeList,setNodeList]=useState([]);
    const [loading,setLoading]=useState(true);

    //get data from TMDB
    const getNodeList=async()=>{
        const resp=await TMDB.fetchTvCreditData(tvidx);
        let i=0;
        const data=resp.cast;
        
        //TMDB -> frontend
        data.map((item)=>{
            let e={
                id:i++,
                label:item.character,
                title:"",
                shape:"circularImage",
                image:`https://image.tmdb.org/t/p/w500/${item.profile_path}`
            }
            arr.push(e);
        })
        setNodeList(arr);
        setLoading(false);
    }

    //렌더링 되는 순간 이걸 실행하기 위함.
    useEffect(()=>{
        getNodeList();
      },[tvidx]);

      return(
        <div>
            {loading?(
                <h2>loading...</h2>
            ):(
                <Network
                    nodeList={nodeList}
                    boardId={boardidx}
                    edgeList={[]}
                    option={"create"}
                />
            )}
        </div>
    );
};

export default CreateNetworkTv;