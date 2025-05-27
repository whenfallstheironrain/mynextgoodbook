
import React, { useState } from 'react';
import axios from 'axios';
function App() {
  const [bookList, setBookList] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setRecommendations([]);
    setError('');

    if (!bookList || bookList.trim().length < 5) {
      setError('Please paste a longer list of books.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://mynextgoodbook-backend.onrender.com/analyze', {
  books: bookList,
});

      const rawOutput = response.data.recommendations;
      const lines = rawOutput.split('\n').filter((line) => line.startsWith('•'));
      const parsed = lines.map((line) => line.replace(/^•\s*/, '').trim());

      setRecommendations(parsed);
    } catch (err) {
      console.error('Frontend error:', err);
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="App" style={{ fontFamily: 'sans-serif', padding: 40, maxWidth: 800, margin: 'auto' }}>
      <h1>📚 My Next Good Book</h1>
      <p>Paste your Kindle, Libby, or Goodreads book list below:</p>

      <textarea
        value={bookList}
        onChange={(e) => setBookList(e.target.value)}
        placeholder="The Martian by Andy Weir\nDark Matter by Blake Crouch\nRed Rising by Pierce Brown..."
        style={{
          width: '100%',
          height: 180,
          padding: 10,
          fontSize: 16,
          marginTop: 10,
          marginBottom: 20,
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: 16,
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze My Books'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: 20 }}>{error}</div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginTop: 40, textAlign: 'left' }}>
          <h2>🔍 Recommended for You</h2>
          <ul style={{ paddingLeft: 20 }}>
            {recommendations.map((book, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                {book}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;