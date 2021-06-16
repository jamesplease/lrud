import './profiles.css';
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
    <FocusNode orientation="horizontal" className="profiles">
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
