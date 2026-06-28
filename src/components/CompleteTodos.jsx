export const CompleteTodos = (props) => {
  const { Todos, onClickDelete, onClickBack } = props;
  return (
    <div className="complete-area">
      <p className="title">完了のTODO(ゴミ箱)</p>
      <ul>
        {Todos.map((todo) => {
          return (
            <li key={todo.id}>
              <div className="list-row">
                <p className="todo-item">{todo.todo}</p>
                <button onClick={() => onClickBack(todo.id)}>戻す</button>
                <button onClick={() => onClickDelete(todo.id)}>削除</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
