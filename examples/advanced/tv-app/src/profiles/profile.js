import { FocusNode } from '@please/lrud';
import './profile.css';

export default function Profile({ profile, setSelectedProfile }) {
  return (
    <FocusNode
      className="profile"
      style={{
        '--color': profile.color,
      }}
      onSelected={() => setSelectedProfile(profile)}>
      <div className="profile_icon"></div>
      <div className="profile_username">{profile.name}</div>
    </FocusNode>
  );
}
