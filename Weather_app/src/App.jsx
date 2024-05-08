import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RegisterAndLogin from './RegisterAndLogin';
import Weather_main from './Weather_main';

function App() {
  
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<RegisterAndLogin />}/>
          <Route path="/home" element={<Weather_main />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
