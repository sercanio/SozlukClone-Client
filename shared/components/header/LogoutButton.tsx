'use client';

import React from 'react';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import styles from './header.module.css';

export default function LogoutButton(): JSX.Element {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={() => signOut()} className={(styles.link, styles.signoutlink)}>
      <IconLogout size={16} />
      <span>çıkış</span>
    </div>
  );
}
