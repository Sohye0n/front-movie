import {useState,useEffect,useRef} from 'react';
import "../css/Comment.css";
import "../css/CommentList.css"
import Interceptor from "../utils/L"
import axios from 'axios';


const CommentList=({boardId})=>{

    const [commentList,setCommentList]=useState([]);
    const [resp, setResp] = useState([])

    const handleResp = (index) => {
        // 새로운 배열을 만들어 해당 인덱스의 값만 변경하고 나머지는 유지함
        console.log(index);
        setResp((prevResp) => prevResp.map((value,i) => (i === index ? true : false)));
        console.log("handleResp is running...\n");
    };

    useEffect(() => {
        const fetchComments = async () => {
            const response = await Interceptor.post(`/comment/get/${boardId}`);
            setCommentList(response.data);
            setResp(new Array(response.data.length).fill(false));
        }
        fetchComments();
    }, []);


    const onKeyDown=(e,index)=>{
        if(e.target.textContent.length==0 && e.key=='Backspace') {
            setTag('');
            setResp((prevResp) => prevResp.map((value,i) => (i === index ? false : value)));
        }
    }
    const [tag,setTag]=useState('');
    const [reply,setReply]=useState('');
    const onReplyHandler=(event)=>{
        setReply(event.target.innerText);
    }

    const submit=async()=>{
        let data={
            commentId:"",
            rootId:-1,
            cnt:"",
            refWriter:"",
            writer:"",
            content:reply,
            createdAt:"",
            isDeleted:false
        }
        const result=await Interceptor.post(`/comment/add/${boardId}`,data);
        setCommentList([...commentList,result.data]);
        setResp([...resp,false]);
    }
    
    const Comment=({comment,response,func,index,refWriter})=>{
        
        const selectUser=(writer)=>{
            setTag(writer);
        }
    
        const delTag=(index)=>{
            setTag('');
            console.log("delTag");
            setResp((prevResp) => prevResp.map((value,i) => (i === index ? false : value)));
        }
    
        const addResp=({writer,func})=>{
            setTag(writer);
            func();
        }

        const [reply,setReply]=useState('');
        const onReplyHandler=(event)=>{
            setReply(event.target.innerText);
        }

        const submit=async({rId,cId,refWriter})=>{
            let id=rId===-1?cId:rId;
            let data={
                commentId:"",
                rootId:id,
                cnt:"",
                refWriter:refWriter,
                writer:"",
                content:reply,
                createdAt:"",
                isDeleted:false
            }
            console.log(rId,cId);
            const result=await Interceptor.post(`/comment/add/${boardId}`,data);
            const newCommentList = [...commentList];
            newCommentList.splice(index + 1, 0, result.data);
            setCommentList(newCommentList);
            setResp(prevResp => {
                const newResp=prevResp.map((value,i)=>(i===index ? false : value));
                newResp.push(false);
                return newResp;
              });
        }

        return(
            <div className="comment">
                <div className='writer'>
                    <p onClick={()=>selectUser(comment.writer)}>{comment.writer}</p>
                </div>

                <div className='content'>
                    { refWriter!=="" &&(
                        <div className='ref'>{refWriter}</div>
                    )}
                    <div className='word'>{comment.content}</div>
                    <button className="submit" onClick={() => addResp({writer:comment.writer, func})}>답글달기</button>
                </div>
                
                <div className='createAt'>
                    <p>{comment.createdAt}</p>
                </div>

                <div className='resp'>
                    { response===true && (
                        <div class="input">
                            { tag!=='' && (
                                <div className='tag'>
                                    <text>{tag}</text>
                                    <button className="tagButton" onClick={()=>delTag(index)}>x</button>
                                </div>
                            )}
                            <span className="inputBox" role="textbox" contentEditable onKeyDown={(e)=>onKeyDown(e,index)} placeholder="답글을 입력하세요" value={reply} onInput={(e)=>onReplyHandler(e)}/>
                            <button className="submit" onClick={()=>submit({rId:comment.rootId,cId:comment.commentId,refWriter:comment.writer})}>댓글달기</button>
                        </div>
                    )}
                </div> 
            </div>
        );
    }


    return (
        <div>
            <div class="commentList">
                {commentList.map((comment,index) => {
                    console.log(comment.content,index);
                    if (comment.rootId===-1) {
                        return (
                            <div>
                            <Comment comment={comment} response={resp[index]} func={() => handleResp(index)} index={index} refWriter={""}/>
                            </div>
                        );
                    } else {
                        return (
                            <div class="reComment">
                                <Comment comment={comment} response={resp[index]} func={() => handleResp(index)} index={index} refWriter={comment.refWriter}/>
                            </div>
                        );}
                    })}
            </div>
        
            
            <div class="input">
                <span className='inputBox' type="textbox" contentEditable placeholder="답글을 입력하세요" value={reply} onInput={(e)=>onReplyHandler(e)}/>
                <button className="submit" onClick={()=>submit({rId:-1,cId:-1,refWriter:""})}>댓글달기</button>
            </div>
            
        </div>
      );
}
export default CommentList;