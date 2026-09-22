export const IncompleteTodos = (props) => {
  const { Todos, onClickEdit, onClickDelete, onClickComplete } = props;
  return (
    <div className="incomplete-area">
      <h2 className="title">未完了のTODO</h2>
      <ul>
        {Todos.map((todo) => {
          return (
            <li key={todo.id}>
              <div className="list-row">
                <div className="list-title-incomplete">
                  <p className="todo-item">{todo.todo}</p>
                </div>
                <div className="list-button">
                {/* <button onClick={() => Show(todo.id)}>詳細</button> */}
                <button onClick={() => onClickEdit(todo.id)}>詳細</button>
                <button onClick={() => onClickComplete(todo.id)}>完了</button>
                <button onClick={() => onClickDelete(todo.id)}>削除</button>
              </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
