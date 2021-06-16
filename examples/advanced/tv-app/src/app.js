import { useState } from 'react';
import { FocusNode } from '@please/lrud';
import './app.css';
import Profiles from './profiles/profiles';

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const hasSelectedProfile = Boolean(selectedProfile);

  console.log('hi', selectedProfile);

  return (
    <FocusNode className="app">
      {!hasSelectedProfile && (
        <Profiles setSelectedProfile={setSelectedProfile} />
      )}
      {hasSelectedProfile && <div>You have chosen {selectedProfile.name}</div>}
    </FocusNode>
  );
}
