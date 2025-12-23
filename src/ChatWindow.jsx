import "./ChatWindow.css"
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext,useState ,useEffect} from "react";
import {ScaleLoader} from "react-spinners";
const API_BASE = import.meta.env.VITE_BACKEND_URL;

function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats,setNewChat}= useContext(MyContext);
    const [loading,setLoading] =useState(false);
    

    const getReply= async()=>{
        setLoading(true);
        setNewChat(false);
        const options={ 
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadId:currThreadId
            })
        }

        try{
            // const response= await fetch("http://localhost:8080/api/chat",options);
            const response = await fetch(`${API_BASE}/api/chat`, options);
            const res=await response.json();
            setReply(res.reply);
            console.log(res.reply);
        }
        catch(err){
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats=>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            ))
        }
        setPrompt("");
    },[reply]);

    return (
        <div className="chatwindow">
           <div className="navbar">
                <span>WeConnect AI</span>
           </div>

           <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

           <div className="chatinput">
                <div className="userinput">
                    <input placeholder="Ask anything" value= {prompt} onChange={(e)=>setPrompt(e.target.value)} onKeyDown={(e)=>e.key==="Enter"?getReply():''}>
                    </input>
                    <div id="submit" onClick={getReply} ><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">WeConnect AI can make mistakes.</p>
           </div>

        </div>
    )
}

export default ChatWindow;