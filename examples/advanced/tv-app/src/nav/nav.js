import { FocusNode, useSetFocus, useFocusNodeById } from '@please/lrud';
import classnames from 'classnames';
import './nav.css';

const navItems = [
  {
    label: 'Search',
  },
  {
    label: 'Home',
    isCurrentPage: true,
  },
  {
    label: 'Favorites',
  },
  {
    label: 'Settings',
  },
];

export default function Nav({ selectedProfile }) {
  const setFocus = useSetFocus();
  const navNode = useFocusNodeById('nav');

  return (
    <>
      <FocusNode
        isTrap
        orientation="vertical"
        className="nav"
        focusId="nav"
        onRight={(e) => {
          e.preventDefault();
          setFocus('home');
        }}>
        <div className="nav_list">
          {navItems.map((navItem, index) => {
            return (
              <FocusNode
                className={classnames('nav_link', {
                  'nav_link-isCurrentPage': navItem.isCurrentPage,
                })}
                key={index}
                focusId={`nav${navItem.label}`}>
                <span className="nav_linkContents">{navItem.label}</span>
              </FocusNode>
            );
          })}
        </div>
      </FocusNode>
      <div
        className={classnames('nav_shim', {
          'nav_shim-isVisible': navNode?.isFocused,
        })}
      />
    </>
  );
}
