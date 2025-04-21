import './App.css'
import Home from './pages/home/Home';
import UpdateTaskSection from './pages/update_task/UpdateTask';
import { Routes, Route } from "react-router-dom"

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/update-task/:taskId' element={<UpdateTaskSection />} />
      </Routes>
    </>
  )
}

export default App
