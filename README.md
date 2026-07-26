# Papo Reto — guia de publicação (sem precisar programar)

Você vai fazer 3 coisas, nessa ordem: (1) pegar a chave do Gemini, (2) publicar o site
na Vercel, (3) opcionalmente ligar o banco de dados de uso na Supabase.

---

## Parte 1 — Pegar sua chave do Gemini

1. Acesse **https://aistudio.google.com/apikey**
2. Faça login com sua conta Google (a mesma da assinatura paga)
3. Clique em **"Create API key"**
4. Copie a chave gerada (uma sequência de letras/números) — vai usar na Parte 2

---

## Parte 2 — Publicar o site na Vercel (gratuito)

1. Acesse **https://vercel.com** e crie uma conta (pode usar login do Google)
2. No painel, clique em **"Add New..." → "Project"**
3. Escolha a opção de **subir os arquivos direto** (arraste a pasta `papo-reto-web`
   inteira, com os arquivos `index.html` e a pasta `api/` dentro) — ou, se preferir,
   suba essa pasta pro GitHub primeiro e importe o repositório por lá (mais fácil de
   atualizar depois)
4. Antes de clicar em Deploy, procure **"Environment Variables"** nas configurações do
   projeto. Adicione:
   - Nome: `GEMINI_API_KEY`
   - Valor: (cole a chave que você pegou na Parte 1)
5. Clique em **Deploy**
6. Em cerca de 1 minuto, a Vercel te dá um link tipo `papo-reto.vercel.app` — esse é o
   site de verdade, pode mandar pra qualquer amigo, de qualquer navegador, sem precisar
   de conta Claude nem conta Vercel

Pronto — esse link já funciona: cadastro, chat com a DONA, foto analisando calorias.

---

## Parte 3 — Ver quem está usando (opcional, mas você pediu)

1. Acesse **https://supabase.com** e crie uma conta gratuita
2. Crie um novo projeto (escolha uma senha de banco, guarde ela)
3. No menu lateral, vá em **SQL Editor**, cole o conteúdo do arquivo
   `supabase-setup.sql` (está nessa mesma pasta) e clique em **Run**
4. Vá em **Project Settings → API**. Copie dali:
   - **Project URL**
   - **anon public key**
5. Abra o arquivo `index.html`, procure estas duas linhas perto do topo:
   ```
   const SUPABASE_URL = 'COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE';
   const SUPABASE_ANON_KEY = 'COLE_AQUI_A_ANON_KEY_DO_SEU_PROJETO_SUPABASE';
   ```
   Troque pelos valores copiados (mantendo as aspas)
6. Suba esse arquivo atualizado na Vercel de novo (mesmo processo da Parte 2 — ou, se
   você conectou via GitHub, é só atualizar o arquivo lá que a Vercel republica sozinha)

Depois disso, toda vez que alguém criar perfil, mandar mensagem, mandar foto ou
registrar água, um evento é salvo. Pra ver os dados: entre no seu projeto Supabase →
**Table Editor** → tabela `events`. Só você vê isso (configurei pra ninguém mais
conseguir ler de fora).

---

## Parte 4 — Publicar no Netlify (em vez da Vercel)

1. Acesse **https://app.netlify.com** e crie uma conta grátis (dá pra usar login do GitHub)
2. Clique em **"Add new site" → "Import an existing project"**
3. Escolha **GitHub**, autorize, e selecione o repositório `papo-reto`
4. Antes de publicar, vá em **"Add environment variables"** (ou depois em
   Site settings → Environment variables) e adicione:
   - Key: `GEMINI_API_KEY`
   - Value: sua chave do Gemini
5. Clique em **Deploy**
6. Em 1-2 minutos você recebe um link tipo `papo-reto-xxxx.netlify.app`

Toda vez que você atualizar arquivos no GitHub, o Netlify republica sozinho.

## Parte 5 — Login com o Google ("Entrar com o Google")

1. Acesse **https://console.cloud.google.com/apis/credentials**
2. Crie um projeto (se ainda não tiver um) e clique em **"Create Credentials" →
   "OAuth client ID"**
3. Se pedir, configure a "OAuth consent screen" primeiro (nome do app: "Papo Reto",
   e-mail de suporte: o seu) — pode deixar em modo "Testing" por enquanto
4. Tipo de aplicativo: **"Web application"**
5. Em **"Authorized JavaScript origins"**, adicione o link do seu site Netlify, ex:
   `https://papo-reto-xxxx.netlify.app`
6. Clique em Create — vai aparecer um **Client ID** (termina em
   `.apps.googleusercontent.com`). Copie ele
7. Abra o `index.html`, procure a linha:
   ```
   const GOOGLE_CLIENT_ID = 'COLE_AQUI_SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```
   e cole seu Client ID no lugar
8. Suba o arquivo atualizado pro GitHub (o mesmo processo de sempre — editar e
   confirmar alterações)

Assim que isso estiver configurado, a tela de cadastro passa a mostrar um botão
"Entrar com o Google" antes de pedir peso/altura/idade — o nome, e-mail e foto vêm
prontos da conta Google da pessoa.

**Importante:** enquanto o app estiver em "Testing" no Google Cloud, só e-mails que
você adicionar na lista de "Test users" conseguem logar — é assim mesmo pra fase de
teste com amigos. Pra abrir pra qualquer pessoa, mais pra frente você publica o app
OAuth ("Publish app") no Google Cloud.

## Parte 6 — Instalar como app no celular (PWA)

Já deixei tudo configurado (ícone, manifesto, service worker) — depois de publicado:

- **Android / Chrome**: abra o link do site → toque nos três pontinhos (⋮) →
  **"Instalar aplicativo"** (ou "Adicionar à tela inicial")
- **iPhone / Safari**: abra o link do site → toque no ícone de compartilhar (□↑) →
  **"Adicionar à Tela de Início"**

Em ambos, aparece um ícone próprio do Papo Reto na tela do celular, abrindo em tela
cheia, sem barra de navegador — visualmente igual a um app baixado de loja.

## O que fica de fora, por enquanto

- Loja de aplicativos (Google Play / App Store) — precisa de conta de desenvolvedor
  paga e review deles, é um passo futuro, separado deste
- Pagamento/assinatura de verdade — precisa de conta Stripe vinculada a CNPJ
- Reconhecimento facial nativo — em site web dá pra simular, não é o mesmo nível de
  um app instalado

Qualquer coisa que travar num desses passos, me manda print ou a mensagem de erro que
eu te ajudo a resolver.
