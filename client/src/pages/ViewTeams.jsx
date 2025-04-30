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

      const res = await axios.get('http://localhost:5000/api/team/view-teams', {
        params,
        withCredentials: true,
      });

      setTeams(res.data.teams || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">👥 Team Directory</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by team name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <input
          type="number"
          placeholder="Min size"
          value={minSize}
          onChange={(e) => setMinSize(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/6"
        />
        <input
          type="number"
          placeholder="Max size"
          value={maxSize}
          onChange={(e) => setMaxSize(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/6"
        />
        <button
          onClick={fetchTeams}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center">⏳ Loading teams...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : teams.length === 0 ? (
        <p className="text-center text-gray-500">No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team._id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-bold mb-2">{team.name}</h3>
              <p className="font-semibold">Members:</p>
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
