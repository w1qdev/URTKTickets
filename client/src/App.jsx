import { Routes, Route } from 'react-router-dom'
import AdministratorTicketsPage from './pages/AdministratorTicketsPage.jsx'
import './App.css'



function App() {

    return (
        <Routes>
            <Route path='*' element={<AdministratorTicketsPage />} />
        </Routes>
    )
}

export default App
