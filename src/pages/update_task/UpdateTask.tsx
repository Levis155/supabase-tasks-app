import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { supabase } from "../../supabase-client";
import ScaleLoader from "react-spinners/ScaleLoader";
import "./updateTask.css";

function UpdateTaskSection() {
  const { taskId } = useParams();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const navigate = useNavigate();

  async function fetchTask() {
    setFetchError(null);
    setFetchLoading(true);

    const { error, data } = await supabase
      .from("Tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    setFetchLoading(false);

    if (error) {
      setFetchError(error.message);
      return;
    }

    if (data) {
      setUpdatedTitle(data.title);
      setUpdatedDescription(data.description);
    }
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveLoading(true);

    const { error } = await supabase
      .from("Tasks")
      .update({ title: updatedTitle, description: updatedDescription })
      .eq("id", taskId)
      .single();

    setSaveLoading(false);

    if (error) {
      toast.error("Failed to update task.");
      return;
    }
    toast.success("Updated task successfully.");
    navigate("/");
  }

  useEffect(() => {
    fetchTask();
  }, []);

  if (fetchLoading)
    return (
      <div className="loader-container">
        <ScaleLoader width={10} height={60} color="#8B8CB1" />
      </div>
    );
  if (fetchError)
    return (
      <div className="info-container">
        <h1>Something went wrong.</h1>;
      </div>
    );

  return (
    <div className="update-task-section">
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
      <h1 className="update-task-title">Update Task Details</h1>

      <form className="edit-form-container" onSubmit={handleSave}>
        <input
          type="text"
          placeholder="enter new task title"
          value={updatedTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUpdatedTitle(e.target.value)
          }
        />

        <textarea
          placeholder="enter new task description"
          value={updatedDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setUpdatedDescription(e.target.value)
          }
        />

        <button className="save-task-button" disabled={saveLoading}>
          {saveLoading ? "Updating Task..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default UpdateTaskSection;
