import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import "../css/BoardList.css"

const BoardList = () => {
  const navigate=useNavigate();
  const [pageList,setPageList]=useState([]);
  const [boardList,setBoardList]=useState([]);
  const [curPage,setCurPage]=useState(0);
  const [prevBlock,setPrevBlock]=useState(0);
  const [nextBlock,setNextBlock]=useState(0);
  const [lastPage,setLastPage]=useState(0);

  const [search,setSearch]=useState({
    page:1,
    sk:'',
    sv:'',
  });
   
  const getBoardList=async()=>{
    const resp=await (await axios.get(`/Boardlist/${search.page}`)).data;
    setBoardList(resp.data);
    console.log(boardList);

    const queryString = Object.entries(search)
      .map((e) => e.join('='))
      .join('&');
    console.log(queryString);
  
    const pngn=resp.pagination;
    console.log(pngn);
    const {endPage,nextBlock,prevBlock,startPage,totalPageCnt}=pngn;
    
    setCurPage(search.page);
    setPrevBlock(prevBlock);
    setNextBlock(nextBlock);
    setLastPage(totalPageCnt);
  
    const tmpPages=[];
    const cp=Math.trunc(search.page/5);
    for(let i=cp*10+startPage; i<=cp*10+endPage; i++) tmpPages.push(i);
    setPageList(tmpPages);
  }

  const onClick=(event)=>{
    let value=event.target.value;
    setSearch({
      ...search,
      page:value,
    });
    getBoardList();
  }

  const onChange=(event)=>{
    const {value,name}=event.target;
    setSearch({
      ...search,
      [name]:value,
    })
  }

  const onSearch=()=>{
    if(search.sk!=='' && search.sv!==''){
      setSearch({
        ...search,
        page:1,
      });
      setCurPage(1);
      getBoardList();
    }
  }

  useEffect(()=>{
    getBoardList();
  },[search]);

  return (
    <div className='ret'>
      <div className='boardList'>
        {/*게시글 목록을 출력하는 부분*/}
        <table style={{tableLayout:"fixed"}}>
          <thead>
            <tr className='head'>
              <th className='id' style={{width:"80px"}}>번호</th>
              <th className='title' style={{width:"450px"}}>제목</th>
              <th className='writer' style={{width:"150px"}}>작성자</th>
              <th className='view' stye={{width:"50px"}}>조회수</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board) => (
              <tr className='content' key={board.id} style={{ display: "table-row", height:"50px"}}>
                <td className='id' style={{ display: "table-cell", width: "60px", textAlign:"center"}}>{board.id}</td>
                <td className='title' style={{ display: "table-cell", width: "450px",paddingLeft:"60px" }}>
                  {board.isTv && (<Link to={`/board/view/${board.id}`}>{board.title}</Link>)}
                  {!board.isTv && (<Link to={`/board/view/${board.id}`}>{board.title}</Link>)}
                </td>
                <td className='writer' style={{ display: "table-cell" }}>{board.writer}</td>
                <td className='view' style={{display:"table-cell"}}>{board.views}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>


        {/*페이지 버튼을 출력하는 부분*/}
        <div class="pageButton" style={{height:"40px", marginTop:"70px", marginLeft:"750px", padding:"0",display:"flex", flexDirection:"row"}} >
          <button onClick={onClick} value={1} style={{width:"40px"}}>&lt;&lt;</button>
          <button onClick={onClick} value={prevBlock} style={{width:"40px"}}>&lt;</button>
          {pageList.map((page,index)=>(
            <button key={index} onClick={onClick} value={page} style={{width:"40px",fontSize:"14px"}}>{page}</button>
          ))}
          <button onClick={onClick} value={nextBlock} style={{width:"40px"}}>&gt;</button>
          <button onClick={onClick} value={lastPage} style={{width:"40px"}}>&gt;&gt;</button>
        </div>
        <br/>
    </div>
  );
};

export default BoardList;