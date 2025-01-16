import { useState, useEffect } from 'react';
import { searchGithub } from '../api/API';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>(''); 

  
  useEffect(() => {
    const fetchCandidates = async () => {
      const data = await searchGithub();
      setCandidates(data);
      setFilteredCandidates(data);
    };
    fetchCandidates();
  }, []);

  //Filter candidates 
  useEffect(() => {
    if (filter === '') {
      setFilteredCandidates(candidates)
    } else {
      setFilteredCandidates(
        candidates.filter((candidate) =>
          candidate.login.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, candidates]);

  return (
    <div>
      <h1>Potential Candidates</h1>
      <input
        type="text"
        placeholder="Filter by username"
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Update the filter state
        style={{ marginBottom: '10px' }}
      />
      <div>
        {filteredCandidates.length === 0 ? (
          <p>No candidates found</p>
        ) : (
          <ul>
            {filteredCandidates.map((candidate) => (
              <li key={candidate.id}>
                <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                  {candidate.login}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CandidateSearch;



