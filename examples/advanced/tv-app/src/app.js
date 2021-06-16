import { useState } from 'react';
import { FocusNode } from '@please/lrud';
import { motion, AnimatePresence } from 'framer-motion';
import './app.css';
import Profiles from './profiles/profiles';

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const hasSelectedProfile = Boolean(selectedProfile);

  return (
    <FocusNode className="app">
      <AnimatePresence>
        {!hasSelectedProfile && (
          <Profiles setSelectedProfile={setSelectedProfile} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasSelectedProfile && (
          <FocusNode
            elementType={motion.div}
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 1.15,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
            }}
            className="home_placeholder">
            You have chosen {selectedProfile.name}
          </FocusNode>
        )}
      </AnimatePresence>
    </FocusNode>
  );
}
