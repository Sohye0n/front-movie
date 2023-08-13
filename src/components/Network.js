import React,{Component,Fragment,useEffect, useState} from 'react';
import Graph from "vis-react";
import axios from "axios";
import Interceptor from "../utils/L";
import {useNavigate} from 'react-router-dom';

const options={
    nodes:{
        shape:'circle',
    },
    edges:{
        color: '#000000',
    },
    manipulation:{
        enabled:true,
        addNode: true,
        // editNode: true,
        // deleteNode: true,
        // addEdge: true,
        // editEdge: true,
        // deleteEdge: true,
    },
};


const Network=({boardId,nodeList})=>{
    let updatedNodes=[];
    const navigate=useNavigate();
    const transformedNodes=nodeList.map(node=>({
        id:node.id,
        label:node.name,
        title:node.details,
    }));

    const [nodes,setNodes]=useState(transformedNodes);
    const [edges,setEdges]=useState([]);

    let element;
    const [NodeName_,setNodename_]=useState("");
    const [NodeDescription, setNodeDescription]=useState("");
    const [NodeImageUrl, setNodeImageUrl]=useState("");
    const [NodeLocalImage, setNodeLocalImage]=useState(null);
    const [NodeID,setNodeID]=useState(nodeList.length);

    const onNodeName_Handler=(event)=>{
        setNodename_(event.currentTarget.value);
    }
    const onNodeDescriptionHandler=(event)=>{
        setNodeDescription(event.currentTarget.value);
    }
    const onNodeImageUrlHandler=(event)=>{
        setNodeImageUrl(event.currentTarget.value);
    }
    const onNodeLocalImageHandler=(event)=>{
        const file=event.target.files[0];
        const reader=new FileReader();
        reader.readAsDataURL(file);
        reader.onload=(event)=>{
            const url=event.target.result;
            setNodeLocalImage(url); 
        }
    }
    const upload=async ()=>{
        try{
            await axios.post(`/network/save/${boardId}`,updatedNodes,{
                headers:{
                    "Content-Type":"application/json",
                }
            });
            navigate('/');
        }
        catch(error){
            console.error(error);
        }
    }
    const save=async ()=>{
        await Interceptor.post(`/network/save/${boardId}`,updatedNodes);
    }


    const add=()=>{
        console.log("add");
        let node={
            id:NodeID,
            label:NodeName_,
            title:NodeDescription,
            shape:"image",
        }

        if(NodeImageUrl) node.image=NodeImageUrl;
        else if(NodeLocalImage) {
            node.image=NodeLocalImage;
            setNodeLocalImage(null);
        }
        else{
            node.image="../";
            node.shape="circularImage";
        }
        updatedNodes.push({
            type:0,
            id:node.id,
            details:node.title,
            name:node.label,
            isHub:0,
            PhotoUrl:node.image});

        setNodes([...nodes,node]);
        setNodeID(prevNodeID=>prevNodeID+1);
    }

    return (
        <div style={{ display: 'flex' }}>
          <div>
            <h2>hi</h2>
            <h5>cont</h5>
            <hr />
            <button onClick={upload}>upload</button>
            <button onClick={save}>save</button>
            <p></p>
          </div>

          <div>
            <Graph
              graph={{nodes,edges}}
              options={options}
              style={{ height: '500px' }}
            />
          </div>

          <div style={{ marginLeft: '20px' }}>
            <div>
              <label htmlFor="nodeName_">노드 이름</label>
              <input type="text" id="nodeName_" value={NodeName_} onChange={onNodeName_Handler}/>
            </div>
            <div>
              <label htmlFor="nodeDescription">설명</label>
              <input type="text" id="nodeDescription" value={NodeDescription} onChange={onNodeDescriptionHandler}/>
            </div>
            <div>
              <label htmlFor="nodeImageUrl">이미지 URL</label>
              <input type="text" id="nodeImageUrl" value={NodeImageUrl} onChange={onNodeImageUrlHandler}/>
            </div>
            <div>
                <label htmlFor="nodeLocalImage">이미지 파일</label>
                <input type="file" id="nodeLocalImage" onChange={onNodeLocalImageHandler}/>
            </div>
            <div>
              <button onClick={add}>추가하기</button>
            </div>
          </div>
        </div>
      );
      
}
export default Network;