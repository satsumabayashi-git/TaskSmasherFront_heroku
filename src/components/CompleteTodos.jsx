import animation from "../media/nc274685_爆発CGアニメーション_その５.mp4";

const style = {
  // display: "none",
};

export const CompleteTodos = (props) => {
  const {
    Todos,
    onClickDelete,
    onClickBack,
    onClickAllDelete,
    isDeletingCompleteTodos,
  } = props;
  return (
    <div className="complete-area">
      <h2 className="title">完了のTODO(ゴミ箱)</h2>
      {!isDeletingCompleteTodos && <p style={{ color: "red" }}>削除前</p>}
      <div id="screenshotArea" style={{ display: isDeletingCompleteTodos ? "none" : "block" }}>
        <ul>
          {Todos.map((todo) => {
            return (
              <li key={todo.id}>
                <div className="list-row">
                  <div className="list-title2">
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
        {isDeletingCompleteTodos && <p style={{ color: "red" }}>削除中</p>}
        <canvas id="processedAnimation" width="400"></canvas>
      </div>
      <button
        disabled={isDeletingCompleteTodos}
        onClick={() => onClickAllDelete()}
        className="danger-button"
      >
        すべて削除（爆破）
      </button>
      
      <video id="deleteAnimation" src={animation} width="0" height="0">
        <p>動画を再生できません。</p>
      </video>
    </div>
  );
};
