import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient'; // Default export doesn't need curly braces

const AdminPanel = ({ user }) => {
  const [censusTracts, setCensusTracts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all census tracts on load
    const fetchCensusTracts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('census_tracts').select('*');
      if (error) {
        setError(error.message);
      } else {
        setCensusTracts(data);
      }
      setLoading(false);
    };
    fetchCensusTracts();
  }, []);

  const updateAdoptionStatus = async (id, status) => {
    setLoading(true);
    const { error } = await supabase
      .from('census_tracts')
      .update({
        adoption_status: status,
        last_updated_by: user, // Assuming `user` is passed as a prop with admin name
        last_update_date: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setCensusTracts((prev) =>
        prev.map((tract) =>
          tract.id === id
            ? {
                ...tract,
                adoption_status: status,
                last_updated_by: user,
                last_update_date: new Date().toISOString(),
              }
            : tract
        )
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
      <h2>Admin Panel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tract Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Adoption Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Updated By</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Update Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {censusTracts.map((tract) => (
              <tr key={tract.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{tract.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{tract.adoption_status}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{tract.last_updated_by || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {tract.last_update_date
                    ? new Date(tract.last_update_date).toLocaleString()
                    : 'N/A'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => updateAdoptionStatus(tract.id, 'adopted')}
                    style={{
                      marginRight: '5px',
                      padding: '5px 10px',
                      backgroundColor: 'green',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                    }}
                  >
                    Mark Adopted
                  </button>
                  <button
                    onClick={() => updateAdoptionStatus(tract.id, 'not adopted')}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                    }}
                  >
                    Mark Not Adopted
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
