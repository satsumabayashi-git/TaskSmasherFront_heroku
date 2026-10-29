import { useState, useEffect, useCallback } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
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

  useEffect(() => {
    // console.log("getCompleteToDo後に実行");
    screenshot();
  }, [completeTodos]);

  useEffect(() => {
    getCompleteToDo() && getIncompleteToDo() && setIsLogin(true);
  }, []);

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

  const APIAccess = async (path, func, method = "GET", form) => {
    const cookies = cookie.parse(document.cookie);
    const csrf = cookies._ctkn;
    const headers = {};
    if (csrf) {
      headers["X-CSRF-TOKEN"] = csrf;
    }
    const options = {
      method: method,
      credentials: "include",
      cache: "default",
      redirect: "follow",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    };
    method == "POST" && (options.body = form);
    try {
      alert("path =", path);
      alert("csrf =", csrf);
      alert("options =", options);
      const res = await fetch(path, options);
      if (res.fobidden) {
        setFlashMessage({
          errorMessage: "アクセスは許可されませんでした。",
        });
        return;
      }
      try {
        const json = await res.json();
        func(json);
      } catch (jsonErr) {
        console.log(jsonErr);
        alert(jsonErr);
        setIsLogin(false);
        setFlashMessage({
          errorMessage: "ログインしてください。",
        });
      }
    } catch (fetchErr) {
      console.log(fetchErr);
      setFlashMessage({
        errorMessage: `サーバーへのアクセスに失敗しました。${fetchErr}`,
      });
    }
  };

  const getIncompleteToDo = async () => {
    const path = `${import.meta.env.VITE_API_URL}/todos/incomplete`;
    const func = (json) => {
      console.log(json);
      setIncompleteTodos(json);
      return json;
    };
    APIAccess(path, func);
  };

  const getCompleteToDo = async () => {
    const path = `${import.meta.env.VITE_API_URL}/todos/complete`;
    const func = (json) => {
      console.log(json);
      setCompleteTodos(json);
      return json;
    };
    APIAccess(path, func);
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
    const path = `${import.meta.env.VITE_API_URL}/todos/${id}`;
    const func = (json) => {
      console.log(json);
      setTodoDetail(json);
      setInputTodo({
        id: json.id,
        isNew: false,
        todo: json.todo,
        detail: json.detail,
      });
      setFlashMessage({});
      return json;
    };
    APIAccess(path, func);
  };

  const onClickNew = () => {
    setInputTodo({
      id: "",
      isNew: true,
      todo: "",
      detail: "",
    });
    setTodoDetail({});
  };

  const onClickAdd = async () => {
    const form = new FormData(document.getElementById("toDoForm"));
    const status = inputTodo.isNew ? "save" : "update";
    const path = `${import.meta.env.VITE_API_URL}/todos/${status}`;
    const func = (json) => {
      console.log(json);
      if (json.postResult === "validationError") {
        let todoError;
        let detailError;
        // console.log(json.errorList);
        json.errorList.forEach((error) => {
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
      json.postResult === "saved" &&
        setFlashMessage({
          message: "新しいToDoが作成されました",
        });
      json.postResult === "updated" &&
        setFlashMessage({
          message: "ToDoが更新されました",
        });
      setTodoDetail({});
    };
    APIAccess(path, func, "POST", form);
  };

  const onClickDelete = async (id) => {
    const path =
      id == "all"
        ? `${import.meta.env.VITE_API_URL}/todos/all-delete`
        : `${import.meta.env.VITE_API_URL}/todos/delete/${id}`;
    const func = (json) => {
      console.log(json);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
      setFlashMessage({
        message: "ToDoを削除しました",
      });
    };
    APIAccess(path, func, "POST");
  };

  const onClickComplete = async (id) => {
    const path = `${import.meta.env.VITE_API_URL}/todos/complete/${id}`;
    const func = (json) => {
      console.log(json);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
    };
    APIAccess(path, func, "POST");
  };

  const onClickBack = async (id) => {
    const path = `${import.meta.env.VITE_API_URL}/todos/incomplete/${id}`;
    const func = (json) => {
      console.log(json);
      // getIndex();
      getIncompleteToDo();
      getCompleteToDo();
    };
    APIAccess(path, func, "POST");
  };

  const loginRequest = useCallback(async () => {
    const path = `${import.meta.env.VITE_API_URL}/authentication`;
    const form = new FormData(document.getElementById("loginForm"));
    const func = (json) => {
      console.log(json);
      if (json.result === "success") {
        setIsLogin(true);
        setFlashMessage({
          message: "ログインしました。",
        });
        // alert("ログインしました");
        // getIndex();
        getIncompleteToDo();
        // getCompleteToDo();
      } else if (json.result === "failure") {
        setFlashMessage({
          errorMessage: "メールアドレスまたはパスワードが正しくありません。",
        });
        // alert("メールアドレスまたはパスワードが正しくありません。");
      } else {
        console.log("誤った応答です");
      }
    };
    APIAccess(path, func, "POST", form);
  }, []);

  const logout = async () => {
    const path = `${import.meta.env.VITE_API_URL}/logout`;
    const func = (json) => {
      console.log(json.result);
      if (json.result === "success") {
        // setIsLogin(false);
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
    APIAccess(path, func, "POST");
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
      // console.log("スクショ完了");
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

  // async function getdata() {
  //   // Cookie 全体を取得（"key=value; key2=value2" の形式）
  //   const cookies = document.cookie;
  //   console.log(cookies);
  //   console.log(cookies._ctkn);

  //   var r = document.cookie.split(";");
  //   r.forEach(function (value) {
  //     //cookie名と値に分ける
  //     var content = value.split("=");
  //     console.log(content[1]);
  //   });
  // }

  return (
    <>
      <div className="flashMessage">
        <p style={{ color: "blue" }}>{flashMessage.message}</p>
        <p style={{ color: "red" }}>{flashMessage.errorMessage}</p>
      </div>
      {isLogin == false && <Login loginRequest={loginRequest} />}
      {/* <div>
        <button onClick={logout} disabled={!isLogin}>
          ログアウト
        </button>
        <button onClick={getdata}>getdata</button>
        <button onClick={screenshot}>スクショ</button>
        <br></br>
        <button onClick={getIndex}>一覧表示</button>
        <a href={`${import.meta.env.VITE_API_URL}/todos/1`}>
          Springのサーバーへ
        </a>
      </div> */}
      <br></br>
      {isLogin == true && (
        <div>
          <div className="menu">
            <button onClick={onClickNew} className="menu-button">
              新規作成
            </button>
            {/* <button onClick={getIncompleteToDo}>未完了リスト</button>
            <button onClick={getCompleteToDo}>完了リスト</button> */}
            <button onClick={logout} className="menu-button">
              ログアウト
            </button>
          </div>
          <div className="todos">
            <InputTodo
              message={formErrorMessage}
              inputTodo={inputTodo}
              onChangeTitle={onChangeTodoTitle}
              onChangeDetail={onChangeTodoDetail}
              onClickAdd={onClickAdd}
              onClickNew={onClickNew}
              isDisabled={isMaxLimitIncompleteTodos}
            />

            <TodoDetail
              Todo={todoDetail}
              edit={onClickEdit}
              onClickDelete={onClickDelete}
              onClickNew={onClickNew}
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
        </div>
      )}
    </>
  );
};
