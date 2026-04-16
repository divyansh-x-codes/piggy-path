import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BottomNav, Topbar } from '../components/Shared';
import { STOCKS } from '../data/mockData';
import { Line } from 'react-chartjs-2';

const Stocks = () => {
  const navigate = useNavigate();
  const { getPrice, getChange, getPriceHistory } = useAppContext();

  const renderSparkline = (id) => {
    const history = getPriceHistory(id, '6m').slice(-20);
    const isUp = history[history.length - 1] >= history[0];
    const chartColor = isUp ? '#22C55E' : '#EF4444';

    const data = {
      labels: history.map(() => ''),
      datasets: [{
        data: history,
        borderColor: chartColor,
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      animation: { duration: 0 }
    };

    return (
      <div style={{ width: 60, height: 30, marginLeft: 10 }}>
        <Line data={data} options={options} />
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      <Topbar title="Markets" />

      <div style={{ padding: '12px 16px' }}>
        <div style={{ background: '#f5f5f7', borderRadius: 50, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ color: '#9ca3af', fontSize: 16 }}>🔍</span>
          <span style={{ color: '#9ca3af', fontSize: 14 }}>Search stocks...</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 80px' }}>
        {STOCKS.map(s => {
          const price = getPrice(s);
          const chg = getChange(s);
          const isUp = chg >= 0;

          return (
            <div key={s.id} onClick={() => navigate(`/stock/${s.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: (s.color || '#6D28D9') + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: s.color || '#6D28D9', border: '1px solid #f3f4f6' }}>
                {s.logo || s.id.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>{s.ticker} • {s.sector}</div>
              </div>

              {renderSparkline(s.id)}

              <div style={{ textAlign: 'right', minWidth: 80 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#111' }}>₹ {price.toLocaleString()}</div>
                <div className={`tag ${isUp ? 'tag-green' : 'tag-red'}`}>
                  {isUp ? '▲ +' : '▼ '}{Math.abs(chg).toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav active="stocks" />
    </div>
  );
};

export default Stocks;
