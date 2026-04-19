import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [skillName, setSkillName] = useState('');
  const [skillType, setSkillType] = useState('teach');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchSkills();
    fetchMatches();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/skills/my-skills', {
        headers: { authorization: token }
      });
      setSkills(res.data.skills);
    } catch (err) {
      console.error('Failed to fetch skills');
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/matches/find', {
        headers: { authorization: token }
      });
      setMatches(res.data.matches);
    } catch (err) {
      console.error('Failed to fetch matches');
    }
  };

  const addSkill = async () => {
    if (!skillName) return;
    try {
      await axios.post(
        'http://localhost:5000/api/skills/add',
        { skill_name: skillName, type: skillType },
        { headers: { authorization: token } }
      );
      setSkillName('');
      fetchSkills();
    } catch (err) {
      console.error('Failed to add skill');
    }
  };

  const sendRequest = async (user2_id) => {
    try {
      await axios.post(
        'http://localhost:5000/api/matches/request',
        { user2_id },
        { headers: { authorization: token } }
      );
      alert('Swap request sent! 🎉');
    } catch (err) {
      alert('Request already sent or failed!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>🔄 SkillSwap</h1>
        <div style={styles.headerRight}>
          <span style={styles.welcomeText}>
            Welcome, {user?.name}! 👋
          </span>
            <button style={styles.navBtn} onClick={() => navigate('/requests')}>
                📩 Requests
            </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Add Skill Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 Add Your Skills</h2>
          <div style={styles.row}>
            <input
              style={styles.input}
              type="text"
              placeholder="Skill name (e.g. Java, UI Design)"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
            <select
              style={styles.select}
              value={skillType}
              onChange={(e) => setSkillType(e.target.value)}
            >
              <option value="teach">I can Teach</option>
              <option value="learn">I want to Learn</option>
            </select>
            <button style={styles.addBtn} onClick={addSkill}>
              Add
            </button>
          </div>

          {/* Skills List */}
          <div style={styles.skillsList}>
            {skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  ...styles.skillBadge,
                  backgroundColor: skill.type === 'teach' ? '#4f46e5' : '#10b981'
                }}
              >
                {skill.type === 'teach' ? '📚 Teach: ' : '🎓 Learn: '}
                {skill.skill_name}
              </span>
            ))}
          </div>
        </div>

        {/* Matches Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🤝 Your Matches</h2>
          {matches.length === 0 ? (
            <p style={styles.noMatch}>
              No matches found yet! Add more skills to find matches! 😊
            </p>
          ) : (
            matches.map((match, index) => (
              <div key={index} style={styles.matchCard}>
                <div>
                  <h3 style={styles.matchName}>{match.name}</h3>
                  <p style={styles.matchSkill}>
                    🎓 They teach: <strong>{match.they_teach}</strong>
                  </p>
                  <p style={styles.matchSkill}>
                    📚 They want to learn: <strong>{match.they_learn}</strong>
                  </p>
                </div>
                <button
                  style={styles.requestBtn}
                  onClick={() => sendRequest(match.id)}
                >
                  Send Swap Request
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8'
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: 'white',
    margin: 0
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  welcomeText: {
    color: 'white',
    fontSize: '16px'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  content: {
    padding: '30px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '25px'
  },
  cardTitle: {
    color: '#333',
    marginBottom: '20px'
  },
  row: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  skillBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px'
  },
  noMatch: {
    color: '#888',
    textAlign: 'center'
  },
  matchCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '10px'
  },
  matchName: {
    margin: '0 0 5px 0',
    color: '#333'
  },
  matchSkill: {
    margin: '3px 0',
    color: '#666'
  },
requestBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  navBtn: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
};

export default Dashboard;