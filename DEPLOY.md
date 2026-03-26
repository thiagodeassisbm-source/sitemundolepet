# Deploy automático – Mundo Le Pet

## Opção 1: Deploy pelo GitHub (totalmente automático)

Quando você der **push na branch `main`**, o GitHub faz o build e envia a pasta `build/` para o servidor por FTP.

### Configuração (uma vez)

1. Envie o projeto para o GitHub (se ainda não estiver).
2. No repositório: **Settings** → **Secrets and variables** → **Actions**.
3. Clique em **New repository secret** e crie estes segredos:

   | Nome             | Valor                          | Obrigatório |
   |------------------|---------------------------------|-------------|
   | `FTP_HOST`       | `147.79.84.227`                 | Sim         |
   | `FTP_USER`       | `u315410518.mundolepet.com.br`  | Sim         |
   | `FTP_PASSWORD`   | sua senha FTP                   | Sim         |
   | `FTP_PORT`       | `21`                            | Não (padrão 21) |
   | `FTP_REMOTE_PATH`| `public_html/site`              | Não         |
   | `BACKEND_REMOTE_PATH`| `public_html/site`          | Recomendado |

4. Salve. Da próxima vez que der **push em `main`**, o deploy roda sozinho.

Para ver o resultado: **Actions** → workflow **Deploy** → último run.  
Também dá para rodar manualmente: **Actions** → **Deploy** → **Run workflow**.

---

## Opção 2: Deploy pelo seu PC (um comando)

No terminal, na pasta do projeto:

```bash
npm run deploy
```

Isso faz o build e envia a pasta `build/` por FTP.

### Configuração (uma vez)

1. Copie o arquivo `.env.deploy.example` para `.env.deploy`.
2. Abra `.env.deploy` e coloque sua **senha FTP** em `FTP_PASSWORD`.
3. Salve (não commite o `.env.deploy`; ele está no `.gitignore`).

Depois é só rodar `npm run deploy` quando quiser atualizar o site.

---

## Estrutura atual do servidor

Seu servidor está com o projeto em `public_html/site` (sem subpasta `public` no web root).

Use:

```env
FTP_REMOTE_PATH=/public_html/site
BACKEND_REMOTE_PATH=/public_html/site
```

Assim o deploy publica os arquivos web e backend no mesmo diretório correto.

---

## Deploy envia `build/` e (opcional) backend

Por padrão o deploy envia a pasta **build/** (JS/CSS compilados).  
Se você definir **BACKEND_REMOTE_PATH** no `.env` ou `.env.deploy`, o deploy **também envia** as pastas e arquivos do backend que costumam ser alterados:

- `app/` (controllers, middleware, models)
- `routes/`
- `config/`
- `bootstrap/`
- `resources/views/`
- `artisan`

Assim, ao rodar `npm run deploy`, o formulário "Site e Google" e outras alterações em PHP passam a ser atualizadas no servidor junto com o build.

### Como ativar o envio do backend

No `.env.deploy` (ou `.env`), adicione:

```env
BACKEND_REMOTE_PATH=/public_html/site
```

Use o **caminho da raiz do projeto Laravel no servidor**. Se no seu FTP a raiz já é a pasta do Laravel (onde ficam `app/`, `routes/`, `public/`), use o mesmo valor de `FTP_REMOTE_PATH` ou o caminho relativo correto. Exemplos:

- Tudo na mesma pasta: `BACKEND_REMOTE_PATH=/public_html/site` (caso atual do seu servidor)
- Laravel em pasta separada: `BACKEND_REMOTE_PATH=../laravel` (ajuste conforme a estrutura do seu servidor)

### Horário no arquivo de verificação

O arquivo `build/deploy-verificado.txt` usa **horário de Brasília** (America/Sao_Paulo) na data/hora exibida.
