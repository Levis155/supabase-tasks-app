import './App.css'
import Home from './pages/home/Home';
import UpdateTask from './pages/update_task/UpdateTask';
import { Routes, Route } from "react-router-dom"

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/update-task/:taskId' element={<UpdateTask />} />
      </Routes>
    </>
  )
}

export default App
