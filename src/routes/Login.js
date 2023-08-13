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
            const resp=(await axios.post("/LoginForm",data)).data;
            console.log(resp.token);
            localStorage.setItem('accessToken',resp.token);
            navigate('/');
        }
        catch(error){
            console.error(error);
        }

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
        </div>
    ) 
}

export default Login;