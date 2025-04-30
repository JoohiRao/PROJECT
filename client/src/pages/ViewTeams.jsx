import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [error, setError] = useState('');

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (minSize) params.minSize = minSize;
      if (maxSize) params.maxSize = maxSize;

      const res = await axios.get('/api/team/view-teams', { params });
      setTeams(res.data.teams);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []); // Load on first mount

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Team Directory</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by team name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Min size"
          value={minSize}
          onChange={(e) => setMinSize(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Max size"
          value={maxSize}
          onChange={(e) => setMaxSize(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={fetchTeams}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">{team.name}</h3>
              <p><strong>Members:</strong></p>
              <ul className="list-disc list-inside">
                {team.members.map((member) => (
                  <li key={member._id}>
                    {member.name} ({member.email})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewTeams;
