// import React,{Component,Fragment} from 'react';
// import Graph from "vis-react";

// const options={
//     nodes:{
//         shape:'circle',
//     },
//     edges:{
//         color: '#000000',
//     },
// };

// const Board=({nodeList})=>{
//     let nodearr=[];
//     let edgearr=[];
//     let element;

//     nodeList.forEach(node => {
//         element={id:node.id, label:node.name, title:node.details};
//         nodearr.push(element);
//         console.log(element);
//     });

//     const data={
//         nodes: nodearr,
//         edges: edgearr,
//     };
//     console.log(data);

//     return(
//         <div>
//             <h2>hi</h2>
//             <h5>cont</h5>
//             <hr/>
//             <Graph
//                 graph={data}
//                 options={options}
//                 style={{height:'500px'}}
//             />
//             <p></p>
//         </div>
//     )
// }
// export default Board;


import React,{Component,Fragment,useState,useEffect} from 'react';
import Graph from "vis-react";
import Edit from '../components/Edit';
import TMDB from "../utils/TMDB"
import "../css/Board.css"
import CommentList from './CommentList';

const options={
    nodes:{
        shape:'circle',
    },
    edges:{
        color: '#000000',
    },
};

const Board=({nodeList,edgeList,boardId,title,writer})=>{
    let nodearr=[];
    let edgearr=[];
    let element;
    const [ClickedNodeIndex,setClickedNodeIndex]=useState(-1);
    const [Name,setName]=useState("name");
    const [Details,setDetails]=useState("details");
    const [Url,setUrl]=useState("../image/no_image.png");


    nodeList.forEach(node => {
            let element={id:node.id, label:node.name, title:node.details, shape:"circularImage", image:node.photoUrl};
            nodearr.push(element);
    });

    edgeList.forEach(edge => {
        element={id:edge.id, from:edge.from, to:edge.to, label:edge.details};
        edgearr.push(element);
    });


    const editNode=(event)=>{
        const cn=event.nodes[0];
        const csld=nodeList.findIndex(node=>node.id==cn);
        setClickedNodeIndex(csld);
    }

    useEffect(()=>{
        if(ClickedNodeIndex>=0){
            setName(nodeList[ClickedNodeIndex].name);
            setDetails(nodeList[ClickedNodeIndex].details);
            console.log(`https://image.tmdb.org/t/p/w500/${nodeList[ClickedNodeIndex].photoUrl}`)
            setUrl(`https://image.tmdb.org/t/p/w500/${nodeList[ClickedNodeIndex].photoUrl}`);
        }
    },[ClickedNodeIndex]);

    const data={
        nodes: nodearr,
        edges: edgearr,
    };

    return(
        <div class="ret">
            <div class="title">
                <h2>{title}</h2>
                <p>{writer}</p>
                <hr/>
            </div>
            <div className="container">
                <div class="body">
                    <div class="left"> 
                        <Graph
                        
                            graph={data}
                            options={options}
                            style={{
                                height:'800px',
                                width:'1100px'
                            }}
                            events={{selectNode:editNode}}
                        />
                    </div>
                    <div class="right">
                        <Edit
                            name={Name}
                            content={Details}
                            url={Url}
                        />
                    </div>
                </div>
                <div class="comment">
                    <CommentList
                        boardId={boardId}
                    />
                </div>
            </div>
        </div>
    )
}
export default Board;