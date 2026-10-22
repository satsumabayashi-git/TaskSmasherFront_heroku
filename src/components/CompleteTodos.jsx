import { memo } from "react";
import animation from "../media/爆発アニメーション１.mp4";

export const CompleteTodos = memo((props) => {
  const {
    todos,
    onClickDelete,
    onClickBack,
    onClickAllDelete,
    isDeletingCompleteTodos,
    deleteFinished,
    processer,
  } = props;

  return (
    <div className="complete-area">
      <h2 className="title">ゴミ箱</h2>
      {/* {!isDeletingCompleteTodos && <p style={{ color: "red" }}>削除前</p>} */}
      <div
        id="screenshotArea"
        style={{ display: isDeletingCompleteTodos ? "none" : "block" }}
      >
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo.id}>
                <div className="list-row">
                  <div className="list-title-complete">
                    <p className="todo-item">{todo.todo}</p>
                  </div>
                  <div className="list-button">
                    <button
                      disabled={isDeletingCompleteTodos}
                      onClick={() => onClickBack(todo.id)}
                    >
                      戻す
                    </button>
                    <button
                      disabled={isDeletingCompleteTodos}
                      onClick={() => onClickDelete(todo.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ display: isDeletingCompleteTodos ? "block" : "none" }}>
        {/* {isDeletingCompleteTodos && <p style={{ color: "red" }}>削除中</p>} */}
        <canvas id="processedAnimation"></canvas>
      </div>
      {/* <div>
        {isDeletingCompleteTodos && <p style={{ color: "red" }}>削除中</p>}
        <canvas id="processedAnimation" width="384px"></canvas>
      </div> */}
      {todos.length == 0 || (
        <button
          disabled={isDeletingCompleteTodos}
          onClick={() => onClickAllDelete()}
          className="danger-button"
        >
          すべて削除
        </button>
      )}

      <video
        id="deleteAnimation"
        src={animation}
        width="0"
        height="0"
        onPlay={() => processer.doLoad()}
        onEnded={() => deleteFinished()}
      >
        <p>動画を再生できません。</p>
      </video>
    </div>
  );
});
