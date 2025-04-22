import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GiCheckMark } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePendingActions } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { supabase } from "../../supabase-client";
import { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
};

interface FormSectionProps {
  fetchTasks: () => Promise<void>;
}
interface TaskCardsContainerProps {
  fetchTasks: () => Promise<void>;
  fetchTasksLoading: boolean;
  fetchTasksError: string | null;
  tasks: Task[];
}

interface TaskCardProps {
  id: string;
  to: string;
  taskTitle: string;
  taskDescription: string;
  completed: boolean;
  onMarkTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id:string) => void;
}

function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fetchTasksLoading, setFetchTasksLoading] = useState(false);
  const [fetchTasksError, setFetchTasksError] = useState<string | null>(null);

  async function fetchTasks() {
    setFetchTasksLoading(true);
    setFetchTasksError(null);

    const { data, error } = await supabase
      .from("Tasks")
      .select("*")
      .order("created_at", { ascending: true });

    setFetchTasksLoading(false);

    if(error) {
      setFetchTasksError(error.message);
      return;
    }

    setTasks(data);
  }

  useEffect(() => {
    fetchTasks();
  }, []);
  
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <FormSection fetchTasks={fetchTasks} />
      <TaskCardsContainer fetchTasks={fetchTasks} fetchTasksLoading={fetchTasksLoading} fetchTasksError={fetchTasksError} tasks={tasks} />
    </>
  );
}

function FormSection({fetchTasks}:FormSectionProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [addTaskLoading, setAddTaskLoading] = useState(false);

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddTaskLoading(true);

    const { error } = await supabase.from("Tasks").insert(newTask).single();
    setAddTaskLoading(false);

    if (error) {
      toast.error("Failed to add task");
      return;
    }

    setNewTask({ title: "", description: "", completed: false });
    fetchTasks()
    toast.success("Task added!");
  }

  return (
    <div className="intro-section">
      <h2 className="greeting-text">Hello 👋🏾</h2>

      <h1 className="info-text">You have 0 remaining tasks</h1>

      <form className="form-container" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Enter task title"
          value={newTask.title}
          onChange={(e) => {
            setNewTask((prev) => ({ ...prev, title: e.target.value }));
          }}
        />

        <textarea
          placeholder="Enter task description"
          value={newTask.description}
          onChange={(e) => {
            setNewTask((prev) => ({ ...prev, description: e.target.value }));
          }}
        ></textarea>

        <button className="add-task-button" disabled={addTaskLoading}>
          {addTaskLoading ? "Please wait..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}

function TaskCardsContainer({fetchTasks, fetchTasksLoading, fetchTasksError, tasks}:TaskCardsContainerProps) {


  async function handleMarkTask(id: string, completed: boolean) {
    const { error } = await supabase
      .from("Tasks")
      .update({ completed: !completed })
      .eq("id", id)
      .single();

      if(error) {
        toast.error("Failed to update task.");
        return;
      }

      toast.success(`Task marked as ${completed ? "pending" : "complete"}`);
      fetchTasks();
  }

  async function handleDeleteTask(id:string) {
    const {error} = await supabase.from("Tasks").delete().eq("id", id).single()


    if(error) {
      toast.error("Failed to delete task.");
      return;
    }

    toast.success("Task deleted successfully.")
    fetchTasks();
  }

  async function handleClearCompleteTasks() {
    const {error} = await supabase.from("Tasks").delete().eq("completed", true)

    if(error){
      toast.error("Failed to delete complete todos.");
      return;
    }
    toast.success("Complete todos cleared successfully.")
    fetchTasks();
  }

  if (fetchTasksLoading) return <h1>Loading...</h1>;
  if (fetchTasksError) return <h1>{fetchTasksError}</h1>;
  if (tasks.length === 0) return <h1>No remaining tasks</h1>;

  return (
    <div className="task-cards-container">
      <div className="task-cards-title-btn">
        <h2 className="task-cards-title">My Tasks</h2>
        <button className="task-cards-button" onClick={handleClearCompleteTasks}>
          <RiDeleteBin6Line />
          Clear complete tasks
        </button>
      </div>

      <div className="task-cards">
        {tasks.map((item) => (
          <TaskCard
            key={item.id}
            id={item.id}
            to={`update-task/${item.id}`}
            taskTitle={item.title}
            taskDescription={item.description}
            completed={item.completed}
            onMarkTask={handleMarkTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ id, to, taskTitle, taskDescription, completed, onMarkTask, onDeleteTask }: TaskCardProps) {
  return (
    <div className="task-card">
      <div className="task-card-title-buttons">
        <h3 className={completed ? "task-card-title-complete" : "task-card-title"}>
          {taskTitle}
        </h3>

        <div className="task-card-buttons">
          <Link to={to}>
            <CiEdit
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Edit task"
              className="edit-svg"
            />
          </Link>

          <button onClick={() => onMarkTask(id, completed)}>
            {completed ? (
              <MdOutlinePendingActions
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Mark as pending"
                className="pending-svg"
              />
            ) : (
              <GiCheckMark
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Mark as complete"
                className="check-svg"
              />
            )}
          </button>

          <button onClick={() => {onDeleteTask(id)}}>
            <RiDeleteBin6Line
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Delete task"
              className="delete-svg"
            />
          </button>

          <Tooltip id="my-tooltip" />
        </div>
      </div>

      <div className="status">
        <p>
          Status:{" "}
          <span className={completed ? "span-complete" : "span-incomplete"}>
            {completed ? "Complete" : "Pending"}
          </span>
        </p>
      </div>

      <p className={completed ? "description-complete" : "description-incomplete"}>
        {taskDescription}
      </p>
    </div>
  );
}

export default Home;
