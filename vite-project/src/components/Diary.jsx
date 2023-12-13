import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/Diary.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Diary = () => {
  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const mainContentRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // current user id

  const location = useLocation();
  const { otherId } = location.state || {};

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
          // throw new Error('User not logged in');
          navigate('/Login');
        }
      })
      .then((data) => {
        if (data && data.userId) {
          setUserId(data.userId);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/Login');
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [navigate, isAuthenticated]);


  useEffect(() => {
    const apiUrl = () => {
      if(otherId != null) {
        return `/userApi/diaries?id=${otherId}`;
      }else {
        return `/userApi/diaries?id=${userId}`;
      }
    }
    
    const fetchData = () => {
        fetch(apiUrl(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to fetch diaries');
            }
          })
          .then((data) => {
            setDiaries(data);
          })
          .catch((error) => {
            setError(error.message);
          });
      }

    fetchData();

  }, [isAuthenticated, userId, otherId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDelete = (diaryId) => {
    
    const apiUrl = `/userApi/deleteDiary/${diaryId}?id=${userId}`;
  
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          const diariesApiUrl = `/userApi/diaries?id=${userId}`;
          fetch(diariesApiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Failed to fetch diaries');
              }
            })
            .then((data) => {
              setDiaries(data);
            })
            .catch((error) => {
              console.error(error.message);
            });
        } else {
          throw new Error('Failed to delete diary');
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };


  const handlePostDiaryClick = () => {
    navigate('/PostDiary');
  };

  const handleEditDiaryClick = (diaryId) => {
    navigate('/EditDiary', { state: { diaryId: diaryId } });
  };

  const editAndDeleteButtons = (diary) => {
    if (diary.userId == userId) {
      return (
        <div className='manage-btn'>
          <button className='btn delete-btn' onClick={() => handleDelete(diary.id)}>Delete</button>
          <button className='btn edit-btn' onClick={() => handleEditDiaryClick(diary.id)}>Edit</button>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className='diary-area' aria-live="polite" ref={mainContentRef} tabIndex="-1">
      <section className="title">
        <div className="diary-title">
          <h1>📖 Diaries</h1>
        </div>
      </section>
  
      {userId && (!otherId || userId === otherId) && (
        <div className="centered-button">
          <div className='post-btn'>
            <button className="post btn btn-large" onClick={handlePostDiaryClick}>Post</button>
          </div>
        </div>
      )}
  
      <div>
        <ul className='diaryList'>
          {diaries.map((diary) => (
            <li key={diary.id} className='diaryItem'>
              <h4>{diary.title}</h4>
              <p>{diary.content}</p>
              {editAndDeleteButtons(diary)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  };
  
Diary.propTypes = {};

export default Diary;
