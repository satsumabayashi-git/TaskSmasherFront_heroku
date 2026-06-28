import { useState } from "react";
import { useLocation } from "react-router-dom";
// import dotenv from "dotenv";
import cookie from "cookie";

import "./styles.css";
import { InputTodo } from "./components/InputTodo";
import { IncompleteTodos } from "./components/IncompleteTodos";
import { TodoDetail } from "./components/TodoDetail";
import { CompleteTodos } from "./components/CompleteTodos";
import { Login } from "./components/Login";

// dotenv.config();

export const Todo = () => {
  const [isLogin, setIsLogin] = useState(false);

  const [inputTodo, setInputTodo] = useState({
    id: "",
    isNew: true,
    todo: "",
    detail: "",
  });
  const [todoDetail, setTodoDetail] = useState({});
  const [incompleteTodos, setIncompleteTodos] = useState([]);
  const [completeTodos, setCompleteTodos] = useState([]);
  const [frashMessage, setFrashMessage] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState({});

  // const isMaxLimitIncompleteTodos = incompleteTodos.length >= 5;

  const onChangeTodoTitle = (event) =>
    setInputTodo({
      id: inputTodo.id,
      isNew: inputTodo.isNew,
      todo: event.target.value,
      detail: inputTodo.detail,
    });
  const onChangeTodoDetail = (event) =>
    setInputTodo({
      id: inputTodo.id,
      isNew: inputTodo.isNew,
      todo: inputTodo.todo,
      detail: event.target.value,
    });

  const APIAccsess = (res, func) => {
    if (res.ok) {
      func();
    } else if (res.fobbidon) {
      setFrashMessage({
        errorMessage: "アクセスは許可されませんでした。",
      });
      // alert("forbidden");
    } else {
      setFrashMessage({
        errorMessage: `アクセスに失敗しました。error:${res.status}`,
      });
      // alert(`error:${res.status}`);
    }
  };

  async function getIndex() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      credentials: "include",
    });
    const todos = await res.json();
    console.log(todos);
    setIncompleteTodos(todos);
    return todos;
  }

  async function getIncompleteToDo() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/todos/incomplete`,
      {
        credentials: "include",
      }
    );
    const todos = await res.json();
    console.log(todos);
    setIncompleteTodos(todos);
    return todos;
  }

  async function getCompleteToDo() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/complete`, {
      credentials: "include",
    });
    async function func() {
      const todos = await res.json();
      console.log(todos);
      setCompleteTodos(todos);
      return todos;
    }
    APIAccsess(res, func);
  }

  // async function onClickShow(id) {
  //   const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
  //     credentials: "include",
  //   });
  //   async function func() {
  //     const todo = await res.json();
  //     console.log(todo);
  //     setTodoDetail(todo);
  //     return todo;
  //   }
  //   APIAccsess(res, func);
  // }

  async function onClickEdit(id) {
    // const todo = await onClickShow(id);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      credentials: "include",
    });
    async function func() {
      const todo = await res.json();
      console.log(todo);
      setTodoDetail(todo);
      setInputTodo({
        id: todo.id,
        isNew: false,
        todo: todo.todo,
        detail: todo.detail,
      });
      return todo;
    }
    APIAccsess(res, func);
  }

  const onClickNew = () => {
    setInputTodo({
      id: "",
      isNew: true,
      todo: "",
      detail: "",
    });
  };

  async function onClickAdd() {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const toDoForm = new FormData(document.getElementById("toDoForm"));
    let method = "save";
    inputTodo.isNew || (method = "update");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${method}`, {
      method: "POST",
      body: toDoForm,
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    });
    async function func() {
      const message = await res.json();
      console.log(message);
      let todoError;
      let detailError;
      if (message.postResult === "validationError") {
        // console.log(message.errorList);
        message.errorList.forEach((error) => {
          error.field === "todo" && (todoError = error.defaultMessage);
          error.field === "detail" && (detailError = error.defaultMessage);
        });
        setFormErrorMessage({
          todo: todoError,
          detail: detailError,
        });
        // console.log(formErrorMessage);
      } else {
        // getIndex();
        getIncompleteToDo();
        setInputTodo({
          id: "",
          isNew: true,
          todo: "",
          detail: "",
        });
        setFormErrorMessage({});
      }
      message.postResult === "saved" &&
        setFrashMessage({
          message: "新しいToDoが作成されました",
        });
      message.postResult === "updated" &&
        setFrashMessage({
          message: "ToDoが更新されました",
        });
      setTodoDetail({});
    }
    APIAccsess(res, func);
  }

  async function onClickDelete(id) {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/todos/delete/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-TOKEN": csrf,
        },
      }
    );
    async function func() {
      const result = await res.json();
      console.log(result);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
      setFrashMessage({
        message: "ToDoを削除しました",
      });
    }
    APIAccsess(res, func);
  }

  async function onClickComplete(id) {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/todos/complete/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-TOKEN": csrf,
        },
      }
    );
    async function func() {
      const result = await res.json();
      console.log(result);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
    }
    APIAccsess(res, func);
  }

  async function onClickBack(id) {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/todos/incomplete/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-TOKEN": csrf,
        },
      }
    );
    async function func() {
      const result = await res.json();
      console.log(result);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
    }
    APIAccsess(res, func);
  }

  async function loginRequest() {
    const loginForm = new FormData(document.getElementById("loginForm"));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/authentication`, {
      method: "POST",
      body: loginForm,
      credentials: "include",
    });
    async function func() {
      const message = await res.json();
      console.log(message);
      if (message.result === "success") {
        setIsLogin(true);
        setFrashMessage({
          message: "ログインしました。",
        });
        // alert("ログインしました");
        // getIndex();
        getIncompleteToDo();
        getCompleteToDo();
      } else if (message.result === "failure") {
        setFrashMessage({
          errorMessage: "メールアドレスまたはパスワードが正しくありません。",
        });
        // alert("メールアドレスまたはパスワードが正しくありません。");
      }
    }
    APIAccsess(res, func);
  }

  async function logout() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    const message = await res.json();
    console.log(message.result);
    if (message.result === "success") {
      setIsLogin(false);
      setFrashMessage({
        message: "ログアウトしました",
      });
      // alert("ログアウトしました");
    } else {
      setFrashMessage({
        errorMessage: "エラーが発生しました",
      });
      // alert("エラーが発生しました");
    }
  }

  // async function getdata() {
  // }

  return (
    <>
      <p style={{ color: "blue" }}>{frashMessage.message}</p>
      <p style={{ color: "red" }}>{frashMessage.errorMessage}</p>
      <Login loginRequest={loginRequest} />
      <button onClick={logout} disabled={!isLogin}>
        ログアウト
      </button>
      <br></br>
      <button onClick={getIndex}>一覧表示</button>
      <button onClick={getIncompleteToDo}>未完了一覧</button>
      <button onClick={getCompleteToDo}>完了一覧</button>
      <a href={`${import.meta.env.VITE_API_URL}/todos/1`}>Springのサーバーへ</a>
      <button onClick={onClickNew}>新規作成</button>
      <InputTodo
        message={formErrorMessage}
        inputTodo={inputTodo}
        onChangeTitle={onChangeTodoTitle}
        onChangeDetail={onChangeTodoDetail}
        onClick={onClickAdd}
        // disabled={isMaxLimitIncompleteTodos}
      />

      {/* {isMaxLimitIncompleteTodos && (
        <p style={{ color: "red" }}>登録できるのは５個までです!</p>
      )} */}

      <TodoDetail
        Todo={todoDetail}
        edit={onClickEdit}
        onClickDelete={onClickDelete}
      />
      <IncompleteTodos
        Todos={incompleteTodos}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
        onClickComplete={onClickComplete}
      />
      <CompleteTodos
        Todos={completeTodos}
        onClickDelete={onClickDelete}
        onClickBack={onClickBack}
      />
    </>
  );
};
