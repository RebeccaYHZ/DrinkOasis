import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../assets/css/PostDiary.css';
import 'bootstrap/dist/css/bootstrap.min.css'

function PostDiary() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const userId = checkUserLoginStatus();
  const navigate = useNavigate();
  const mainContentRef = useRef(null);

  useEffect(() => {
    mainContentRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    }
  };

  const handlePostDiary = (e) => {
    e.preventDefault();
    if (title && content) {
      fetch(`/userApi/postDiary?id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content,  
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            navigate("/Diary");
            return response.json();
          } else {
            setStatusMessage("Failed to post diary. Please try again.");
            throw new Error('Failed to post diary');
          }
        })
        .catch((error) => {
          console.error(error.message);
          setStatusMessage(`An error occurred: ${error.message}`);
        });
    }else {
      setStatusMessage("Please fill in the title and content before posting.");
      alert("Please fill in the title and content before posting");
    }
  };

  function checkUserLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user && user.id ? user.id : null;
  }

  return (
      <div className='post-area' ref={mainContentRef} tabIndex="-1">
        <section className="title">
        <div className="post-title">
          <h1>📖 Post Your Diary!</h1>
        </div>
        </section>
      <div className='text'>
        <form onSubmit={handlePostDiary} aria-live="polite">
          <div className='text-area'>
            <label htmlFor="diaryTitle">Diary Title</label>
            <textarea
              id="diaryTitle"
              placeholder="Write your diary title..."
              className='text-box'
              name='title'
              value={title}
              onChange={handleInputChange}
            />
            <label htmlFor="diaryContent">Diary Entry</label>
            <textarea
              id="diaryContent"
              placeholder="Write your diary entry..."
              className='text-box'
              name='content'
              value={content}
              onChange={handleInputChange}
            />
            <button className='btn btn-lg btn-block btn-submit' type="submit">Post</button>
            <Link to="/Diary" className='back-link'>Back to Diaries</Link>
          </div>
          {statusMessage && <div>{statusMessage}</div>}
        </form>
      </div>
    </div>
  );
}

PostDiary.propTypes = {
    addDiary: PropTypes.func.isRequired,
  };

export default PostDiary;
