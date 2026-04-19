import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      navigate('/');
    } catch (err) {
      setError('Registration failed! Email may already exist.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔄 SkillSwap</h1>
        <h2 style={styles.subtitle}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">
            Register
          </button>
        </form>
        <p style={styles.link}>
          Already have an account?{' '}
          <span
            style={styles.linkText}
            onClick={() => navigate('/')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '380px'
  },
  title: {
    textAlign: 'center',
    color: '#4f46e5',
    marginBottom: '5px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    textAlign: 'center'
  },
  link: {
    textAlign: 'center',
    marginTop: '15px'
  },
  linkText: {
    color: '#4f46e5',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Register;