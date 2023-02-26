const path = require('path');
const esbuild = require('esbuild');
const { filelocPlugin } = require("esbuild-plugin-fileloc");
const envFilePlugin = require('esbuild-envfile-plugin');

const output = path.resolve(__dirname, '..', 'server', 'resources', 'crz');

const watch = process.argv.slice(2)[0];

const watchConfig = (side) => watch && {
    onRebuild(err, result) {
        if (err) console.error(err)
        else console.log(`👀 [${side}]: Watch-Builded!`)
    }
};

esbuild.build({
    entryPoints: [`./src/client/index.ts`],
    outdir: output + "/client/",
    bundle: true,
    minify: false,
    platform: 'browser',
    target: ['chrome93'],
    format: 'iife',
    watch: watchConfig('client')
}).then(() => console.log('✔ [client]: Builded!')).catch((err) => console.log(err));

esbuild.build({
    entryPoints: [`./src/server/index.ts`],
    outdir: output + "/server/",
    bundle: true,
    minify: false,
    format: 'cjs',
    keepNames: false,
    target: ['ES2022'],
    platform: 'node',
    watch: watchConfig('server'),
    plugins: [envFilePlugin,filelocPlugin()]
}).then(() => console.log('✔ [server]: Builded!')).catch((err) => console.log(err));