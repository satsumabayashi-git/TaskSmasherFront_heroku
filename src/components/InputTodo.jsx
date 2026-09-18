const style = {
};

export const InputTodo = (props) => {
  const { message, inputTodo, onChangeTitle, onChangeDetail, onClick } = props;
  return (
    <div className="input-area">
      <h2>{inputTodo.isNew ? "新規TODO" : "TODO編集"}</h2>

      <form id="toDoForm">
        <input type="hidden" name="isNew" value={inputTodo.isNew} />
        {/* <input name="isNew" value={inputTodo.isNew} /> */}
        <input type="hidden" name="id" value={inputTodo.id} />
        {/* <input name="id" value={inputTodo.id} /> */}
        <input
          type="text"
          name="todo"
          value={inputTodo.todo}
          onChange={onChangeTitle}
          placeholder="タイトル"
        />
        <br></br>
        <span style={{ color: "red" }}>{message.todo}</span>
        <br></br>
        <textarea
          rows="20"
          cols="45"
          name="detail"
          value={inputTodo.detail}
          onChange={onChangeDetail}
          placeholder="詳細"
        ></textarea>
        <br></br>
        <span style={{ color: "red" }}>{message.detail}</span>
        <br></br>
      </form>
      <button onClick={onClick}>{inputTodo.isNew ? "追加" : "更新"}</button>
      <button>戻る</button>
    </div>
  );
};