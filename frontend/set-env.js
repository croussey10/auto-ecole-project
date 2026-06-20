const fs = require('node:fs')

const dir = './src/environments'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const envConfigFile = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseKey: '${process.env.SUPABASE_KEY}'
};
`

fs.writeFileSync(`${dir}/environment.ts`, envConfigFile)
console.log('✅ Fichier environment.ts généré avec succès par Vercel !')
