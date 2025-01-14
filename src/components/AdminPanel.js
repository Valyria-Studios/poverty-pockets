import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminPanel = () => {
  const [censusTracts, setCensusTracts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCensusTracts = async () => {
      const { data, error } = await supabase.from('census_tracts').select('*');
      if (error) {
        setError(error.message);
      } else {
        setCensusTracts(data);
      }
    };
    fetchCensusTracts();
  }, []);

  const updateAdoptionStatus = async (id, status) => {
    const { error } = await supabase
      .from('census_tracts')
      .update({ adoption_status: status })
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setCensusTracts((prev) =>
        prev.map((tract) =>
          tract.id === id ? { ...tract, adoption_status: status } : tract
        )
      );
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {censusTracts.map((tract) => (
          <li key={tract.id}>
            {tract.name} - {tract.adoption_status}
            <button onClick={() => updateAdoptionStatus(tract.id, 'adopted')}>
              Mark Adopted
            </button>
            <button
              onClick={() => updateAdoptionStatus(tract.id, 'not adopted')}
            >
              Mark Not Adopted
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
