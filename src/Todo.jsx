import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import dotenv from "dotenv";
import cookie from "cookie";
// import request from "superagent";

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
  const [flashMessage, setFlashMessage] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState({});
  const [isDeletingCompleteTodos, setIsDeletingCompleteTodos] = useState(false);
  const [videoHeight, setVideoHeight] = useState();

  const isMaxLimitIncompleteTodos = incompleteTodos.length >= 10;

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

  const APIAccess = (res, func) => {
    if (res.ok) {
      func();
    } else if (res.fobidden) {
      setFlashMessage({
        errorMessage: "アクセスは許可されませんでした。",
      });
      // alert("forbidden");
    } else {
      setFlashMessage({
        errorMessage: `アクセスに失敗しました。error:${res.status}`,
      });
      // alert(`error:${res.status}`);
    }
  };

  useEffect(() => {
    console.log("getCompleteToDo後に実行");
    screenshot();
  }, [completeTodos]);

  const getIndex = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      credentials: "include",
      cache: "default",
      redirect: "follow",
    });
    const todos = await res.json();
    console.log(todos);
    setIncompleteTodos(todos);
    return todos;
  };

  const getIncompleteToDo = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/todos/incomplete`,
      {
        credentials: "include",
        cache: "default",
        redirect: "follow",
      }
    );
    const todos = await res.json();
    console.log(todos);
    setIncompleteTodos(todos);
    return todos;
  };

  const getCompleteToDo = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/complete`, {
      credentials: "include",
      cache: "default",
      redirect: "follow",
    });
    const func = async () => {
      const todos = await res.json();
      console.log(todos);
      setCompleteTodos(todos);
      return todos;
    };
    APIAccess(res, func);
  };

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
  //   APIAccess(res, func);
  // }

  const onClickEdit = async (id) => {
    // const todo = await onClickShow(id);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      credentials: "include",
      cache: "default",
      redirect: "follow",
    });
    const func = async () => {
      const todo = await res.json();
      console.log(todo);
      setTodoDetail(todo);
      setInputTodo({
        id: todo.id,
        isNew: false,
        todo: todo.todo,
        detail: todo.detail,
      });
      setFlashMessage({});
      return todo;
    };
    APIAccess(res, func);
  };

  const onClickNew = () => {
    setInputTodo({
      id: "",
      isNew: true,
      todo: "",
      detail: "",
    });
  };

  const onClickAdd = async () => {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const toDoForm = new FormData(document.getElementById("toDoForm"));
    let method = inputTodo.isNew ? "save" : "update";
    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${method}`, {
      method: "POST",
      body: toDoForm,
      credentials: "include",
      cache: "default",
      redirect: "follow",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    });
    const func = async () => {
      const message = await res.json();
      console.log(message);
      if (message.postResult === "validationError") {
        let todoError;
        let detailError;
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
        setFlashMessage({
          message: "新しいToDoが作成されました",
        });
      message.postResult === "updated" &&
        setFlashMessage({
          message: "ToDoが更新されました",
        });
      setTodoDetail({});
    };
    APIAccess(res, func);
  };

  const onClickDelete = async (id) => {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    let url = `${import.meta.env.VITE_API_URL}/todos/delete/${id}`;
    id == "all" && (url = `${import.meta.env.VITE_API_URL}/todos/all-delete`);
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      cache: "default",
      redirect: "follow",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    });
    const func = async () => {
      const result = await res.json();
      console.log(result);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
      setFlashMessage({
        message: "ToDoを削除しました",
      });
    };
    APIAccess(res, func);
  };

  const onClickComplete = async (id) => {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/todos/complete/${id}`,
      {
        method: "POST",
        credentials: "include",
        cache: "default",
        redirect: "follow",
        headers: {
          "X-CSRF-TOKEN": csrf,
        },
      }
    );
    const func = async () => {
      const result = await res.json();
      console.log(result);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
    };
    APIAccess(res, func);
  };

  const onClickBack = async (id) => {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/todos/incomplete/${id}`,
      {
        method: "POST",
        credentials: "include",
        cache: "default",
        redirect: "follow",
        headers: {
          "X-CSRF-TOKEN": csrf,
        },
      }
    );
    const func = async () => {
      const result = await res.json();
      console.log(result);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
    };
    APIAccess(res, func);
  };

  const loginRequest = useCallback(async () => {
    const loginForm = new FormData(document.getElementById("loginForm"));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/authentication`, {
      method: "POST",
      body: loginForm,
      credentials: "include",
      cache: "default",
      redirect: "follow",
    });
    const func = async () => {
      const message = await res.json();
      console.log(message);
      if (message.result === "success") {
        setIsLogin(true);
        setFlashMessage({
          message: "ログインしました。",
        });
        // alert("ログインしました");
        // getIndex();
        getIncompleteToDo();
        getCompleteToDo();
      } else if (message.result === "failure") {
        setFlashMessage({
          errorMessage: "メールアドレスまたはパスワードが正しくありません。",
        });
        // alert("メールアドレスまたはパスワードが正しくありません。");
      }
    };
    APIAccess(res, func);
  }, []);

  const logout = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
      cache: "default",
      redirect: "follow",
    });
    const message = await res.json();
    console.log(message.result);
    if (message.result === "success") {
      setIsLogin(false);
      setFlashMessage({
        message: "ログアウトしました",
      });
      // alert("ログアウトしました");
    } else {
      setFlashMessage({
        errorMessage: "エラーが発生しました",
      });
      // alert("エラーが発生しました");
    }
  };

  const processor = {};
  processor.doLoad = function doLoad() {
    this.video = document.getElementById("deleteAnimation");
    this.c2 = document.getElementById("processedAnimation");
    this.ctx2 = this.c2.getContext("2d");
    this.width = 384;
    this.height = videoHeight < 144 ? 144 : videoHeight;
    this.height && this.timerCallback();
  };
  processor.timerCallback = function timerCallback() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 0);
  };
  processor.computeFrame = function () {
    this.ctx2.drawImage(this.video, 0, 0, this.width, this.height);
    const frame = this.ctx2.getImageData(0, 0, 384, this.height);
    const data = frame.data;
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i + 0];
      const green = data[i + 1];
      const blue = data[i + 2];
      if (red < 5 && green < 5 && blue < 5) {
        data[i + 3] = 0;
      }
    }
    this.ctx2.putImageData(frame, 0, 0);
  };

  const screenshot = () => {
    const screenshotArea = document.getElementById("screenshotArea");
    const animationArea = document.getElementById("processedAnimation");

    html2canvas(screenshotArea, { scale: 1 }).then((canvas) => {
      const imagedata = canvas.toDataURL("image/png");
      const height = canvas.height;
      animationArea.style.width = "384px";
      animationArea.style.height = height + "px";

      setVideoHeight(height);
      animationArea.style.backgroundImage = `url(${imagedata})`;
      console.log("スクショできた");
    });
  };

  const onClickAllDelete = () => {
    const deleteAnimation = document.getElementById("deleteAnimation");

    setIsDeletingCompleteTodos(true);
    deleteAnimation.play();
  };

  const deleteFinished = () => {
    setIsDeletingCompleteTodos(false);
    onClickDelete("all");
  };

  async function getdata() {
    // Cookie 全体を取得（"key=value; key2=value2" の形式）
    const cookies = document.cookie;
    console.log(cookies);
    console.log(cookies._ctkn);

    var r = document.cookie.split(";");
    r.forEach(function (value) {
      //cookie名と値に分ける
      var content = value.split("=");
      console.log(content[1]);
    });
  }

  return (
    <>
      {/* <Router>
        <Routes>
          <Route path="/" element={<InputTodo />} />
          <Route path="/IncompleteTodos" element={<IncompleteTodos />} />
        </Routes>
      </Router> */}
      <div className="flashMessage">
        <p style={{ color: "blue" }}>{flashMessage.message}</p>
        <p style={{ color: "red" }}>{flashMessage.errorMessage}</p>
      </div>
      <Login loginRequest={loginRequest} />
      <button onClick={logout} disabled={!isLogin}>
        ログアウト
      </button>
      <button onClick={getdata}>getdata</button>
      <button onClick={screenshot}>スクショ</button>
      <br></br>
      <button onClick={getIndex}>一覧表示</button>
      <a href={`${import.meta.env.VITE_API_URL}/todos/1`}>Springのサーバーへ</a>
      <br></br>
      <div className="menu">
        <button onClick={onClickNew}>新規作成</button>
        <button onClick={getIncompleteToDo}>未完了リスト</button>
        <button onClick={getCompleteToDo}>完了リスト</button>
        <button onClick={logout}>ログアウト</button>
      </div>
      <div className="todos">
        <InputTodo
          message={formErrorMessage}
          inputTodo={inputTodo}
          onChangeTitle={onChangeTodoTitle}
          onChangeDetail={onChangeTodoDetail}
          onClick={onClickAdd}
          disabled={isMaxLimitIncompleteTodos}
        />

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
          todos={completeTodos}
          onClickDelete={onClickDelete}
          onClickBack={onClickBack}
          onClickAllDelete={onClickAllDelete}
          isDeletingCompleteTodos={isDeletingCompleteTodos}
          deleteFinished={deleteFinished}
          processer={processor}
        />
      </div>
    </>
  );
};
