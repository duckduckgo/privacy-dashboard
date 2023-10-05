import { it } from 'node:test'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { readFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

it('removes mock data for production build', () => {
    const contents = readFileSync(join(__dirname, '..', 'build/app/public/js/base.js'), 'utf8')
    assert.ok(!contents.includes('mockDataProvider'), 'artifact must not contain mockDataProvider. Please run `npm run build`')
})
