import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";
import "./updateTask.css";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
};

function UpdateTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

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
      setTask(data);
      setUpdatedTitle(data.title);
      setUpdatedDescription(data.description);
    }
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveError(null);
    setSaveLoading(true);

    const { error } = await supabase
      .from("Tasks")
      .update({ title: updatedTitle, description: updatedDescription })
      .eq("id", taskId)
      .single();

    setSaveLoading(false);

    if (error) {
      setSaveError(error.message);
      return;
    }

    navigate("/");
  }

  useEffect(() => {
    fetchTask();
  }, []);

  if (fetchLoading) return <h1>Loading...</h1>;
  if (fetchError) return <h1>{fetchError}</h1>;

  return (
    <div className="update-task-section">
      <h1 className="update-task-title">Update Task Details</h1>

      <form className="edit-form-container" onSubmit={handleSave}>
        <input
          type="text"
          placeholder="enter new task title"
          value={updatedTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdatedTitle(e.target.value)}
        />

        <textarea
          placeholder="enter new task description"
          value={updatedDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdatedDescription(e.target.value)}
        />

        <button className="save-task-button" disabled={saveLoading}>
          {saveLoading ? "Updating Task..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default UpdateTask;
