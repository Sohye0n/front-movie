import React, { useState } from 'react';
import axios from 'axios';
import Interceptor from "../utils/L"
import { useNavigate } from 'react-router-dom';

const Login=()=>{

    const [Nickname, setNickname] = useState("");
    const [Pw, setPw] = useState("");
    const navigate=useNavigate();

    const onNicknameHandler = (event) => {
        setNickname(event.currentTarget.value);
    }
    const onPwHandler = (event) => {
        setPw(event.currentTarget.value);
    }
    const onSubmitHandler = async (event) => {
        // 버튼만 누르면 리로드 되는것을 막아줌
        event.preventDefault();

        console.log('nickname', Nickname);
        console.log('Password', Pw);
        
        let data = {
            nickname: Nickname,
            pw: Pw
        };

        try{
            const resp=(await axios.post("/login",data));
            const responseHeader=await resp.headers['authorization']
            const accessToken=responseHeader.substring(6);
            localStorage.setItem('accessToken',accessToken);
            console.log(responseHeader); console.log(accessToken);
            navigate('/');
        }
        catch(error){
            console.error(error);
        }
    }
    const move=()=>{
        navigate('/join');
    }
 
    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            width: '100%', height: '100vh'
            }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>nickname</label>
                <input type='Nickname' value={Nickname} onChange={onNicknameHandler}/>
                <label>pw</label>
                <input type='Pw' value={Pw} onChange={onPwHandler}/>
                <br />
                <button formAction=''>
                    Login
                </button>
            </form>
            <button onClick={move}>Join</button>
        </div>
    ) 
}

export default Login;