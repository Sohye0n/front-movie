import "../css/ReComment.css"

const ReComment=({comment})=>{
    return(
        <div class="content">
            <p>@{comment.refWriter}</p>
            <p>{comment.writer}</p>
            <p>{comment.content}</p>
            <p>{comment.createdAt}</p>
        </div>
    )
}
export default ReComment;