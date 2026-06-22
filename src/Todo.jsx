import { useState } from "react";
import { useLocation } from "react-router-dom";
// import dotenv from "dotenv";

import "./styles.css";
import { InputTodo } from "./components/InputTodo";
import { IncompleteTodos } from "./components/IncompleteTodos";
import { TodoDetail } from "./components/TodoDetail";
import { CompleteTodos } from "./components/CompleteTodos";
import { Login } from "./components/Login";

// dotenv.config();

export const Todo = () => {
  const [todoText, setTodoText] = useState("");
  const [incompleteTodos, setIncompleteTodos] = useState([]);
  const [todoDetail, setTodoDetail] = useState([]);
  const [completeTodos, setCompleteTodos] = useState([]);
  const [isLogin, setIsLogin] = useState([false]);
  const [loginStatusMessage, setLoginStatusMessage] = useState();

  const onChangeTodoText = (event) => setTodoText(event.target.value);
  const onClickAdd = () => {
    if (todoText === "") return;
    const newTodos = [...incompleteTodos, todoText];
    setIncompleteTodos(newTodos);
    setTodoText("");
  };

  async function getIndex() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      cache: "default",
      credentials: "include",
      redirect: "follow",
    });
    const todos = await res.json();
    console.log(todos);
    setIncompleteTodos(todos);
    return todos;
  }

  async function onClickShow(id) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      cache: "default",
      credentials: "include",
      redirect: "follow",
    });
    const todo = await res.json();
    console.log(todo);
    setTodoDetail(todo);
    return todo;
  }

  // const onClickDelete = (index) => {
  //   const newTodos = [...incompleteTodos];
  //   newTodos.splice(index, 1);
  //   setIncompleteTodos(newTodos);
  // };

  // const onClickComplete = (index) => {
  //   // alert();
  //   const newIncompleteTodos = [...incompleteTodos];
  //   newIncompleteTodos.splice(index, 1);
  //   setIncompleteTodos(newIncompleteTodos);

  //   const newCompleteTodos = [...completeTodos, incompleteTodos[index]];
  //   setCompleteTodos(newCompleteTodos);
  // };

  // const onClickBack = (index) => {
  //   const newCompleteTodos = [...completeTodos];
  //   newCompleteTodos.splice(index, 1);
  //   setCompleteTodos(newCompleteTodos);

  //   const newIncompleteTodos = [...incompleteTodos, completeTodos[index]];
  //   setIncompleteTodos(newIncompleteTodos);
  // };

  // const isMaxLimitIncompleteTodos = incompleteTodos.length >= 5;

  async function loginByAdmin() {
    const f1 = document.getElementById("f1");
    const loginForm = new FormData(f1);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/authentication`, {
      method: "POST",
      cache: "default",
      body: loginForm,
      credentials: "include",
      redirect: "follow",
    });
    const message = await res.json();
    console.log(message);
    if (message.result === "success") {
      setIsLogin(true);
      setLoginStatusMessage("ログインしました");
      alert("ログインしました");
    } else if (message.result === "failure") {
      setLoginStatusMessage(
        "メールアドレスまたはパスワードが正しくありません。"
      );
      alert("メールアドレスまたはパスワードが正しくありません。");
    }
  }

  async function getdata() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      cache: "default",
      credentials: "include",
      redirect: "follow",
    });
    console.log(res.redirected); // true
    console.log(res.url); // 最終的なURL
    const data = await res.json();
    console.log(data);
    alert("");
  }

  async function logout() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      cache: "default",
      credentials: "include",
      redirect: "follow",
    });
    const message = await res.json();
    console.log(message.result);
    if (message.result === "success") {
      setIsLogin(false);
      setLoginStatusMessage("ログアウトしました");
      alert("ログアウトしました");
    } else {
      setLoginStatusMessage("エラーが発生しました");
      alert("エラーが発生しました");
    }
  }

  return (
    <>
      <Login loginRequest={loginByAdmin} />
      <button onClick={logout}>ログアウト</button>
      <br></br>
      <button onClick={getIndex}>一覧表示</button>
      <a href={`${import.meta.env.VITE_API_URL}/todos/1`}>Springのサーバーへ</a>

      {/* <InputTodo
        todoText={todoText}
        onChange={onChangeTodoText}
        onClick={onClickAdd}
        disabled={isMaxLimitIncompleteTodos}
      /> */}

      {/* {isMaxLimitIncompleteTodos && (
        <p style={{ color: "red" }}>登録できるのは５個までです!</p>
      )} */}

      <TodoDetail Todo={todoDetail} />

      <IncompleteTodos
        Todos={incompleteTodos}
        Show={onClickShow}
        // onClickDelete={onClickDelete}
        // onClickComplete={onClickComplete}
      />
      {/* <CompleteTodos Todos={completeTodos} onClickBack={onClickBack} /> */}
    </>
  );
};
