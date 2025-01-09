import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [pockets, setPockets] = useState([]);
  const [selectedPocket, setSelectedPocket] = useState(null);

  useEffect(() => {
    // Fetch pockets from the server
    fetch('/api/get-pockets')
      .then((response) => response.json())
      .then((data) => setPockets(data))
      .catch((error) => console.error('Error fetching pockets:', error));
  }, []);

  const updatePocket = (id, adoptedStatus) => {
    const lastUpdatedBy = 'Admin'; // Replace with dynamic admin data if applicable
    const lastUpdateDate = new Date().toISOString();

    fetch('/api/update-pocket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, adoptedStatus, lastUpdatedBy, lastUpdateDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update state to reflect changes
        setPockets((prevPockets) =>
          prevPockets.map((pocket) =>
            pocket.id === id
              ? { ...pocket, adoptedStatus, lastUpdatedBy, lastUpdateDate }
              : pocket
          )
        );
        alert('Pocket updated successfully!');
      })
      .catch((error) => console.error('Error updating pocket:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Adopted Status</th>
            <th>Last Updated By</th>
            <th>Last Update Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pockets.map((pocket) => (
            <tr key={pocket.id}>
              <td>{pocket.id}</td>
              <td>{pocket.adoptedStatus ? 'Adopted' : 'Not Adopted'}</td>
              <td>{pocket.lastUpdatedBy}</td>
              <td>{pocket.lastUpdateDate}</td>
              <td>
                <button
                  onClick={() =>
                    updatePocket(
                      pocket.id,
                      !pocket.adoptedStatus
                    )
                  }
                >
                  {pocket.adoptedStatus ? 'Mark as Not Adopted' : 'Mark as Adopted'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
