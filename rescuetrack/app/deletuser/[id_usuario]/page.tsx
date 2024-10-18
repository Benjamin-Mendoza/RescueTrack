async function deleteUsuario(id_usuario: number) {
  const res = await fetch(`http://localhost:8081/deleteuser/${id_usuario}`, {
    method: 'DELETE',
  });

  if (!res.ok) {

  }
  return res.json();
}


