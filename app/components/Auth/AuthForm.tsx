'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
} from '@mantine/core';
import AuthService from '@services/authService/authService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';

export function AuthForm(props: PaperProps) {
  const pathName = usePathname();
  const [type, toggle] = useToggle(['login', 'register']);
  const session = useSession();
  const authService = new AuthService(session!);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  useEffect(() => {
    pathName === '/auth/signup' || type === 'register' ? toggle('register') : toggle('login');
  }, [pathName, type, toggle]);

  const form = useForm({
    initialValues: {
      email: '',
      userName: '',
      password: '',
    },

    validate: {
      email: (val: any) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: any) =>
        val.length <= 6 ? 'Password should include at least 6 characters' : null,
    },
  });

  const handleSubmit = async () => {
    if (type === 'register') {
      try {
        const requestData = {
          userName: form.values.userName,
          email: form.values.email,
          password: form.values.password,
          biography: 'string',
          profilePictureUrl: 'string',
          coverPictureUrl: 'string',
          age: 0,
          gender: 1,
        };
        showSpinnerOverlay();
        await authService.register(requestData);
        toggle();
        hideSpinnerOverlay();
      } catch (error: any) {
        showNotification({ title: 'Başarısız', message: error.message, variant: 'error' });
        hideSpinnerOverlay();
      }
    } else {
      showSpinnerOverlay();
      await signIn('credentials', {
        email: form.values.email,
        password: form.values.password,
        callbackUrl: `${window.location.origin}/`,
      });
      hideSpinnerOverlay();
    }
  };

  return (
    <Paper radius="none" p="xl" withBorder {...props}>
      <Text size="xl" fw={700} mb="lg">
        {upperFirst(type)}
      </Text>

      <form onSubmit={form.onSubmit(() => handleSubmit())}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Username"
              placeholder="Pick a username"
              value={form.values.userName}
              onChange={(event) => form.setFieldValue('userName', event.currentTarget.value)}
              radius="none"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="none"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="none"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="none">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
