import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GiCheckMark } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePendingActions } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { supabase } from "../../supabase-client";
import { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom"
import "./Home.css";

type Task = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
  };

interface TaskCardProps{
    taskId:string
    taskTitle:string
    taskDescription:string
    completed:boolean
}

function Home() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <FormSection />
      <TaskCardsContainer />
    </>
  );
}

function FormSection() {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    const { error } = await supabase.from("Tasks").insert(newTask).single();

    setIsLoading(false);

    if (error) {
      console.log(error.message);
      return;
    }

    setNewTask({ title: "", description: "", completed: false });
    console.log(newTask);
  }

  return (
    <div className="intro-section">
      <h2 className="greeting-text">Hello Levis 👋🏾</h2>

      <h1 className="info-text">You have 0 remaining tasks</h1>

      <form className="form-container" action="" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="enter task title"
          onChange={(e) => {
            setNewTask((prev) => ({ ...prev, title: e.target.value }));
          }}
        />

        <textarea
          placeholder="enter task description"
          onChange={(e) => {
            setNewTask((prev) => ({ ...prev, description: e.target.value }));
          }}
        ></textarea>

        <button className="add-task-button" disabled={isLoading}>
          {isLoading ? "please wait" : "add task"}
        </button>
      </form>
    </div>
  );
}

function TaskCardsContainer() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTasks() {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Tasks")
      .select("*")
      .order("created_at", { ascending: true });

    setIsLoading(false);

    if (error) {
      console.log(error.message);
      setError(error.message); 
      return;
    }

    if (data) {
      setTasks(data);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if(tasks.length > 0) {
    return(
        <div className="task-cards-container">
        <div className="task-cards-title-btn">
          <h2 className="task-cards-title">my tasks</h2>
          <button className="task-cards-button">
            <RiDeleteBin6Line />
            clear completed tasks
          </button>
        </div>
  
        <div className="task-cards">
            {
                tasks.map(item => <TaskCard taskId={item.id} taskTitle={item.title} taskDescription={item.description} completed={item.completed} />)
            }
        </div>
      </div>
    )
  }

}

function TaskCard({taskId, taskTitle, taskDescription, completed} : TaskCardProps) {
  return (
    <div className="task-card">
      <div className="task-card-title-buttons">
        <h3 className={completed ? "task-card-title-complete" : "task-card-title"}>{taskTitle}</h3>

        <div className="task-card-buttons">
          <button>
            <CiEdit
              data-tooltip-id="my-tooltip"
              data-tooltip-content="edit task"
              className="edit-svg"
            />
          </button>

          <button>
          {completed ? <MdOutlinePendingActions data-tooltip-id="my-tooltip" data-tooltip-content="mark as pending" className="pending-svg" /> : <GiCheckMark data-tooltip-id="my-tooltip" data-tooltip-content="mark as complete" className="check-svg" />}
          </button>

          <button>
            <RiDeleteBin6Line
              data-tooltip-id="my-tooltip"
              data-tooltip-content="delete task"
              className="delete-svg"
            />
          </button>

          <Tooltip id="my-tooltip" />
        </div>
      </div>

      <div className="status">
      <p>status: <span className={completed ? "span-complete" : "span-incomplete"}>{completed? "complete" : "pending"}</span></p>
      </div>

      <p className={completed ? "description-complete" : "description-incomplete"}>{taskDescription}</p>
    </div>
  );
}
export default Home;
