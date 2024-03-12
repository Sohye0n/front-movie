import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Board from '../components/Board';
import Interceptor from "../utils/L"
import TMDB from "../utils/TMDB"
import {useNavigate} from 'react-router-dom';

const TitleClick_view_forWriter=()=>{

    const navigate=useNavigate();
    const {idx}=useParams();
    const [nodeList,setNodeList]=useState([]);
    const [edgeList,setEdgeList]=useState([]);
    const [commentList,setCommentList]=useState([]);
    const [isTV,setIsTV]=useState(true);
    const [title,setTitle]=useState("");
    const [writer,setWriter]=useState("");

    let tmdbId;
    const [loading,setLoading]=useState(true);
    const setNodeEdge=async()=>{
        const resp=(await Interceptor.get(`/board/view/${idx}`)).data;
        const respComment=(await Interceptor.post(`/comment/get/${idx}`)).data;
        setEdgeList(resp.edges);
        tmdbId=resp.tmdbId;
        setIsTV(resp.isTV);
        setTitle(resp.title);
        setWriter(resp.writer);
        setCommentList(respComment);
        setLoading(false);
        console.log(resp.isTv)

        let TMDBdata;
        if (resp.isTv===true) {
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
    }

    const deleteHandler=async ()=>{
        const resp = await(Interceptor.get(`board/del/${idx}`));
        console.log(resp);
        if(resp.statusText==='OK'){
            //홈화면으로 돌아가기
            navigate('/');
        }
        else{
            //화면에 경고알림 띄우기
            alert("삭제에 실패했습니다.");
        }
    }

    useEffect(()=>{
        setNodeEdge();
      },[]);
    
    return(
        <div>
            {loading?(
                <h2>loading...</h2>
            ):(
                <div>
                    <button onClick={deleteHandler}>delete</button>
                    <Link to={`/board/edit/${idx}`}>edit</Link>
                    <Board
                        nodeList={nodeList}
                        edgeList={edgeList}
                        comments={commentList}
                        boardId={idx}
                        title={title}
                        writer={writer}
                />
                </div>
            )}
        </div>
    );
};

export default TitleClick_view_forWriter;