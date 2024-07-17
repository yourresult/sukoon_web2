"use client"
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

config.autoAddCss = false;

// import styles from "./page.module.css";
// import Image from "next/image";



export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const newMessage = {
    type: 'user',
    // text: inputValue,
    "input": inputValue,
    "intermediate_steps": []
  };

  const resMessage = {
    type: 'ai',
    data: {
      answer: "",
      source: ""
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    // Add new message to local state immediately
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue(''); // Clear input field

    try {
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });

      if (!response.ok) {
        throw new Error('Failed to add message');
      }

      const data = await response.json();
      resMessage.data = data;
      setMessages(prevMessages => [...prevMessages, { ...resMessage, data }]);
      // console.log('Server response:', data);
    } catch (error) {
      // console.error('Error adding message:', error);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  console.log(messages)

  return (
    <main>
      {/* Conversatation / Messages */}
      <div className="conv">
        <div className="container w-50 pt-5">
          {messages.map((message, index) => (
            <div key={index}>
              <br />
              <div key={index} className={`row d-inline-block ${message.type === 'user' ? 'rightMsg bg-secondary' : 'leftMsg bg-primary'}`}>
                {message.type === 'user' ? message.input : message.data.answer}
              </div>
            </div>
          ))}
          <br />
        </div>
      </div>
      {/* Query Input */}
      <div className="row w-50 mx-auto query-action">
        <div className="input-group mb-3">
          <div className="form-floating">
            <input type="text" className="w-100 h-100" id="floatingInputGroup1" value={inputValue} placeholder="Write your query" onChange={handleChange} />
          </div>
          <span className="input-group-text d-flex justify-content-center submit" onClick={handleSubmit}><i
            className="fa-solid fa-arrow-up"></i><FontAwesomeIcon icon={faArrowUp} /></span>
        </div>
      </div>
    </main >
  );
}
