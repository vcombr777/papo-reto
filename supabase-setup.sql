-- Cole isso no "SQL Editor" do seu projeto Supabase (botão no menu lateral) e clique em RUN.
-- Isso cria a tabela onde os usos do app ficam registrados, pra você acompanhar.

create table if not exists events (
  id bigint generated always as identity primary key,
  user_id text not null,
  user_name text,
  event_type text not null, -- 'perfil_criado' | 'mensagem_enviada' | 'foto_analisada' | 'agua_registrada'
  payload jsonb,
  created_at timestamptz default now()
);

-- Segurança: qualquer pessoa usando o app pode REGISTRAR um evento (insert),
-- mas ninguém consegue LER os dados de fora — só você, logado no painel do Supabase.
alter table events enable row level security;

create policy "permitir insercao publica"
  on events for insert
  to anon
  with check (true);

-- (Não criamos política de SELECT de propósito — assim só você, dono do projeto
-- Supabase, consegue ver os dados pela aba "Table Editor".)
