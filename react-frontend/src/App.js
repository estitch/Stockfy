import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddProduct from './pages/add-product'
import ListProduct from './pages/list-product'
import Main from './pages/index'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main/>}>
       <Route path="/add-product" element={<AddProduct />} />
       <Route path="/list-product" element={<ListProduct />} />
      </Route>
    </Routes>
   </BrowserRouter>
  );
}

export default App;
