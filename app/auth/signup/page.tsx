// create a signin page

import React from 'react';
import { AuthForm } from '@components/Auth/AuthForm';
import styles from '../page.module.css';

export const metadata = {
  title: 'Sign Up',
  description: 'Sign up to the app',
};

export default function Page() {
  return (
    <main className={styles.main}>
      <AuthForm className={styles['mantine-Paper-root']} />
    </main>
  );
}
