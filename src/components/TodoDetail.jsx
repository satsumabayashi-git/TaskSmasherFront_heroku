import { memo } from "react";

export const TodoDetail = memo((props) => {
  const { Todo, Edit, onClickDelete } = props;
  
  return (
    <div className="incomplete-area">
      <h2 className="title">TODO詳細</h2>
      <div>
        <table>
          <tbody>
            <tr>
              {/* <th>ID</th>
              <td>{Todo.id}</td> */}
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
      <br></br>
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => {
            Edit(Todo.id);
          }}
        >
          編集
        </button>
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
});