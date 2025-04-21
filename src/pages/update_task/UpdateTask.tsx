import "./updateTask.css";

function UpdateTask() {
  return (
    <div className="update-task-section">
      <h1 className="update-task-title">update task details</h1>

      <form className="edit-form-container" action="">
        <input type="text" placeholder="enter new task title" />

        <textarea placeholder="enter new task description"></textarea>

        <button className="save-task-button">save</button>
      </form>
    </div>
  );
}

export default UpdateTask;
