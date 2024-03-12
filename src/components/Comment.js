import "../css/Comment.css"

const selectUser=({writer})=>{
    
}

const Comment=({comment})=>{
    return(
        <div class="content">
            <p onClick={()=>selectUser(comment.writer)}>{comment.writer}</p>
            <p>{comment.content}</p>
            <p>{comment.createdAt}</p>
        </div>
    );
}
export default Comment; 