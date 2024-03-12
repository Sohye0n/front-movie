import React,{Component,Fragment,useEffect, useState} from 'react';
import Graph from "vis-react";
import Interceptor from "../utils/L";
import {useNavigate} from 'react-router-dom';
import '../css/Network.css'


const Network=({boardId,nodeList,edgeList,option})=>{

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
        },
    };
    
    const navigate=useNavigate();
    const TMDBDataLength=nodeList.length;
    const [nodes,setNodes]=useState(nodeList);
    const [edges,setEdges]=useState(edgeList);
    const [updatedNodes,setUpdatedNodes]=useState(
        nodeList.map((item,index)=>({
            type:0,
            id:index,
            isDeleted:0,
            photoUrl:"",
            name:item.label,
            details:item.title,
        }))
    );
    const [updatedEdges,setUpdatedEdges]=useState([]);
    const [visible1,setVisible1]=useState(false);
    const [visible2,setVisible2]=useState(false);
    const [visibleEdgedesc,setVisibleEdgedesc]=useState(false);

    //노드 추가
    const [NodeName_,setNodename_]=useState("             ");
    const [NodeDescription, setNodeDescription]=useState(            "");
    const [NodeImageUrl, setNodeImageUrl]=useState("          ");
    const [NodeLocalImage, setNodeLocalImage]=useState(null);
    const [NodeID,setNodeID]=useState(nodeList.length);
    const [ClickedNodeIndex,setClickedNodeIndex]=useState(-1);
    const [flag,setFlag]=useState(false);

    //간선 추가
    const [FromNode,setFromNode]=useState(null);
    const [ToNode,setToNode]=useState(null);
    const [EdgeID,setEdgeID]=useState(edgeList.length);
    const [EdgeDescription, setEdgeDescription]=useState("");
    const [ClickedEdgeIndex,setClickedEdgeIndex]=useState(-1);

    //노드 클릭 시 노드 추가 용도인지, 간선 추가 용도인지 구분하기 위함
    const [isEdge,setIsEdge]=useState(0);

    const onNodeName_Handler=(event)=>{
        setNodename_(event.target.innerText);
        var node=document.getElementById('network-input');
    }

    const onNodeDescriptionHandler=(event)=>{
        setNodeDescription(event.target.innerText);
    }
    const onNodeImageUrlHandler=(event)=>{
        setNodeImageUrl(event.target.innerText);
    }
    const onEdgeDescriptionHandler=(event)=>{
        setEdgeDescription(event.target.innerText);
    }
    const onEdgeEditHandler=()=>{
        console.log(edges);
        console.log(ClickedEdgeIndex);
        edges[ClickedEdgeIndex].label=EdgeDescription;

        console.log("adding single line");
        let newedge={
                to:edges[ClickedEdgeIndex].from,
                from:edges[ClickedEdgeIndex].to,
                id:edges[ClickedEdgeIndex].id,
                label:edges[ClickedEdgeIndex].label
        }
        let newedges=edges.slice();
        newedges.splice(ClickedEdgeIndex,1);
        newedges.push(newedge);
        setVisibleEdgedesc(false);
        setEdges(newedges);
        setFlag(true);
    }

    useEffect(()=>{
        if(edges.length>0 && flag==true){
            let newedge2={
                to:edges[edges.length-1].from,
                from:edges[edges.length-1].to,
                id:edges[edges.length-1].id,
                label:edges[edges.length-1].label
            }
            let newedges2=edges.slice();
            newedges2.splice(edges.length-1,1);
            newedges2.push(newedge2);
            setVisibleEdgedesc(false);
            setEdges(newedges2);
            setFlag(false);
        }
    },[flag]);

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
        updatedNodes.forEach(element => {
            console.log(element.PhotoUrl);
        });
        try{
            await Interceptor.post(`/network/save/nodes/${boardId}`,updatedNodes,{
                headers:{
                    "Content-Type":"application/json",
                }
            });
            await Interceptor.post(`/network/save/edges/${boardId}`,updatedEdges);
            navigate('/');
        }
        catch(error){
            console.error(error);
        }
    }

    const save=async ()=>{
        await Interceptor.post(`/network/save/nodes/${boardId}`,updatedNodes);
        await Interceptor.post(`/network/save/edges/${boardId}`,updatedEdges);
    }


    useEffect(()=>{
        //간선 추가를 위한 클릭
        if(isEdge==1||isEdge==3){
            setFromNode(ClickedNodeIndex);
            setIsEdge(isEdge+1);
            setVisible1(false);
            setVisible2(true);
            setVisibleEdgedesc(false);
        }

        else if(isEdge==2||isEdge==4){
            setToNode(ClickedNodeIndex);
            setVisible2(false);
            setVisibleEdgedesc(false);
            if(isEdge==2) addarrow();
            else addsingleline();
        }

        //그냥 클릭
        else{
            if(ClickedNodeIndex!=-1){
                setNodename_(nodes[ClickedNodeIndex].label);
                setNodeDescription(nodes[ClickedNodeIndex].title);
            }
            else{
                setNodename_("");
                setNodeDescription("");
            }
            setVisibleEdgedesc(false);
        };

    },[ClickedNodeIndex]);

    useEffect(()=>{
        //그냥 클릭
        setVisibleEdgedesc(true);
        console.log(ClickedEdgeIndex);
        if(ClickedEdgeIndex!=-1){
            setEdgeDescription(edges[ClickedEdgeIndex].label);
        }
        else{
            setEdgeDescription("");
        }
    },[ClickedEdgeIndex]);

    //노드만 클릭해도 엣지가 같이 선택되는 경우를 막기 위함
    useEffect(() => {
        setVisibleEdgedesc(false);
    }, [`${ClickedEdgeIndex}-${ClickedNodeIndex}`]);

    const editNode=(event)=>{
        console.log("edit node");
        const cn=event.nodes[0]; console.log(cn);
        const csld=nodes.findIndex(node=>node.id==cn);
        setClickedNodeIndex(csld);
    }

    const editEdge=(event)=>{
        console.log("edit edge");
        const cn=event.edges[0]; console.log(cn);
        const csld=edges.findIndex(edge=>edge.id==cn);
        setClickedEdgeIndex(csld);
        console.log(edges[csld]);
        setVisibleEdgedesc(true);
    }

    //TMDB 제공 데이터 외에 유저가 직접 추가한 데이터
    const add=()=>{
        console.log("add");
        let node={
            id:NodeID,
            label:NodeName_,
            title:NodeDescription,
            shape:"circularImage",
            image:""
        }

        if(NodeImageUrl) {
            node.image=NodeImageUrl;
        }
        else if(NodeLocalImage) {
            node.image=NodeLocalImage;
        }
        else{
            node.image="."
            node.shape="circularImage";
        }
        setUpdatedNodes([...updatedNodes,{
            type:0,
            id:node.id,
            isDeleted:0,
            photoUrl:node.image,
            name:node.label,
            details:node.title,
        }]);

        setNodename_("");
        setNodeDescription("");
        setNodeImageUrl(null);
        setNodeLocalImage(null);
        setNodes([...nodes,node]);
        setNodeID(prevNodeID=>prevNodeID+1);
    }

    const edit=()=>{
        //수정해야할 노드의 인덱스 찾기
        const EditedNodeIndex=updatedNodes.findIndex(node=>node.id==nodes[ClickedNodeIndex].id);

        //이름이 바뀌었는지 체크
        const nameFlag=nodeList[EditedNodeIndex].name===NodeName_?false:true;
        //detail이 바뀌었는지 체크
        const detailFlag=nodeList[EditedNodeIndex].details===NodeDescription?false:true;

        //TMDB 제공 데이터 && 최초 수정 : updateNodes에 새 node 객체 추가해야 함.
        if(EditedNodeIndex===-1){
            setUpdatedNodes([...updatedNodes,{
                type:1,
                id:nodeList[ClickedNodeIndex].id,
                isDeleted:0,
                photoUrl:"",
                name:NodeName_,
                details:"",
                }]);
        }

        //TMDB 제공 데이터 && n번째 수정
        else{
            //updateNodes에서 EditedNodeIndex에 있는 것을 제거하고 새로 push
            let newUpdatedNodes=updatedNodes.slice();
            newUpdatedNodes.splice(EditedNodeIndex,1);
            newUpdatedNodes.push({
                type:1,
                id:nodeList[ClickedNodeIndex].id,
                isDeleted:0,
                photoUrl:"",
                name:NodeName_,
                details:NodeDescription
            })
            setUpdatedNodes(newUpdatedNodes);
        }

            

            //화면에 보일 노드 정보 수정
            let newimage;
            let newnode;
            if(NodeImageUrl) newimage=NodeImageUrl;
            else if(NodeLocalImage) newimage=NodeLocalImage;
            else newimage=".";
            if(newimage=="."){
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

    const del=()=>{
        //삭제해야할 노드의 인덱스 찾기
        const EditedNodeIndex=updatedNodes.findIndex(node=>node.id==nodes[ClickedNodeIndex].id);

        // edited 배열에 없던 것 -> 새로 추가
        if(EditedNodeIndex===-1){
            setUpdatedNodes([...updatedNodes,{
                type:2,
                id:nodeList[ClickedNodeIndex].id,
                isDeleted:1,
                photoUrl:"",
                name:NodeName_,
                details:"",
            }]);
        }

        // edited 배열에 있던 것 -> 원소 수정
        else{
            let newUpdatedNodes=updatedNodes.slice();
            newUpdatedNodes.splice(EditedNodeIndex,1);
            newUpdatedNodes.push({
                type:2,
                id:nodeList[EditedNodeIndex].id,
                isDeleted:1,
                photoUrl:"",
                name:NodeName_,
                details:"",
            })
        }

        let newnodes=nodes.slice(0,EditedNodeIndex).concat(EditedNodeIndex+1);
        setNodes(newnodes);

    }

    const arrow=()=>{
        console.log("adding single arrow");
        setIsEdge(1);
        setVisible1(true);
    }
    const singleline=()=>{
        console.log("adding a double arrow");
        setIsEdge(3);
        setVisible1(true);
    }

    function addarrow(){
        console.log("adding single arrow");
        let edge={
                to:ClickedNodeIndex,
                from:FromNode,
                id:EdgeID,
                label:EdgeDescription
        }
        setEdges((prevedges)=>[...prevedges,edge]);
        setUpdatedEdges((prevupdatedEdges)=>[...prevupdatedEdges,edge]);
        console.log(edges);
        setEdgeID(prevEdgeID=>prevEdgeID+1);
        setIsEdge(0);
    }

    function addsingleline(){
        console.log("adding single line");
        let edge={
                to:ClickedNodeIndex,
                from:FromNode,
                id:EdgeID,
                label:EdgeDescription
        }
        setEdges((prevedges)=>[...prevedges,edge]);
        setUpdatedEdges((prevupdatedEdges)=>[...prevupdatedEdges,edge]);
        setEdgeID(prevEdgeID=>prevEdgeID+1);
        setIsEdge(0);
    }

    function delEdge(){

        const delEdgeIndex=updatedEdges.findIndex(edge=>edge.id==edges[ClickedEdgeIndex].id);

        let newUpdateEdges=updatedEdges.slice();
        newUpdateEdges.splice(delEdgeIndex,1);
        let edge={
            to:-1,
            from:-1,
            id:edges[ClickedEdgeIndex].id,
            label:""
        }
        newUpdateEdges.push(edge);
        setUpdatedEdges(newUpdateEdges);

        let newEdges=edges.slice();
        newEdges.splice(ClickedEdgeIndex,1);
        setEdges(newEdges);
    }

    const delBoard=async ()=>{
        const resp=await(Interceptor.post(`/board/delete/${boardId}`));
        
        //delete success
        if(resp.statusText==="OK") navigate('/');

        //delete failed
        else{
            alert("삭제에 실패했습니다.");
        }

    }

    return (
        <div style={{ display: 'flex' }}>

            <div className='network-graph'>
                <Graph
                    graph={{nodes,edges}}
                    options={options}
                    events={{selectNode:editNode,selectEdge:editEdge}}
                    style={{
                        height:'800px',
                        width:'1100px'
                    }}
                />

                <div className='network-save'>
                    {(option==="create") && (<button onClick={upload}>upload</button>)}
                    <button onClick={save}>save</button>
                    {(option==="edit") && (<button onClick={delBoard}>delete</button>)}
                </div>

                <div className='network-edgeVisible'>
                    {visible1&&(
                            <div className='visible1'>Click From Node</div>
                        )}
                    {visible2&&(
                            <div className='visible2'>Click To Node</div>
                        )}
                </div>

            </div>

            <div className='network-submit'style={{ marginLeft: '20px' }}>
                <div className='network-nodeName'>
                    <span className='network-title'>노드 이름</span>
                    <span className='network-input' role="textbox" contentEditable suppressContentEditableWarning={true} value={NodeName_} placeholder="노드 이름을 입력하세요" onInput={(e)=>onNodeName_Handler(e)}></span>
                </div>

                <div className='network-nodeDesc'>
                    <span className='network-title'>노드 설명 </span>
                    <span className='network-input'role="textbox" contentEditable suppressContentEditableWarning={true} id="nodeDescription" value={NodeDescription} onInput={(e)=>onNodeDescriptionHandler(e)}></span>
                </div>

                <div className='network-nodeImgURL'>
                    <span className='network-title'>이미지 URL </span>
                    <span className='network-input' role="textbox" contentEditable suppressContentEditableWarning={true} id="nodeImageUrl" value={NodeImageUrl} onInput={(e)=>onNodeImageUrlHandler(e)}></span>
                </div>

                <div className='network-nodeLocalImg'>
                    <span className='network-title'>이미지 파일 </span>
                    <input type="file" id="nodeLocalImage" onChange={onNodeLocalImageHandler}/>
                </div>

                <div className='network-buttons'>
                    <button onClick={add}>추가하기</button>
                    <button onClick={edit}>수정하기</button>
                    {ClickedNodeIndex !== -1 && <button onClick={del}>삭제하기</button>}
                </div>

                <div className='network-edges'>
                    <button onClick={singleline}>간선 추가하기</button>
                    {(!(visible1||visible2) && visibleEdgedesc)&&(
                        <button onClick={delEdge}>간선 삭제하기</button>
                    )}
                </div>

                {(visible1||visible2||visibleEdgedesc)&&(
                    <div className='network-edgeDesc'>
                        <span className='network-title'>간선 설명 </span>
                        <span className='network-input' role="textbox" contentEditable suppressContentEditableWarning={true} value={EdgeDescription} id="edgeDescription" onInput={(e)=>onEdgeDescriptionHandler(e)}></span>
                        {visibleEdgedesc&&(
                            <button type='button' onClick={onEdgeEditHandler}>OK</button>
                        )}
                    </div>
                )}
            </div>



        </div>
      );
    }
export default Network;