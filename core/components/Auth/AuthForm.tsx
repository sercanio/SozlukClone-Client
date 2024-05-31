'use client';

import { useEffect } from 'react';
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
  // Divider,
  // Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
// import { GoogleButton } from '../Button/OTP/GoogleButton';
// import { TwitterButton } from '../Button/OTP/TwitterButton';

export function AuthForm(props: PaperProps) {
  const pathName = usePathname();
  const [type, toggle] = useToggle(['login', 'register']);

  useEffect(() => {
    pathName === '/auth/signup' || type === 'register' ? toggle('register') : toggle('login');
  }, []);

  const form = useForm({
    initialValues: {
      email: '',
      userName: '',
      password: '',
      // terms: true,
    },

    validate: {
      email: (val: any) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: any) =>
        val.length <= 6 ? 'Password should include at least 6 characters' : null,
    },
  });

  const handleSubmit = async () => {
    if (type === 'register') {
      const res = await fetch('http://localhost:60805/api/Authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userName: form.values.userName,
          email: form.values.email,
          password: form.values.password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.userId) {
        toggle();
      }
    } else {
      await signIn('credentials', {
        email: form.values.email,
        password: form.values.password,
        callbackUrl: `${window.location.origin}/`,
      });
    }
  };

  return (
    <Paper radius="none" p="xl" withBorder {...props}>
      <Text size="xl" fw={700} mb="lg">
        {upperFirst(type)}
      </Text>

      {/* OTP Authentication */}

      {/* <Text size="lg" fw={500}>
        Welcome to Mantine, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="none">Google</GoogleButton>
        <TwitterButton radius="none">Twitter</TwitterButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" /> */}

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

          {/* {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )} */}
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
