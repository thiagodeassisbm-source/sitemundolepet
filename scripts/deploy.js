/**
 * Deploy automático: build + upload da pasta build/ via FTP.
 * Uso: npm run deploy
 * Lê FTP_* de: variáveis de ambiente, ou .env, ou .env.deploy.
 */
import { Client } from 'basic-ftp';
import { execSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync, createReadStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const FTP_KEYS = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD', 'FTP_PORT', 'FTP_REMOTE_PATH', 'FTP_HOSTNAME', 'FTP_USERNAME', 'REMOTE_PATH', 'BACKEND_REMOTE_PATH'];

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

    console.error('\n❌ Credenciais FTP não encontradas.');
    console.error('   Coloque FTP_HOST, FTP_USER e FTP_PASSWORD em .env ou .env.deploy.\n');
    process.exit(1);
}

async function runBuild() {
    console.log('\n📦 Rodando npm run build...\n');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
    console.log('\n✅ Build concluído.\n');
}

function writeVerificacao() {
    const buildDir = join(root, 'build');
    if (!existsSync(buildDir)) return;
    const agora = new Date();
    // Horario de Brasilia (America/Sao_Paulo)
    const brasiliaStr = agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'medium' });
    const texto = `DEPLOY VERIFICADO
Data/hora (Brasilia): ${brasiliaStr}
Timestamp: ${agora.getTime()}

Se voce esta vendo este arquivo em https://mundolepet.com.br/build/deploy-verificado.txt
entao a pasta build/ esta sendo atualizada no servidor pelo deploy.
`;
    writeFileSync(join(buildDir, 'deploy-verificado.txt'), Buffer.from(texto, 'utf8'));
    console.log('   Arquivo de verificacao criado: build/deploy-verificado.txt (horario Brasilia)\n');
}

async function uploadFtp(env) {
    const host = env.FTP_HOST || env.FTP_HOSTNAME;
    const user = env.FTP_USER || env.FTP_USERNAME;
    const password = env.FTP_PASSWORD;
    let remotePath = (env.FTP_REMOTE_PATH || env.REMOTE_PATH || '').trim().replace(/\/+$/, '');
    const port = parseInt(env.FTP_PORT || '21', 10);

    if (!host || !user || !password) {
        console.error('❌ Configure FTP_HOST, FTP_USER e FTP_PASSWORD em .env ou .env.deploy.');
        process.exit(1);
    }

    const localBuild = join(root, 'build');
    const remoteBuildPath = remotePath ? `${remotePath}/build` : 'build';

    console.log(`📤 Conectando em ${host}:${port}`);
    console.log(`   Destino no servidor: ${remoteBuildPath}/ (pasta onde ficam manifest.json e assets/)`);
    console.log('   Enviando...\n');

    const client = new Client(60_000);
    try {
        await client.access({
            host,
            port,
            user,
            password,
            secure: false,
        });
        console.log('   Conexão FTP OK.\n');

        console.log(`   Limpando pasta remota: ${remoteBuildPath}`);
        await client.ensureDir(remoteBuildPath);
        await client.clearWorkingDir();
        await client.ensureDir(remoteBuildPath);
        console.log('   Pasta remota limpa (arquivos antigos removidos).\n');

        console.log(`   Enviando de ${localBuild} para ${remoteBuildPath}...`);
        client.trackProgress((info) => {
            if (info.type === 1) console.log('  ', info.name);
        });
        await client.uploadFromDir(localBuild, remoteBuildPath);
        client.trackProgress();

        console.log('\n✅ Pasta build/ enviada.\n');

        // Enviar backend (PHP, rotas, views) para o servidor
        const backendPath = (env.BACKEND_REMOTE_PATH || '').trim().replace(/\/+$/, '');
        if (backendPath) {
            console.log(`📤 Enviando arquivos do backend para ${backendPath}/ ...\n`);
            const dirsToUpload = [
                { local: 'app', remote: 'app' },
                { local: 'routes', remote: 'routes' },
                { local: 'config', remote: 'config' },
                { local: 'bootstrap', remote: 'bootstrap' },
                { local: 'database', remote: 'database' },
                { local: 'resources/views', remote: 'resources/views' },
            ];
            for (const { local, remote } of dirsToUpload) {
                const localDir = join(root, local);
                const remoteDir = backendPath ? `${backendPath}/${remote}` : remote;
                if (!existsSync(localDir)) continue;
                try {
                    await client.ensureDir(remoteDir);
                    await client.uploadFromDir(localDir, remoteDir);
                    console.log('   OK:', remote);
                } catch (e) {
                    console.warn('   Aviso ao enviar', remote, ':', e.message);
                }
            }
            // Arquivos raiz importantes (artisan, verificações, etc)
            const rootFiles = ['artisan', 'index.php', '.htaccess', 'google251fd2bf505abc91.html', 'detective.php', 'test-web.php', 'test-backend-2.php', 'test-db-stats.php', 'test-error.php', 'check-vendor.php', 'ping-path.php', 'clear_cache.php', 'ler-historico.php', 'chk_php.php', 'sitemap.xml', 'robots.txt', 'depth-check.php', 'read-env.php', 'chk_v5.php'];
            for (const file of rootFiles) {
                const localFile = join(root, file);
                const remoteFile = backendPath ? `${backendPath}/${file}` : file;
                if (existsSync(localFile)) {
                    try {
                        try { await client.remove(remoteFile); } catch(e) {}
                        await client.uploadFrom(createReadStream(localFile), remoteFile);
                        console.log('   OK:', file);
                    } catch (e) {
                        console.warn('   Aviso:', file, e.message);
                    }
                }
            }
            console.log('\n✅ Backend (app, routes, config, views) enviado.\n');
        } else {
            console.log('   (Backend nao enviado: defina BACKEND_REMOTE_PATH no .env ou .env.deploy para enviar app/, routes/, etc.)\n');
        }

        console.log('✅ Deploy concluído.');
        console.log('   URL do painel: https://mundolepet.com.br/admin/content');
        console.log('   Se ainda vir versão antiga: Ctrl+Shift+R (hard refresh) no navegador.\n');
    } catch (err) {
        console.error('\n❌ Erro no FTP:', err.message);
        process.exit(1);
    } finally {
        client.close();
    }
}

(async () => {
    try {
        const env = loadEnv();
        console.log('--- ENV LOADED ---');
        const skipBuild = process.env.DEPLOY_SKIP_BUILD === '1';
        if (!skipBuild) {
            await runBuild();
            writeVerificacao();
        } else {
            console.log('⏩ Pulando build...');
            writeVerificacao();
        }
        console.log('📡 Iniciando upload FTP...');
        await uploadFtp(env);
        console.log('\n✅ Script finalizado com sucesso.');
    } catch (e) {
        console.error('\n❌ ERRO GLOBAL NO DEPLOY:', e.message);
        process.exit(1);
    }
})();
