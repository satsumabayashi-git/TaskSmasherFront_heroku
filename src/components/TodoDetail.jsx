export const TodoDetail = (props) => {
  const { Todo, Edit, onClickDelete } = props;
  return (
    <div className="incomplete-area">
      <p className="title">TODO詳細</p>
      <div
        style={{
          color: "red",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <table border="1">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{Todo.id}</td>
            </tr>
            <tr>
              <th>タイトル</th>
              <td>{Todo.todo}</td>
            </tr>
            <tr>
              <th>詳細</th>
              <td>{Todo.detail}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{Todo.createdAt}</td>
            </tr>
            <tr>
              <th>更新日時</th>
              <td>{Todo.updatedAt}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: "center" }}>
        {/* <button onClick={Edit(Todo.id)}>編集</button> */}
        <button>完了</button>
        <button
          onClick={() => {
            onClickDelete(Todo.id);
          }}
        >
          削除
        </button>
      </div>
    </div>
  );
};

/* <table border="1">
        <tr>
            <th>ID</th>
            <td th:text="${todo.id}"></td>
        </tr>
        <tr>
            <th>タイトル</th>
            <td th:text="${todo.todo}"></td>
        </tr>
        <tr>
            <th>詳細</th>
            <td th:text="${todo.detail}"></td>
        </tr>
       <tr>
            <th>登録日時</th>
            <td th:text="${todo.createdAt.format(
                T(java.time.format.DateTimeFormatter).
                ofPattern('yyyy/MM/dd HH:mm:ss'))}">
            </td>
        </tr>
       <tr>
            <th>更新日時</th>
            <td th:text="${todo.updatedAt.format(
                T(java.time.format.DateTimeFormatter).
                ofPattern('yyyy/MM/dd HH:mm:ss'))}">
            </td>
        </tr>
    </table>
    <a th:href="@{/todos/edit/{id}(id=${todo.id})}">編集</a>
    <form th:action="@{/todos/delete/{id}(id=${todo.id})}" method="post">
        <input type="submit" value="削除">
    </form> */
