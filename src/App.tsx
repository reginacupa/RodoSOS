import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { NewCall } from '@/pages/NewCall'
import { AttendanceRoom } from '@/pages/AttendanceRoom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chamado" element={<NewCall />} />
        <Route path="/atendimento" element={<AttendanceRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
