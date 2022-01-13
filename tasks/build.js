require('esbuild')
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'public/feds.js',
    watch: process.argv.includes('--watch'),
    minifyWhitespace: !process.argv.includes('--watch'),
    minify: !process.argv.includes('--watch'),
    sourcemap: true,
  })
  .catch(() => process.exit(1));
