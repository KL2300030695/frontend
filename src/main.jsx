import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Dashboard from './Dashboard'
import AddDoctor from './AddDoctor'
import BookAppointment from './BookAppointment'
import MyAppointments from './MyAppointments'
import MedicalRecords from './MedicalRecords'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>} />
      <Route path='/Dashboard' element={<Dashboard/>} />
      <Route path='/add-doctor' element={<AddDoctor/>} />
      <Route path='/book-appointment' element={<BookAppointment/>} />
      <Route path='/my-appointments' element={<MyAppointments/>} />
      <Route path='/view-appointments' element={<MyAppointments/>} />
      <Route path='/medical-records' element={<MedicalRecords/>} />
    </Routes>
  </BrowserRouter>
)