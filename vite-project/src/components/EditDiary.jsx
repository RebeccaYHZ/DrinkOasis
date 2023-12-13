import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../assets/css/PostDiary.css';
import 'bootstrap/dist/css/bootstrap.min.css'

function EditDiary() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const mainContentRef = useRef(null);

  const location = useLocation();
  const { diaryId } = location.state ? location.state : null;

  useEffect(() => {
    mainContentRef.current.focus();
    fetch('/userApi/checkAuth', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('User not logged in');
        }
      })
      .then((data) => {
        if (data && data.userId) {
          setUserId(data.userId);
        } else {
          navigate('/Login');
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [navigate, userId]);

  useEffect(() => {
    fetch(`/userApi/getDiary/${diaryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch diary');
        }
      })
      .then((data) => {
        console.log("data: ", data);
        setTitle(data.title);
        setContent(data.content);
      })
        .catch((error) => {
          console.error(error.message);
        });
      }, [diaryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    }
  };

  const handleEditDiary = (e) => {
    e.preventDefault();
    if (title && content && diaryId) {
      fetch(`/userApi/edit/${diaryId}`, {
        method: 'PUT',
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
            setStatusMessage("Diary updated successfully!");
            navigate("/Diary");
            return response.json();
          } else {
            setStatusMessage("Failed to update diary. Please try again.");
            throw new Error('Failed to post diary');
          }
        })
        .catch((error) => {
          setStatusMessage(`An error occurred: ${error.message}`);
          console.error(error.message);
        });
    }else {
      setStatusMessage("Please fill in the title and content.");
      alert("Please fill in the title and content before posting");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <div className='post-area' ref={mainContentRef} tabIndex="-1">
        <section className="title">
        <div className="post-title">
          <h1>📖 Edit Your Diary!</h1>
        </div>
        </section>
      <div className='text'>
        <form onSubmit={handleEditDiary} aria-live="polite">
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
          <button className='btn btn-lg btn-block btn-submit' type="submit" onClick={(e) => handleEditDiary(e)}>Post</button>
          <Link to="/Diary" className='back-link'>Back to Diaries</Link>
          {statusMessage && <div className="status-message">{statusMessage}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

EditDiary.propTypes = {
    addDiary: PropTypes.func.isRequired,
  };

export default EditDiary;
