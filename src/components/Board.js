import React,{Component,Fragment} from 'react';
import Graph from "vis-react";

const options={
    nodes:{
        shape:'circle',
    },
    edges:{
        color: '#000000',
    },
};

const Board=({nodeList})=>{
    let nodearr=[];
    let edgearr=[];
    let element;

    nodeList.forEach(node => {
        element={id:node.id, label:node.name, title:node.details};
        nodearr.push(element);
        console.log(element);
    });

    const data={
        nodes: nodearr,
        edges: edgearr,
    };
    console.log(data);

    return(
        <div>
            <h2>hi</h2>
            <h5>cont</h5>
            <hr/>
            <Graph
                graph={data}
                options={options}
                style={{height:'500px'}}
            />
            <p></p>
        </div>
    )
}
export default Board;