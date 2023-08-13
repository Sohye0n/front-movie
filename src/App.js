import React, { useState, useEffect } from "react";
import {Route, Routes} from "react-router-dom";
import axios from "axios";
import BoardList from "./routes/BoardList";
import Home from "./routes/Home";
import TitleClick_view from "./routes/TitleClick_view";
import Interceptor from "./utils/L";
import Login from "./routes/Login";
import CreateBoard from "./routes/CreateBoard";
import CreateNetwork from "./routes/CreateNetwork";

function App() {
  Interceptor();
  return (
      <Routes>
        <Route path="/"element={<Home/>}/>
        <Route path="/board" element={<BoardList/>}/>
        <Route path="/board/view/:idx" element={<TitleClick_view/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/create" element={<CreateBoard/>}/>
        <Route path="/create/:idx" element={<CreateNetwork/>}/>
      </Routes>
  );
};

export default App;
 