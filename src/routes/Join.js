import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Join=()=>{

    const [Nickname, setNickname] = useState("");
    const [Pw, setPw] = useState("");
    const navigate=useNavigate();

    const onNicknameHandler=(event)=>{
        setNickname(event.currentTarget.value);
    }
    const onPwHandler=(event)=>{
        setPw(event.currentTarget.value)
    }
    const onSubmitHandler=async(event)=>{
        event.preventDefault();

        let data={
            nickname: Nickname,
            pw: Pw
        };
        console.log(data);

        try{
            const resp=(await axios.post("/join",data)).status;
            if(resp==200) navigate('/login');
            else if(resp==409) alert("중복된 ID입니다.");
        }
        catch(error){
            console.error(error);
        }
    }

    return(
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
                    Join
                </button>
            </form>
        </div>
    )
}

export default Join;