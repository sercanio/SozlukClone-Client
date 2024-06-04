export default function updateAuthorById(author: any, session: any) {
  return fetch('http://localhost:60805/api/Authors', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify(author),
  });
}
