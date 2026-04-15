import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { BottomNav } from '../components/Shared';

const Community = () => {
  const { goScreen, posts, fetchPosts, handleLike, currentUser } = useAppContext();

  useEffect(() => {
    const unsub = fetchPosts();
    return () => unsub && typeof unsub === 'function' && unsub();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 20px 16px', zIndex: 10 }}>
        <div onClick={() => goScreen('home')} style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        
        <div style={{ flex: 1, height: 42, borderRadius: 24, border: '2px solid black', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, background: 'white' }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
           <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Search community</span>
        </div>

        <div style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="black"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, padding: '0 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'black', marginBottom: 20 }}>Community Feed</h1>

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: 24, border: '2px solid black' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>The community is quiet...</div>
            <p style={{ fontSize: 13, opacity: 0.6, marginTop: 8 }}>Check back soon for verified market insights and member updates.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ border: '2px solid black', borderRadius: 24, padding: '20px', background: 'white', marginBottom: 20, boxShadow: '4px 4px 0px black' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black', overflow: 'hidden' }}>
                  {post.authorPhoto ? <img src={post.authorPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontWeight: 800 }}>{post.author?.name?.slice(0,1) || 'P'}</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{post.author?.name || 'Verified Author'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#6D28D9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{new Date(post.createdAt?.toMillis()).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 600, color: '#1F2937', marginBottom: 16 }}>
                {post.content}
              </div>

              {post.imageUrl && (
                <div style={{ width: '100%', borderRadius: 16, overflow: 'hidden', border: '2px solid black', marginBottom: 16 }}>
                  <img src={post.imageUrl} style={{ width: '100%', display: 'block' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: 20, borderTop: '1px solid #EEE', paddingTop: 12 }}>
                <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={post.likes?.includes(currentUser?.uid) ? "#ef4444" : "none"} stroke={post.likes?.includes(currentUser?.uid) ? "#ef4444" : "black"} strokeWidth="2.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{post.likesCount || 0}</span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{post.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav active="community" />
    </div>
  );
};

export default Community;
