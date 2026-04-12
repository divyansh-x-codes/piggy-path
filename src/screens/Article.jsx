import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getComments, addComment } from '../api';

const Article = () => {
  const { goScreen, currentStock, posts, handleLike, currentUser } = useAppContext();
  const [localComments, setLocalComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Finding the post that matches current context (simplified for demo)
  const post = posts.find(p => p.stockId === currentStock?.id) || posts[0];

  useEffect(() => {
    if (post) {
      getComments(post.id).then(setLocalComments).catch(console.error);
    }
  }, [post]);

  const onComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await addComment(post.id, commentText);
      setLocalComments([...localComments, newComment]);
      setCommentText('');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!post) return <div style={{ padding: 40, textAlign: 'center' }}>Post not found</div>;

  return (
    <div style={{ flex: 1, backgroundColor: 'white', overflowY: 'auto', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 24px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div onClick={() => goScreen('home')} style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'black' }}>{post.title}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>by {post.user?.name || 'PiggyPath Analyst'}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#333', marginBottom: 24 }}>{post.content}</p>
        
        {/* Interaction Bar */}
        <div style={{ display: 'flex', gap: 20, padding: '16px 0', borderTop: '1px solid #eee' }}>
          <div onClick={() => handleLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
             <span style={{ fontSize: 20 }}>{post.isLiked ? '❤️' : '🤍'}</span>
             <span style={{ fontWeight: 700 }}>{post.likeCount}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
             <span style={{ fontSize: 20 }}>💬</span>
             <span style={{ fontWeight: 700 }}>{localComments.length}</span>
          </div>
        </div>

        {/* Comment Section */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Comments</h3>
          {localComments.map((c, i) => (
            <div key={i} style={{ marginBottom: 12, padding: 12, background: '#f9fafb', borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>{c.user?.name}</div>
              <div style={{ fontSize: 14 }}>{c.content}</div>
            </div>
          ))}

          {/* Add Comment */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <input 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..." 
              style={{ flex: 1, padding: '10px 16px', borderRadius: 50, border: '2px solid #eee', fontSize: 14 }}
            />
            <button onClick={onComment} style={{ padding: '10px 20px', borderRadius: 50, background: 'black', color: 'white', fontWeight: 700 }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
