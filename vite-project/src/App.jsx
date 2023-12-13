import { useState } from 'react'
import './App.css'
import Home from './components/Home.jsx'
import Register from './components/Register'
import Login from './components/Login'
import Diary from './components/Diary'
import PostDiary from './components/PostDiary'
import Reviews from './components/Reviews'
import PostReview from './components/PostReview'
import NavBar from './components/NavBar'
import EditDiary from './components/EditDiary'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'



function App() {

  const [reviews, setReviews] = useState([]);
  const [diaries, setDiaries] = useState([]);

  return (
    <BrowserRouter>
    <NavBar />
      

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />}/>
      <Route path="/Reviews" element={<Reviews reviews={reviews} />} />
      <Route path="/PostReview" element={<PostReview addReview={(review) => setReviews([...reviews, review])} />} />
      <Route path="/Diary" element={<Diary diaries={diaries}/>} />
      <Route
          path="/PostDiary"
          element={<PostDiary addDiary={(diary) => setDiaries([...diaries, diary])} />}
        />
        <Route path="/EditDiary" element={<EditDiary diaries={diaries}/>} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;