import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Home from './pages/Home';
import DeviceSearch from './pages/DeviceSearch';
import DeviceMonitor from './pages/DeviceMonitor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/search-device' element={<DeviceSearch />} />
        <Route path='/device/:deviceId/monitor' element={<DeviceMonitor />} />
      </Routes>
    </Router>
  )
}

export default App
