const path = require('path');
const esbuild = require('esbuild');
const { filelocPlugin } = require("esbuild-plugin-fileloc");

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
    minify: true,
    format: 'esm',
    target: ['ES2021'],
    watch: watchConfig('client')
}).then(() => console.log('✔ [client]: Builded!')).catch((err) => console.log(err));

esbuild.build({
    entryPoints: [`./src/server/index.ts`],
    outdir: output + "/server/",
    bundle: true,
    minify: false,
    format: 'cjs',
    keepNames: false,
    target: ['node16'],
    platform: 'node',
    watch: watchConfig('server'),
    plugins: [filelocPlugin()]
}).then(() => console.log('✔ [server]: Builded!')).catch((err) => console.log(err));