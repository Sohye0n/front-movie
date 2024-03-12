import React from 'react';
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import Interceptor from "../utils/L";
import '../css/Header.css';

const Header = () => {

  const navigate=useNavigate();

  const handleLogout=async()=>{
    try{
      const response=await Interceptor.post('/logout');
      console.log(response);
      if(response.statusText==="OK") navigate('/');
      else console.log("logout failed");
    } catch(error){
      console.log("error");
    }
  }

  return (
    <header className="header-container">
      <div className="left-links">
        <Link to="/">홈</Link>
        <Link to="/board">게시판</Link>
        <Link to="/login">로그인</Link>
        <Link to="/create">새 네트워크 만들기</Link>
      </div>
      <div className="right-links">
        <Link to="/mypage">마이페이지</Link>
        <Link to="#" onClick={handleLogout}>로그아웃</Link>
      </div>
      <hr />
  </header>
  );
};

export default Header;