import React from 'react';
import {Link} from "react-router-dom";

const Header = () => {
  return (
    <header>
        <Link to="/">홈</Link>
        &nbsp;&nbsp; | &nbsp;&nbsp;
        <Link to="/board">게시판</Link>
        &nbsp;&nbsp; | &nbsp;&nbsp;
        <Link to="/login">로그인</Link>
        &nbsp;&nbsp; | &nbsp;&nbsp;
        <Link to="/create">새 네트워크 만들기</Link>
        <hr/>
    </header>
  );
};

export default Header;