import React,{Component,Fragment,useEffect, useState} from 'react';
import Graph from "vis-react";
import axios from "axios";
import Interceptor from "../utils/L";
import {useNavigate} from 'react-router-dom';


const Network=({boardId,nodeList})=>{

    const options={
        nodes:{
            shape:'circle',
        },
        edges:{
            color: '#000000',
        },
        interaction:{hover:true},
        manipulation:{
            enabled:true,
            addNode: true,
            deleteNode: true,
            // addEdge: true,
            // editEdge: true,
            // deleteEdge: true,
        },
    };
    
    const navigate=useNavigate();
    const transformedNodes=nodeList.map(node=>({
        id:node.id,
        label:node.name,
        title:node.details,
    }));

    const [nodes,setNodes]=useState(transformedNodes);
    const [edges,setEdges]=useState([]);
    const [updatedNodes,setUpdatedNodes]=useState([]);

    let element;
    const [NodeName_,setNodename_]=useState("");
    const [NodeDescription, setNodeDescription]=useState("");
    const [NodeImageUrl, setNodeImageUrl]=useState("");
    const [NodeLocalImage, setNodeLocalImage]=useState(null);
    const [NodeID,setNodeID]=useState(nodeList.length);
    const [ClickedNodeIndex,setClickedNodeIndex]=useState(-1);

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
            image:"../",
        }

        if(NodeImageUrl) node.image=NodeImageUrl;
        else if(NodeLocalImage) {
            node.image=NodeLocalImage;
        }
        else{
            node.image="../";
            node.shape="circularImage";
        }
        setUpdatedNodes([...updatedNodes,{
            type:0,
            id:node.id,
            details:node.title,
            name:node.label,
            isHub:0,
            PhotoUrl:node.image
        }]);

        setNodename_("");
        setNodeDescription("");
        setNodeImageUrl("");
        setNodeLocalImage(null);
        setNodes([...nodes,node]);
        nodes.forEach(element => {
            console.log(element);
        });
        setNodeID(prevNodeID=>prevNodeID+1);
    }

    const handleEmptyClick=()=>{setClickedNodeIndex(-1);};

    useEffect(()=>{
        console.log("Node Click detected");
        console.log(ClickedNodeIndex);
        if(ClickedNodeIndex!=-1){
            setNodename_(nodes[ClickedNodeIndex].label);
            setNodeDescription(nodes[ClickedNodeIndex].title);

        }
        else{
            setNodename_("");
            setNodeDescription("");
        }
    },[ClickedNodeIndex]);

    const editNode=(event)=>{
        console.log("edit");
        const cn=event.nodes[0]; console.log(cn);
        const csld=nodes.findIndex(node=>node.id==cn);
        setClickedNodeIndex(csld);
    }

    const edit=()=>{
        console.log("editing...");

        //서버로 보낼 배열 수정
        const EditedNodeIndex=updatedNodes.findIndex(node=>node.id==nodes[ClickedNodeIndex].id);
        console.log(EditedNodeIndex);
        updatedNodes[EditedNodeIndex].details=NodeDescription;
        updatedNodes[EditedNodeIndex].name=NodeName_;
        updatedNodes[EditedNodeIndex].PhotoUrl=nodes[ClickedNodeIndex].image;


        //화면에 보일 노드 정보 수정
        let newimage;
        let newnode;
        if(NodeImageUrl) newimage=NodeImageUrl;
        else if(NodeLocalImage) newimage=NodeLocalImage;
        else newimage="../";
        if(newimage=="../"){
            newnode={
                id:ClickedNodeIndex,
                label:NodeName_,
                title:NodeDescription,
                shape:"circularImage",
                image:newimage,
            };
        }
        else{
            newnode={
                id:ClickedNodeIndex,
                label:NodeName_,
                title:NodeDescription,
                shape:"image",
                image:newimage,
            };
        }
        //새 배열 newnodes에 할당하는 이유
        //그냥 nodes를 수정하고 이걸 다시 setNodes에 넣어주면 안됨.
        //React는 shallow comparision을 사용하기 때문
        let newnodes=nodes.slice();
        newnodes.splice(ClickedNodeIndex,1);
        newnodes.push(newnode);
        setNodes(newnodes);

        //다시 모든 칸을 빈칸으로
        setNodename_("");
        setNodeDescription("");
        setNodeImageUrl("");
        setNodeLocalImage(null);
    };

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
              events={{selectNode:editNode}}
            />
          </div>

          <div style={{ marginLeft: '20px' }}>
            <div>
              <label htmlFor="nodeName_">노드 이름</label>
              <input type="text" id="nodeName_" value={NodeName_||""} onChange={onNodeName_Handler}/>
            </div>
            <div>
              <label htmlFor="nodeDescription">설명</label>
              <input type="text" id="nodeDescription" value={NodeDescription||""} onChange={onNodeDescriptionHandler}/>
            </div>
            <div>
              <label htmlFor="nodeImageUrl">이미지 URL</label>
              <input type="text" id="nodeImageUrl" value={NodeImageUrl||""} onChange={onNodeImageUrlHandler}/>
            </div>
            <div>
                <label htmlFor="nodeLocalImage">이미지 파일</label>
                <input type="file" id="nodeLocalImage" onChange={onNodeLocalImageHandler}/>
            </div>
            <div>
              <button onClick={add}>추가하기</button>
              <button onClick={edit}>수정하기</button>
            </div>
          </div>



        </div>
      );
      
}
export default Network;