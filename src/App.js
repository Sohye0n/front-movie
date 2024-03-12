import React, { useState, useEffect } from "react";
import {Route, Routes} from "react-router-dom";
import axios from "axios";
import BoardList from "./routes/BoardList";
import Home from "./routes/Home";
import TitleClick_view from "./routes/TitleClick_view";
import Interceptor from "./utils/L";
import Login from "./routes/Login";
import CreateBoard from "./routes/CreateBoard";
import CreateNetworkTv from "./routes/CreateNetworkTv";
import CreateNetworkMovie from "./routes/CreateNetworkMovie";
import Join from "./routes/Join";
import Mypage from "./routes/Mypage";
import TitleClick_view_forWriter from "./routes/TitleClick_view_forWriter";
import TitleClick_edit from "./routes/TitleClick_edit"

function App() {
  Interceptor();
  return (
      <Routes>
        <Route path="/"element={<Home/>}/>
        <Route path="/board" element={<BoardList/>}/>
        <Route path="/board/view/:idx" element={<TitleClick_view/>}/>
        <Route path="/board/view/writer/:idx" element={<TitleClick_view_forWriter/>}/>
        <Route path="/board/edit/:idx" element={<TitleClick_edit/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/create" element={<CreateBoard/>}/>
        <Route path="/create/tv/:tvidx/:boardidx" element={<CreateNetworkTv/>}/>
        <Route path="/create/mv/:mvidx/:boardidx" element={<CreateNetworkMovie/>}/>
        <Route path="/create/movie/:mvidx/:boardidx" element={<CreateNetworkMovie/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route path="/mypage" element={<Mypage/>}/>
        
      </Routes>
  );
};

export default App;
 