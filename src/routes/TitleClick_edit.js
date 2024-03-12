import Network from "../components/Network";
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import Interceptor from "../utils/L"
import TMDB from "../utils/TMDB"

const TitleClick_edit=()=>{
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
        setEdgeList(resp.edges);
        tmdbId=resp.tmdbId;
        setIsTV(resp.isTV);
        setTitle(resp.title);
        setWriter(resp.writer);
        console.log(tmdbId);

        let TMDBdata;
        if (isTV) {
            TMDBdata = await TMDB.fetchTvCreditData(tmdbId);
        } else {
            TMDBdata = await TMDB.fetchMovieCreditData(tmdbId);
        }
        TMDBdata=await TMDBdata.cast;

        const edges=resp.edges.map((edge,index)=>{
            let newedge={
                to:edge.to,
                from:edge.from,
                id:edge.id,
                label:edge.details
            }
            return newedge;
        });

        setEdgeList(edges);

        let arr=[];

        const nodes = resp.nodes.map((node, i) => {
            let newnode={
                id:node.id,
                label:node.name,
                title:node.details,
                shape:"circularImage",
                image:""
            };

            if ((node.isDeleted===true || !node.isHub) && (node.photoUrl === "" || node.photoUrl === "." || node.photoUrl === null)){
                newnode.image = `https://image.tmdb.org/t/p/w500/${TMDBdata[i].profile_path}`;
            }
            arr.push(newnode);
        });
        setNodeList(arr);
        setLoading(false);
    }

    useEffect(()=>{
        setNodeEdge(); 
    },[idx]);

    return(
        <div>
            {loading?(
                <h2>loading...</h2>
            ):(
                <div>
                    <Network
                        nodeList={nodeList}
                        edgeList={edgeList}
                        boardId={idx}
                        option={"edit"}
                    />
                </div>
            )}
        </div>
    );
}

export default TitleClick_edit;