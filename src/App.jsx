import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calendar from "./pages/Calander";
import GlobalContextProvider from "./context/GlobalcontextProvider";
import Events from "./pages/Events";


function App() {
  
  return(
    <>
      <GlobalContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </BrowserRouter>       
      </GlobalContextProvider>
    </>
  )
}

export default App
