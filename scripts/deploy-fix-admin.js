/**
 * Corrige o admin no servidor (404): envia bootstrap/ e routes/ e remove cache de rotas no servidor.
 * Uso: npm run deploy:fix-admin
 * Não faz build nem envia o resto do projeto. Use quando a página principal já funciona e só o admin dá 404.
 */
import { Client } from 'basic-ftp';
import { execSync } from 'child_process';
import { createReadStream, readFileSync, existsSync } from 'fs';
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
    const fromProcess = { FTP_HOST: process.env.FTP_HOST, FTP_USER: process.env.FTP_USER, FTP_PASSWORD: process.env.FTP_PASSWORD, FTP_PORT: process.env.FTP_PORT, FTP_REMOTE_PATH: process.env.FTP_REMOTE_PATH };
    if (fromProcess.FTP_PASSWORD && (fromProcess.FTP_HOST || fromProcess.FTP_USER)) return fromProcess;
    const fromEnv = parseEnvFile(join(root, '.env'));
    const fromDeploy = parseEnvFile(join(root, '.env.deploy'));
    const merged = {};
    for (const key of FTP_KEYS) merged[key] = fromProcess[key] ?? fromEnv[key] ?? fromDeploy[key] ?? '';
    if (merged.FTP_PASSWORD && (merged.FTP_HOST || merged.FTP_USER)) return merged;
    console.error('\n❌ Credenciais FTP não encontradas. Configure .env ou .env.deploy.\n');
    process.exit(1);
}

function clearCacheBeforeDeploy() {
    console.log('\n🧹 Limpando cache de rotas e config localmente...\n');
    try {
        execSync('php artisan route:clear', { cwd: root, stdio: 'inherit' });
        execSync('php artisan config:clear', { cwd: root, stdio: 'inherit' });
    } catch (_) { /* ignore */ }
}

async function uploadDir(client, localPath, remoteBase, remoteDir) {
    const fullRemote = remoteBase ? `${remoteBase}/${remoteDir}` : remoteDir;
    await client.ensureDir(fullRemote);
    await client.uploadFromDir(localPath, fullRemote);
}

(async () => {
    const env = loadEnv();
    clearCacheBeforeDeploy();

    const host = env.FTP_HOST || env.FTP_HOSTNAME;
    const user = env.FTP_USER || env.FTP_USERNAME;
    const password = env.FTP_PASSWORD;
    const remotePath = (env.FTP_REMOTE_PATH || env.REMOTE_PATH || '').trim().replace(/\/+$/, '');
    const port = parseInt(env.FTP_PORT || '21', 10);
    const base = remotePath || '.';

    console.log('\n📤 Corrigindo admin (bootstrap + routes + remover cache no servidor)...\n');

    const client = new Client(60_000);
    try {
        await client.access({ host, port, user, password, secure: false });
        console.log('   Conexão FTP OK.\n');

        for (const dir of ['bootstrap', 'routes']) {
            const localDir = join(root, dir);
            if (!existsSync(localDir)) continue;
            console.log('   Enviando', dir, '...');
            await uploadDir(client, localDir, base, dir);
            console.log('   OK', dir);
        }
        const htaccess = join(root, '.htaccess');
        if (existsSync(htaccess)) {
            console.log('   Enviando .htaccess ...');
            await client.uploadFrom(createReadStream(htaccess), base ? `${base}/.htaccess` : '.htaccess');
            console.log('   OK .htaccess (necessário para /historia, /admin, etc.)');
        }

        for (const cacheFile of ['bootstrap/cache/routes-v7.php', 'bootstrap/cache/config.php']) {
            const remoteFile = base ? `${base}/${cacheFile}` : cacheFile;
            try {
                await client.remove(remoteFile, true);
                console.log('   Removido no servidor:', cacheFile);
            } catch (_) { /* pode não existir */ }
        }

        console.log('\n✅ Admin corrigido. Acesse https://mundolepet.com.br/admin/login\n');
    } catch (err) {
        console.error('\n❌ Erro:', err.message);
        process.exit(1);
    } finally {
        client.close();
    }
})();
