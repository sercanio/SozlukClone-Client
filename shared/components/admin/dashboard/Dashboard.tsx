'use client';

import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem, Container, Flex } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
} from '@tabler/icons-react';
import classes from './Dashboard.module.css';
import { Roles } from './DashboardNavigation/Roles';
import { Users } from './DashboardNavigation/Users';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Anasayfa' },
  { icon: IconUser, label: 'Kullanıcılar' },
  { icon: IconGauge, label: 'Roller' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analizler' },
  { icon: IconFingerprint, label: 'Güvenlik' },
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
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Stack justify="center" gap="xs">
            {links}
          </Stack>
        </div>
      </nav>
      {active === 0 && (
        <Container fluid py="none" px="sm">
          <h1>Dashboard</h1>
          <p>Welcome to the dashboard</p>
        </Container>
      )}
      {active === 1 && <Users />}
      {active === 2 && <Roles />}
    </Flex>
  );
}
