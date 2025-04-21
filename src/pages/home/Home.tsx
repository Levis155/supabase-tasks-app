import { ToastContainer, toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GiCheckMark } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePendingActions } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { supabase } from "../../supabase-client";
import { useState, FormEvent } from "react";
import "./Home.css";

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
  const [ newTask, setNewTask ] = useState({title:"", description:"", completed:false});

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.from("Tasks").insert(newTask).single();

    if(error) {
        console.log(error.message);
        return;
    };

    setNewTask({title:"", description:"", completed:false})
    console.log(newTask);
  }


  return (
    <div className="intro-section">
      <h2 className="greeting-text">Hello Levis 👋🏾</h2>

      <h1 className="info-text">You have 0 remaining tasks</h1>

      <form className="form-container" action="" onSubmit={handleAddTask}>
        <input type="text" placeholder="enter task title" onChange={(e) => {setNewTask((prev) => ({...prev, title: e.target.value}))}} />

        <textarea placeholder="enter task description" onChange={(e) => {setNewTask((prev) => ({...prev, description:e.target.value}))}}></textarea>

        <button className="add-task-button">add task</button>
      </form>
    </div>
  );
}

function TaskCardsContainer() {
  return (
    <div className="task-cards-container">
      <div className="task-cards-title-btn">
        <h2 className="task-cards-title">my tasks</h2>
        <button className="task-cards-button">
          <RiDeleteBin6Line />
          clear completed tasks
        </button>
      </div>

      <div className="task-cards">
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>
    </div>
  );
}

function TaskCard() {
  return (
    <div className="task-card">
      <div className="task-card-title-buttons">
        <h3 className="task-card-title">task title</h3>

        <div className="task-card-buttons">
        <button>
            <CiEdit
              data-tooltip-id="my-tooltip"
              data-tooltip-content="edit task"
              className="edit-svg"
            />
          </button>
          
          <button>
            <MdOutlinePendingActions
              data-tooltip-id="my-tooltip"
              data-tooltip-content="mark as pending"
              className="pending-svg"
            />
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
        <p>
          status:
          <span className="span-incomplete">pending</span>
        </p>
      </div>

      <p className="description-incomplete">task description</p>
    </div>
  );
}
export default Home;
