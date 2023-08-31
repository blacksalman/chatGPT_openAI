import { useState, useEffect } from "react";

const  App = ()  => {

  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChat, setPreviousChat] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () =>{
    setMessage(null);
    setValue("");
    setCurrentTitle(null); 
  }

  const handleClick = (uniqueTitle) =>{
    setCurrentTitle(uniqueTitle)
    setMessage(null);
    setValue("");
  }

  const getMessages = async () =>{

    const options = {
      method:'POST',
      body: JSON.stringify({
        message: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message)
    } catch (error) {
      console.log('error', error);
    }
  }


  useEffect(()=>{
    if(!currentTitle && value && message){
      setCurrentTitle(value);
    }
    if(currentTitle && value && message){
      setPreviousChat(prevChat=> (
          [...prevChat,
              {
                title:currentTitle,
                role: 'user',
                content: value
              },
              {
                title: currentTitle,
                role: message.role,
                content: message.content
              }
          ]
      ))
    }
  },[message, currentTitle])


  const currentChat = previousChat.filter(previousChat=>previousChat.title === currentTitle);
  const uniqueTitle = Array.from(new Set(previousChat.map(previousChat=>previousChat.title)));
   
  return (
    <div className="app">
      <section className="side_bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitle.map((uniqueTitle, index) => <li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Do-San</p>
        </nav>
      </section>
      <section className="main">
       {!currentTitle &&  <h1>Do-San_GPT</h1> }
        <ul className="feed">
          {currentChat.map((chatMessage, index)=> <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom_section">
          <div className="input_container">
            <input value={value} onChange={(e)=>setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with
            Your feedback will help us imporve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
