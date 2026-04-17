import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BottomNav } from '../components/Shared';

const News = () => {
  const navigate = useNavigate();
  const { articles, isAdmin, deleteArticle } = useAppContext();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 20px 16px', zIndex: 10 }}>
        <div onClick={() => navigate(-1)} style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>

        <div style={{ flex: 1, height: 42, borderRadius: 24, border: '2px solid black', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, background: 'white' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Search your news</span>
        </div>

        <div style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="black"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {articles.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>No reports published yet.</p>
            <p style={{ fontSize: 11 }}>Please wait for admin updates.</p>
          </div>
        ) : (
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 16 }}>
              <span className="section-title">Latest Reports</span>
              <span className="view-all" style={{ opacity: 0.5 }}>Realtime</span>
            </div>

            {articles.map(n => (
              <div key={n.id} className="card" style={{ marginBottom: 16, position: 'relative' }}>
                {isAdmin && (
                  <div 
                    onClick={() => deleteArticle(n.id)}
                    style={{ position: 'absolute', top: 12, right: 12, padding: 8, cursor: 'pointer', opacity: 0.4 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 40, height: 40, background: 'var(--purple-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: 'var(--purple)' }}>{n.stock[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{n.stock}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{n.ticker}</div>
                    </div>
                  </div>
                  <span className={`tag ${n.cat === 'Breaking' ? 'tag-red' : 'tag-green'}`}>{n.cat}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#111827' }}>{n.title}</p>
                <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>{n.body}</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>{(n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleDateString() : 'Just Now')}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>by {n.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="news" />
    </div>
  );
};

export default News;
