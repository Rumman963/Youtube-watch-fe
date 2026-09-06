import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SignIn } from './pages/signin'
import { SignUp } from './pages/signup'
import { JoinRoom } from './pages/JoinRoom'
import { RoomDashboard } from './pages/RoomDashboard'
import { HomePage } from './pages/HomePage'


function App () {



  return <BrowserRouter>
  <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/join' element={<JoinRoom/>} />
        <Route path='/room/:roomId' element={<RoomDashboard/>} />

    
  </Routes>
  
  
  </BrowserRouter>
  
}

export default App