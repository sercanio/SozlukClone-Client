import { Container, Paper, Text } from '@mantine/core';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let author = null;
  const data = await fetch(`http://localhost:60805/api/Authors/GetByUserName?UserName=${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (data.ok && data.status === 200) {
    author = await data.json();
  }
  return (
    <Container size="lg" px="lg" component="main">
      <Paper shadow="xs" p="xs" withBorder>
        <Text>Paper is the most basic ui component</Text>
        {author && (
          <>
            <Text>Username: {author.userName}</Text>
            <Text>Role: {author.authorGroupId}</Text>
          </>
        )}
        {!author && <Text>author not found</Text>}
      </Paper>
    </Container>
  );
}
