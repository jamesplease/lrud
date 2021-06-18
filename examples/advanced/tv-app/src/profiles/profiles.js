import './profiles.css';
import { motion } from 'framer-motion';
import { FocusNode } from '@please/lrud';
import Profile from './profile';

const profiles = [
  {
    name: 'Ryane',
    color: 'rgb(230, 97, 35)',
  },
  {
    name: 'Javi',
    color: 'rgb(42, 100, 167)',
  },
  {
    name: 'Priya',
    color: 'rgb(214, 30, 107)',
  },
];

export default function Profiles({ setSelectedProfile }) {
  return (
    <FocusNode
      elementType={motion.div}
      orientation="horizontal"
      className="profiles page"
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
      }}>
      <div className="profiles_title">Choose your profile</div>
      <div className="profiles_profileList">
        {profiles.map((profile, index) => {
          return (
            <Profile
              key={index}
              setSelectedProfile={setSelectedProfile}
              profile={profile}
            />
          );
        })}
      </div>
    </FocusNode>
  );
}
