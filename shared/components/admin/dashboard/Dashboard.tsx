'use client';

import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem, Container, Flex } from '@mantine/core';
import { IconHome2, IconGauge, IconUser, IconSettings } from '@tabler/icons-react';
import { Roles } from './DashboardNavigation/Roles';
import { Users } from './DashboardNavigation/Users';
import { Settings } from './DashboardNavigation/Settings';
import styles from './Dashboard.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps): JSX.Element {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={styles.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Anasayfa' },
  { icon: IconUser, label: 'Kullanıcılar' },
  { icon: IconGauge, label: 'Roller' },
  { icon: IconSettings, label: 'Site Ayarları' },
];

export function Dashboard() {
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <Flex mt="lg" mx="none">
      <nav className={styles.navbar}>
        <div className={styles.navbarMain}>
          <Stack justify="center" gap="xs">
            {links}
          </Stack>
        </div>
      </nav>
      {active === 0 && (
        <Container fluid py="none" px="sm">
          <h1>Yönetim Paneli</h1>
        </Container>
      )}
      {active === 1 && <Users />}
      {active === 2 && <Roles />}
      {active === 3 && <Settings />}
    </Flex>
  );
}
