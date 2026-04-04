insert into public.usuarios (
  nome,
  email,
  senha_hash,
  ativo
)
values (
  'Administrador',
  'admin@laudoparts.com',
  'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7',
  true
)
on conflict (email)
do update set
  nome = excluded.nome,
  senha_hash = excluded.senha_hash,
  ativo = excluded.ativo;
