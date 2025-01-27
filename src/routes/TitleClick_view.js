import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Board from '../components/Board';
import Interceptor from "../utils/L"
import TMDB from "../utils/TMDB"

const TitleClick_view=()=>{
    const {idx}=useParams();
    const [nodeList,setNodeList]=useState([]);
    const [edgeList,setEdgeList]=useState([]);
    const [commentList,setCommentList]=useState([]);
    const [isTV,setIsTV]=useState(true);
    const [title,setTitle]=useState("");
    const [writer,setWriter]=useState("");
    const [loading,setLoading]=useState(true);

    let tmdbId;

    const setNodeEdge=async()=>{
        const resp=(await Interceptor.get(`/board/view/${idx}`)).data;
        const respComment=(await Interceptor.post(`/comment/get/${idx}`)).data;
        
        setEdgeList(resp.edges);
        setIsTV(resp.isTV);
        setTitle(resp.title);
        setWriter(resp.writer);
        setCommentList(respComment);

        tmdbId=resp.tmdbId;
        let TMDBdata;
        if (resp.isTV) {
            TMDBdata = await TMDB.fetchTvCreditData(tmdbId);
        } else {
            TMDBdata = await TMDB.fetchMovieCreditData(tmdbId);
        }
        TMDBdata=await TMDBdata.cast;

        const updatedNodes = resp.nodes.map((node, i) => {
            if ((node.isDeleted===true || !node.isHub) && (node.photoUrl === "" || node.photoUrl === "." || node.photoUrl === null)){
                node.photoUrl = `https://image.tmdb.org/t/p/w500/${TMDBdata[i].profile_path}`;
            }
            console.log(node.photoUrl);
            return node;
        });
    
        setNodeList(updatedNodes);
        setLoading(false);
    }

    useEffect(()=>{
        setNodeEdge();
    },[]);
    
    return(
        <div>
            {loading?(
                <h2>loading...</h2>
            ):(
                <Board
                    nodeList={nodeList}
                    edgeList={edgeList}
                    comments={commentList}
                    boardId={idx}
                    title={title}
                    writer={writer}
                />
            )}
        </div>
    );
};

export default TitleClick_view;