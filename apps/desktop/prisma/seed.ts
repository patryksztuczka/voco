import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../src/generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

const BUILTIN_PRESETS = [
  {
    id: 'builtin-beautify',
    name: 'Beautify',
    prompt:
      'Fix grammar, punctuation, and spelling errors while preserving the original meaning and tone.',
    isBuiltin: true
  },
  {
    id: 'builtin-concise',
    name: 'Concise',
    prompt: 'Summarize the transcription into a brief, clear message while keeping the key points.',
    isBuiltin: true
  },
  {
    id: 'builtin-formal',
    name: 'Formal',
    prompt: 'Rewrite the transcription in a formal, professional tone.',
    isBuiltin: true
  }
]

async function main() {
  console.log('Seeding database with default presets...')

  for (const preset of BUILTIN_PRESETS) {
    await prisma.preset.upsert({
      where: { id: preset.id },
      update: {
        name: preset.name,
        prompt: preset.prompt,
        isBuiltin: preset.isBuiltin
      },
      create: preset
    })
    console.log(`  ✓ ${preset.name}`)
  }

  console.log('Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
