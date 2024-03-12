import React, {useEffect, useState} from 'react';
import Interceptor from "../utils/L";
import { Link } from 'react-router-dom';
import "../css/MyPage.css"

const Mypage=()=>{
    const [boards,setBoards]=useState([]);
    const [comments,setComments]=useState([]);

    const getData=async()=>{
        const resp=(await Interceptor.get('/mypage')).data;
        console.log(resp);
        setBoards(resp.boards);
        setComments(resp.comments);
    }

    useEffect(()=>{
        getData();
    },[]);

    return(
        <div className='mypage'>
            <div className='mypage-board'>
                <span className='mypage-board-title'/>내가 쓴 글
                {boards.map((board,index)=>{
                    return(
                        <div>
                            <Link to={`/board/view/writer/${board.id}`}>{board.title}</Link>
                            
                        </div>
                    )
                })
                }
            </div>

            <div className='mypage-comment'>
                <span className='mypage-comment-title'/>내가 쓴 댓글
                {comments.map((comment,index)=>{
                    return(
                        <Link to={`/board/view/${comment.boardid}`}>{comment.content}</Link>
                    )
                })}
            </div>
        </div>
    )


};
export default Mypage