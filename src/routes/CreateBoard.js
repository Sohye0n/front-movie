import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Interceptor from "../utils/L";
import {useNavigate} from 'react-router-dom';
import TMDB from "../utils/TMDB"
import "../css/CreateBoard.css"

const CreateBoard=()=>{
    const [Title,setTitle]=useState("");
    const [Content,setContent]=useState("");
    const [isPrivate,setIsPrivate]=useState(false);
    const [type,setType]=useState("TV");
    const [Visible,setVisible]=useState(true);
    const [VisibleNext,setVisibleNext]=useState(false);
    const [VisiblePrev,setVisiblePrev]=useState(false);
    const [Page,setPage]=useState(1);
    const [data,setData]=useState([]);
    const [resp,setResp]=useState([]);
    const navigate=useNavigate();
    const [tmdbid,setTmdbid]=useState(-1);
    const [titleFlag,setTitleFlag]=useState(false);

    const onTitleHandler=(event)=>{
        setTitle(event.currentTarget.value);
    }
    const onContentHandler=(event)=>{
        setVisible(false);
        setContent(event.currentTarget.value);
    }

    const onSubmitHandler=async(event)=>{
        event.preventDefault();
        let data={
            title:Title,
            content:Content,
            isPrivate:isPrivate,
            tmdbid:tmdbid,
            isTv:type==="TV"?true:false
        };
        console.log(data);

        try{
            const resp=await Interceptor.post("/newBoard",data);
            const boardID=resp.data;
            console.log(boardID);
            if(type=="TV") navigate(`/create/tv/${tmdbid}/${String(boardID)}`);
            else navigate(`/create/movie/${tmdbid}/${String(boardID)}`)
        }
        catch(error){
            console.error(error);
        }
    }

    const onVisibleHandler=async ()=>{
        setPage(1);
        setTitleFlag(false);
        setVisiblePrev(false);
        let tmpresp;
        if(type==="TV") tmpresp= await TMDB.fetchTVData(Title,1);
        else tmpresp=(await TMDB.fetchMovieData(Title,1));
        setVisible(true);
        setResp(tmpresp);
        setData(tmpresp.results);
        if(Page<tmpresp.total_pages) setVisibleNext(true);
        else setVisibleNext(false);
    }

    const onVisibleNextHandler=async ()=>{
        setVisible(true);
        setVisiblePrev(true);
        setPage((prevPage)=>prevPage+1);
        const NextPage=Page+1;

        //get next page's data from API
        let tmpresp;
        if(type==="TV") tmpresp= await TMDB.fetchTVData(Title,NextPage);
        else tmpresp=(await TMDB.fetchMovieData(Title,NextPage));

        setResp(tmpresp);
        await setData(tmpresp.results);
        if(NextPage<resp.total_pages) setVisibleNext(true);
        else setVisibleNext(false);
    }

    const onVisiblePrevHandler=async ()=>{
      setVisible(true);
      setPage((prevPage)=>prevPage-1);
      const PrevPage=Page-1;

      //get next page's data from API
      let tmpresp;
      if(type==="TV") tmpresp= await TMDB.fetchTVData(Title,PrevPage);
      else tmpresp=(await TMDB.fetchMovieData(Title,PrevPage));

      setData(tmpresp.results);
      setVisibleNext(true);
      if(PrevPage==1) setVisiblePrev(false);
  }

  const onImageClickHandler = (event) => {
    // event.target은 클릭된 엘리먼트를 나타냅니다.
    // 여기서는 이미지 또는 텍스트 엘리먼트일 것입니다.
    const parentDiv = event.target.closest('.image-item');
    
    // closest를 사용하여 부모 엘리먼트에서 image-title 클래스를 찾습니다.
    if (parentDiv) {
      const titleElement = parentDiv.querySelector('.image-title');
      if (titleElement) {
        // 이미지 클릭 시 title을 가져와 설정
        setTitle(titleElement.textContent);
        // 아이디 설정
        setTmdbid(titleElement.dataset.itemId);
        // 추가 작업 수행...
        setVisible(false);
        setVisibleNext(false);
        setVisiblePrev(false);
        setTitleFlag(true);
      }
    }
  };

    return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
          <form style={{
            display: 'flex',
            flexDirection: 'row', /* Changed flexDirection to row */
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px', /* Added margin bottom for spacing */
          }} onSubmit={onSubmitHandler}>
            {/* Title Input */}
            <div style={{ marginRight: '16px' }}>
              <label>Title</label>
              <input type='Title' value={Title} onChange={onTitleHandler} readOnly={titleFlag}/>
            </div>
      
            {/* Type Select */}
            <div style={{ marginRight: '16px' }}>
              <label>Type</label>
              <select value={type} onChange={(event) => { setType(event.target.value) }}>
                <option value="tv">TV show</option>
                <option value="movie">Movie</option>
              </select>
            </div>
      
            {/* Search Button */}
            <button type="button" onClick={onVisibleHandler}>search</button>
          </form>
      
          {/* Image Grid */}
          {Visible && (
            <div className="image-grid">
              <div className='content' onDoubleClick={(event)=>onImageClickHandler(event)}>
                {data.map((item) => (
                  <div data-item-id={item.id} className="image-item">
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : '/image/no_image.png'}
                      key={item.id}
                      style={{ maxWidth: '120px', maxHeight: '120px' }}
                    />
                    <div className="image-title" data-item-id={item.id}>{item.original_name?item.original_name:item.original_title}</div>
                  </div>
                ))}
              </div>
              <div className='button-container'>
                {VisiblePrev && (
                  <button type='button' onClick={onVisiblePrevHandler} className='button'>prev</button>
                )}
                {VisibleNext && (
                  <button type='button' onClick={onVisibleNextHandler} className='button'>next</button>
                )}
              </div>
            </div>
          )}
      
          {/* Content and Public */}
          <div style={{
            display: 'flex',
            flexDirection: 'column', /* Changed flexDirection to row */
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '16px', /* Added margin top for spacing */
          }}>
            {/* Content Input */}
            <div style={{ marginRight: '16px' }}>
              <label>Content: write a short sentence to introduce your network</label>
              <input type='Content' value={Content} onChange={onContentHandler} />
            </div>
            </div>

        <div style={{
            display: 'flex',
            flexDirection: 'row', /* Changed flexDirection to row */
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '16px', /* Added margin top for spacing */
          }}>
      
            {/* Public Select */}
            <div style={{ marginRight: '16px' }}>
              <label>Public</label>
              <select value={isPrivate} onChange={(event) => {
                if (event.target.value === "false") setIsPrivate(false);
                else setIsPrivate(true);
              }}>
                <option value="false">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
      
          {/* Go Button */}
          <button type="submit" onClick={onSubmitHandler}>go</button>
        </div>
      );
      
      
      
}

export default CreateBoard;