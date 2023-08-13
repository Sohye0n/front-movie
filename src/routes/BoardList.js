import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

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
    for(let i=cp*5+startPage; i<=cp*5+endPage; i++) tmpPages.push(i);
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
    
    <div>
      {/*게시글 목록을 출력하는 부분*/}
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {boardList.map((board) => (
            <tr key={board.id}>
              <td style={{paddingLeft:'50px',paddingRight:'50px'}}>{board.id}</td>
              <td style={{paddingLeft:'20px', paddingRight:'20px'}}>
                <Link to={`/board/view/${board.id}`}>{board.title}</Link>
              </td>
              <td style={{paddingLeft:'80px',paddingRight:'80px'}}>{board.content}</td>
            </tr>
          ))}
        </tbody>
      </table>


      {/*페이지 버튼을 출력하는 부분*/}
      <div>
        <button onClick={onClick} value={1}>&lt;&lt;</button>
        <button onClick={onClick} value={prevBlock}>&lt;</button>
        {pageList.map((page,index)=>(
          <button key={index} onClick={onClick} value={page}>{page}</button>
        ))}
        <button onClick={onClick} value={nextBlock}>&gt;</button>
        <button onClick={onClick} value={lastPage}>&gt;&gt;</button>
      </div>
      <br/>

      {/*검색 버튼을 출력하는 부분*/}
      <div>
        <select name="sk" onChange={onChange}>
          <option value="">-선택-</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>

        <input type="text" name="sv" id="" onChange={onChange}/>
        <button onClick={onSearch}>검색</button>
      </div>

    </div>
  );
};

export default BoardList;