export const IncompleteTodos = (props) => {
  const { Todos, Show } = props;
  return (
    <div className="incomplete-area">
      <p className="title">未完了のTODO</p>
      <ul>
        {Todos.map((todo) => (
          <li key={todo.id}>
            <div className="list-row">
              <p className="todo-item">{todo.todo}</p>
              {/* <button onClick={() => onClickComplete(index)}>完了</button> */}
              <button onClick={() => Show(todo.id)}>詳細</button>
              <button>完了</button>
              <button>削除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>

    /* <h2>ToDo一覧</h2>
<!-- Flashメッセージの表示 -->
<p th:if="${errorMessage}" th:text="${errorMessage}"
  style="color: red;">エラーメッセージ</p>
<p th:if="${message}" th:text="${message}" style="color: blue;">完了メッセージ
</p>

<table border="1" width="300">
  <thead>
    <tr>
      <th>ID</th>
      <th>ToDo</th>
      <th>詳細</th>
    </tr>
  </thead>
  <tbody>
    <tr th:each="todo : ${todos}">
      <td th:text="${todo.id}"></td>
      <td th:text="${todo.todo}"></td>
      <td><a th:href="@{/todos/{id}(id=${todo.id})}">  詳細 </a></td>
    </tr>
  </tbody>
</table>

<a th:href="@{/todos/form}">新規登録</a>
<br>
<a th:href="@{/}">メニュー画面へ</a> */
  );
};
