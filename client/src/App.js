import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:3000';
const toastStyle = { style: { background: '#1a1a2e', color: '#fff', border: '1px solid #2a2a4e' } };

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('shorten');

  const handleShorten = async () => {
    if (!url) return toast.error('Please enter a URL');
    setLoading(true);
    try {
      const res = await axios.post(API + '/api/urls/shorten', { original_url: url });
      setShortUrl(res.data.short_url);
      setShortCode(res.data.short_code);
      setUrl('');
      toast.success('URL shortened!');
    } catch (err) {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const fetchUrls = async () => {
    setActiveTab('history');
    try {
      const res = await axios.get(API + '/api/urls');
      setUrls(res.data);
    } catch (err) {
      toast.error('Could not fetch URLs');
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className='app'>
      <div className='bg'>
        <div className='orb orb1'></div>
        <div className='orb orb2'></div>
        <div className='orb orb3'></div>
      </div>
      <Toaster position='top-right' toastOptions={toastStyle} />
      <div className='hero'>
        <div className='badge'><span className='dot'></span> Live and ready</div>
        <h1>Short<span>Linx</span></h1>
        <p>Shorten, share and track your links in seconds</p>
      </div>
      <div className='tabs'>
        <button className={activeTab === 'shorten' ? 'tab active' : 'tab'} onClick={() => setActiveTab('shorten')}>Shorten</button>
        <button className={activeTab === 'history' ? 'tab active' : 'tab'} onClick={fetchUrls}>History</button>
      </div>
      {activeTab === 'shorten' && (
        <div className='card'>
          <div className='input-group'>
            <input type='text' placeholder='Paste your long URL here...' value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleShorten()} />
            <button onClick={handleShorten} disabled={loading}>{loading ? 'Shortening...' : 'Shorten'}</button>
          </div>
          {shortUrl && (
            <div className='result'>
              <div>
                <p>{'shortlinx.app/' + shortCode}</p>
                <div className='result-sub'>Ready to share</div>
              </div>
              <div className='short-url-box'>
                <a href={shortUrl} target='_blank' rel='noreferrer'>{shortUrl}</a>
                <button onClick={() => copy(shortUrl)}>Copy</button>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === 'history' && (
        <div className='card'>
          <div className='section-header'>
            <span className='section-title'>Your links</span>
            <span className='section-sub'>All time</span>
          </div>
          {urls.length === 0 ? (
            <p className='empty'>No links yet. Shorten one first!</p>
          ) : (
            <div className='url-list'>
              {urls.map((u) => (
                <div key={u.id} className='url-item'>
                  <div className='url-info'>
                    <a href={'http://localhost:3000/' + u.short_code} target='_blank' rel='noreferrer' className='short'>
                      {'localhost:3000/' + u.short_code}
                    </a>
                    <span className='original'>{u.original_url}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span className='clicks-badge'>0 clicks</span>
                    <button onClick={() => copy('http://localhost:3000/' + u.short_code)}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className='footer'>Built with Node.js + Redis + SQLite</div>
    </div>
  );
}

export default App;