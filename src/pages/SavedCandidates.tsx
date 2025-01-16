import React, { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API'; // Import your GitHub API functions

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<any[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved candidates from localStorage when the component mounts
  useEffect(() => {
    const storedCandidates = localStorage.getItem('savedCandidates');
    if (storedCandidates) {
      setSavedCandidates(JSON.parse(storedCandidates));
    }
  }, []);

  // Save the candidates to localStorage whenever the list changes
  useEffect(() => {
    if (savedCandidates.length > 0) {
      localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    }
  }, [savedCandidates]);

  // Function to save a candidate to the list
  const saveCandidate = (candidate: any) => {
    setSavedCandidates((prev) => [...prev, candidate]);
  };

  // Function to fetch a random user from GitHub
  const fetchRandomUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchGithub(); // Fetches users from your API
      if (data.length > 0) {
        // For simplicity, choose the first user and fetch their details
        const user = data[0]; // Get the first user from the list
        const userData = await searchGithubUser(user.login); // Fetch detailed user data
        setUserDetails(userData);
      } else {
        setError('No users found.');
      }
    } catch (err) {
      setError('Failed to fetch random user.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch user details based on username search
  const fetchUserByUsername = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!userQuery.trim()) {
        setError('Please enter a GitHub username.');
        setIsLoading(false);
        return;
      }
      const data = await searchGithubUser(userQuery.trim());
      setUserDetails(data);
    } catch (err) {
      setError('Failed to fetch user details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Potential Candidates</h1>
      <div>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <button onClick={fetchUserByUsername} disabled={isLoading}>
          Fetch User
        </button>
        <button onClick={fetchRandomUser} disabled={isLoading}>
          Fetch Random User
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userDetails && (
        <div>
          <h2>User Details</h2>
          <p><strong>Username:</strong> {userDetails.login}</p>
          <p>
            <strong>GitHub Profile:</strong>{' '}
            <a href={userDetails.html_url} target="_blank" rel="noopener noreferrer">
              {userDetails.html_url}
            </a>
          </p>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <img src={userDetails.avatar_url} alt={`${userDetails.login}'s avatar`} width="100" />
          <button onClick={() => saveCandidate(userDetails)}>Save Candidate</button>
        </div>
      )}

      <div>
        <h2>Saved Candidates</h2>
        {savedCandidates.length === 0 ? (
          <p>No saved candidates yet.</p>
        ) : (
          <ul>
            {savedCandidates.map((candidate, index) => (
              <li key={index}>
                <p><strong>Username:</strong> {candidate.login}</p>
                <p>
                  <strong>Profile:</strong>{' '}
                  <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                    {candidate.html_url}
                  </a>
                </p>
                <img src={candidate.avatar_url} alt={`${candidate.login}'s avatar`} width="50" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SavedCandidates;
