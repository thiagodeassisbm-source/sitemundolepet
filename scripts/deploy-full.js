/**
 * Deploy COMPLETO: build + todo o projeto Laravel (exceto vendor, node_modules, .env).
 * Uso: npm run deploy:full
 * Envia: app/, bootstrap/, config/, database/, resources/, routes/, storage/, build/, public/, index.php, artisan, composer.json, composer.lock, .env.example
 * O servidor deve ter: FTP_REMOTE_PATH = raiz do projeto (onde ficam index.php e app/).
 * Depois do upload: no servidor, copie .env.example para .env, preencha DB_* e rode composer install e php artisan key:generate.
 */
import { Client } from 'basic-ftp';
import { execSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync, createReadStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const FTP_KEYS = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD', 'FTP_PORT', 'FTP_REMOTE_PATH', 'FTP_HOSTNAME', 'FTP_USERNAME', 'REMOTE_PATH'];

function parseEnvFile(filePath) {
    if (!existsSync(filePath)) return {};
    const content = readFileSync(filePath, 'utf8');
    const env = {};
    for (const line of content.split('\n')) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
    return env;
}

function loadEnv() {
    const fromProcess = {
        FTP_HOST: process.env.FTP_HOST,
        FTP_USER: process.env.FTP_USER,
        FTP_PASSWORD: process.env.FTP_PASSWORD,
        FTP_PORT: process.env.FTP_PORT,
        FTP_REMOTE_PATH: process.env.FTP_REMOTE_PATH,
    };
    if (fromProcess.FTP_PASSWORD && (fromProcess.FTP_HOST || fromProcess.FTP_USER)) return fromProcess;
    const fromEnv = parseEnvFile(join(root, '.env'));
    const fromDeploy = parseEnvFile(join(root, '.env.deploy'));
    const merged = {};
    for (const key of FTP_KEYS) {
        merged[key] = fromProcess[key] ?? fromEnv[key] ?? fromDeploy[key] ?? '';
    }
    if (merged.FTP_PASSWORD && (merged.FTP_HOST || merged.FTP_USER)) return merged;
    console.error('\n❌ Credenciais FTP não encontradas. Configure .env ou .env.deploy.\n');
    process.exit(1);
}

async function runBuild() {
    console.log('\n📦 Rodando npm run build...\n');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
    console.log('\n✅ Build concluído.\n');
}

function clearCacheBeforeDeploy() {
    console.log('\n🧹 Limpando cache de rotas e config (para o admin funcionar no servidor)...\n');
    try {
        execSync('php artisan route:clear', { cwd: root, stdio: 'inherit' });
        execSync('php artisan config:clear', { cwd: root, stdio: 'inherit' });
        execSync('php artisan cache:clear', { cwd: root, stdio: 'inherit' });
        console.log('   Cache limpo. O servidor receberá bootstrap/cache sem cache de rotas.\n');
    } catch (e) {
        console.log('   (Ignorando falha ao limpar cache. Certifique-se de ter vendor/ e rodar deploy.)\n');
    }
}

function writeVerificacao() {
    const buildDir = join(root, 'build');
    if (!existsSync(buildDir)) return;
    const agora = new Date();
    const brasiliaStr = agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'medium' });
    const texto = `DEPLOY VERIFICADO
Data/hora (Brasilia): ${brasiliaStr}
Timestamp: ${agora.getTime()}

Deploy completo do site.
`;
    writeFileSync(join(buildDir, 'deploy-verificado.txt'), Buffer.from(texto, 'utf8'));
}

async function uploadDir(client, localPath, remoteBase, remoteDir) {
    const fullRemote = remoteBase ? `${remoteBase}/${remoteDir}` : remoteDir;
    await client.ensureDir(fullRemote);
    await client.uploadFromDir(localPath, fullRemote);
}

async function uploadFile(client, localPath, remoteBase, remoteFile) {
    const fullRemote = remoteBase ? `${remoteBase}/${remoteFile}` : remoteFile;
    await client.uploadFrom(createReadStream(localPath), fullRemote);
}

(async () => {
    const env = loadEnv();
    const skipBuild = process.env.DEPLOY_SKIP_BUILD === '1';
    if (!skipBuild) {
        await runBuild();
        writeVerificacao();
    } else {
        writeVerificacao();
    }
    clearCacheBeforeDeploy();

    const host = env.FTP_HOST || env.FTP_HOSTNAME;
    const user = env.FTP_USER || env.FTP_USERNAME;
    const password = env.FTP_PASSWORD;
    const remotePath = (env.FTP_REMOTE_PATH || env.REMOTE_PATH || '').trim().replace(/\/+$/, '');
    const port = parseInt(env.FTP_PORT || '21', 10);

    console.log(`\n📤 Deploy COMPLETO em ${host}:${port}`);
    console.log(`   Destino: ${remotePath || '(raiz FTP)'}\n`);

    const client = new Client(120_000);
    try {
        await client.access({ host, port, user, password, secure: false });
        console.log('   Conexão FTP OK.\n');

        const base = remotePath || '.';

        const dirs = [
            { local: 'app', remote: 'app' },
            { local: 'bootstrap', remote: 'bootstrap' },
            { local: 'config', remote: 'config' },
            { local: 'database', remote: 'database' },
            { local: 'resources', remote: 'resources' },
            { local: 'routes', remote: 'routes' },
            // { local: 'storage', remote: 'storage' }, // REMOVIDO: Evita sobrescrever cache/sessões e uploads em produção
            { local: 'build', remote: 'build' },
        ];
        for (const { local, remote } of dirs) {
            const localDir = join(root, local);
            if (!existsSync(localDir)) continue;
            console.log('   Enviando', remote, '...');
            await uploadDir(client, localDir, base, remote);
            console.log('   OK', remote);
        }
        // Remove cache de rotas/config no servidor para o admin carregar as rotas de web.php
        for (const cacheFile of ['bootstrap/cache/routes-v7.php', 'bootstrap/cache/config.php']) {
            const remotePath = base ? `${base}/${cacheFile}` : cacheFile;
            try {
                await client.remove(remotePath, true);
                console.log('   Removido no servidor:', cacheFile);
            } catch (_) { /* arquivo pode não existir */ }
        }
        if (existsSync(join(root, 'public'))) {
            console.log('   Enviando public ...');
            await uploadDir(client, join(root, 'public'), base, 'public');
            console.log('   OK public');
        }

        const files = ['index.php', '.htaccess', 'artisan', 'composer.json', 'composer.lock', '.env.example', 'debug-server.php'];
        for (const file of files) {
            const localFile = join(root, file);
            if (!existsSync(localFile)) continue;
            console.log('   Enviando', file, '...');
            await uploadFile(client, localFile, base, file);
            console.log('   OK', file);
        }

        console.log('\n✅ Deploy completo concluído.\n');
        console.log('⚠️  NO SERVIDOR, faça:');
        console.log('   1. Copie .env.example para .env');
        console.log('   2. Edite .env e preencha: APP_KEY=, DB_DATABASE, DB_USERNAME, DB_PASSWORD, APP_URL=https://mundolepet.com.br');
        console.log('   3. Rode: php artisan key:generate');
        console.log('   4. Rode: composer install --no-dev --optimize-autoloader');
        console.log('   5. Rode: php artisan migrate --force');
        console.log('   6. Ajuste a raiz do domínio para a pasta onde está o index.php (raiz do projeto).\n');
    } catch (err) {
        console.error('\n❌ Erro no FTP:', err.message);
        process.exit(1);
    } finally {
        client.close();
    }
})();
