import React, { useState } from 'react';
import Auth from './components/Auth';
import AdminPanel from './components/AdminPanel';
import ArcGISMap from './components/ArcGISMap';

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  return (
    <div>
      {adminLoggedIn ? (
        <AdminPanel />
      ) : (
        <>
          <ArcGISMap />
          <Auth setAdminLoggedIn={setAdminLoggedIn} />
        </>
      )}
    </div>
  );
}

export default App;
