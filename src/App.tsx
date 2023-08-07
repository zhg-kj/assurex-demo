import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Pay from './pages/pay';
import Purchase from './pages/purchase';
import Nav from './components/nav';

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="pay" element={ <Pay/> } />
        <Route path="purchase" element={ <Purchase/> } />
      </Routes>
    </div>
  );
}

export default App;
