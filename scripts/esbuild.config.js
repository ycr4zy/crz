const path = require('path');
const esbuild = require('esbuild');
const { filelocPlugin } = require("esbuild-plugin-fileloc");

const output = path.resolve(__dirname, '..', 'server', 'resources', 'surge-app');

const watch = process.argv.slice(2)[0];

const watchConfig = (side) => watch && {
    onRebuild(err, result) {
        if (err) console.error(err)
        else console.log(`👀 [${side}]: Compilado!`)
    }
};

esbuild.build({
    entryPoints: [`./src/client/index.ts`],
    outdir: output + "/client/",
    bundle: true,
    minify: true,
    format: 'esm',
    target: ['ES2021'],
    watch: watchConfig('client')
}).then(() => console.log('🚀 [client]: Compilado!')).catch((err) => console.log(err));

esbuild.build({
    entryPoints: [`./src/server/index.ts`],
    outdir: output + "/server/",
    bundle: true,
    minify: true,
    format: 'cjs',
    keepNames: true,
    target: ['node16'],
    platform: 'node',
    watch: watchConfig('server'),
    plugins: [filelocPlugin()]
}).then(() => console.log('🚀 [server]: Compilado!')).catch((err) => console.log(err));