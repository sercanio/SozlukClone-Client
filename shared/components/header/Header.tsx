import Link from 'next/link';
import { Menu, Group, Center, Container, Button } from '@mantine/core';
import { IconChevronDown, IconLayoutDashboard, IconLogout, IconUser } from '@tabler/icons-react';
import { getServerSession } from 'next-auth';
import BurgerMenu from './BurgerMenu/BurgerMenu';
import styles from './header.module.css';
import './override.css';
import { options } from '@/app/api/auth/[...nextauth]/options';

export async function HeaderMenu() {
  const session = await getServerSession(options);
  const links = [
    { link: '/auth/signin', label: 'giriş yap', type: 'link' },
    { link: '/auth/signup', label: 'kayıt ol', type: 'link' },
  ];

  const authLinks = [
    {
      link: `/biri/${session?.user?.name}`,
      label: 'ben',
      type: 'link',
      icon: <IconUser size={16} />,
    },
    {
      link: '/api/auth/signout',
      label: 'çıkış',
      type: 'button',
      // onclick: () => logout(),
      icon: <IconLogout size={16} />,
    },
  ];

  const developerLinks = [
    {
      link: '/yonetim/panel',
      label: 'panel',
      type: 'link',
      icon: <IconLayoutDashboard size={16} />,
    },
  ];

  const menuItems = (items: any) =>
    items.map((link: any) => {
      const subMenuItems = link.links?.map((item: any) => (
        <Menu.Item key={item.label}>{item.label}</Menu.Item>
      ));

      // if (subMenuItems) {
      //   return (
      //     <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
      //       <Menu.Target>
      //         <Link
      //           key={link.label}
      //           href={link.link}
      //           className={styles.link}
      //           onClick={(event) => event.preventDefault()}
      //         >
      //           <Center>
      //             <span className={styles.linkLabel}>{link.label}</span>
      //             <IconChevronDown size="0.9rem" stroke={1.5} />
      //           </Center>
      //         </Link>
      //       </Menu.Target>
      //       <Menu.Dropdown>{subMenuItems}</Menu.Dropdown>
      //     </Menu>
      //   );
      // }

      return link.type === 'link' ? (
        <div className={styles['link-container']}>
          <Button
            key={link.label}
            leftSection={link.icon}
            component={Link}
            href={link.link}
            className={styles.link}
          >
            {link.label}
          </Button>
        </div>
      ) : (
        <Button
          key={link.label}
          leftSection={link.icon}
          component="a"
          onClick={link.onclick}
          className={styles.link}
        >
          {link.label}
        </Button>
      );
    });

  const items = session?.user ? menuItems(authLinks) : menuItems(links);
  const adminIems = session?.user?.groupId === 1 ? menuItems(developerLinks) : null;
  return (
    <Container component="header" size="lg" className={styles.header}>
      <div className={styles.inner}>
        <Button
          key="asdasdasd"
          component={Link}
          href="/"
          // onClick={link.onclick}
          className={styles.link}
        >
          SozlukClone
        </Button>
        <Group gap={5} visibleFrom="sm">
          {adminIems}
          {items}
        </Group>
        <BurgerMenu />
      </div>
    </Container>
  );
}
