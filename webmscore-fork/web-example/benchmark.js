
import WebMscore from 'webmscore'
import { promises as fs, watch } from 'fs'
import { PerformanceObserver, performance } from 'perf_hooks'
import { spawn } from 'child_process'

const FILE = './Aequale_No_1.mscz'
const ROUNDS = 200

const GROUPS = [   // [ webmscore method name , musescore output file extension ]
    ['saveXml', 'musicxml'],
    ['saveMxl', 'mxl'],
    ['saveMidi', 'mid'],
    ['savePdf', 'pdf'],
    ['saveMetadata', 'metajson'],
]
const GROUP_ID = 4  // saveMetadata
const BOOST_MODE = true  // `savePdf` is not available under boost mode, `saveXml` and `saveMxl` cannot work properly

const obs = new PerformanceObserver((items) => {
    const [init, ...l] = items.getEntries()
    const total = l.reduce((p, c) => p + c.duration, 0)
    const avg = total / l.length
    console.log(`webmscore: 
        initialization time: ${init.duration} ms, 
        rounds: ${ROUNDS}, 
        total: ${total} ms, 
        avg: ${avg} ms
    `)
})
obs.observe({ entryTypes: ['measure'], buffered: true })

// 
// benchmark using webmscore
// 
const METHOD = GROUPS[GROUP_ID][0]
WebMscore.ready.then(async () => {
    const filedata = await fs.readFile(FILE)
    performance.measure('init')

    for (let i = 0; i < ROUNDS; i++) {
        performance.mark('start')
        const score = await WebMscore.load('mscz', filedata, [], !BOOST_MODE)
        await score[METHOD]()
        score.destroy()
        performance.measure(`${i}`, 'start')
    }
})

    // 
    // benchmark using musescore's built-in batch converter
    // 
    .then(async () => {
        const EXT = GROUPS[GROUP_ID][1]

        await fs.mkdir('./benchmark/', { recursive: true })

        const t0 = performance.now()

        const batchJsonFile = './benchmark/batch.json'
        const json = []
        for (let i = 0; i < ROUNDS; i++) {
            json.push({
                in: FILE,
                out: `./benchmark/${i}.${EXT}`
            })
        }

        // generate an extra file to get the initialization time
        const extraFile = `./benchmark/first.${EXT}`
        json.unshift({
            in: FILE,
            out: extraFile
        })
        await fs.writeFile(extraFile, null)  // make sure the file exists (fs.watch)

        await fs.writeFile(batchJsonFile, JSON.stringify(json))

        // watch for the extra (first) file, to get the initialization time
        let inittime = 0
        watch(extraFile, { persistent: false }, () => {
            inittime = performance.now() - t0
        })

        const p = spawn('musescore3', ['-j', batchJsonFile])
        await new Promise((resolve) => {
            p.on('exit', resolve)
        })

        const t1 = performance.now()  // ${ROUNDS + 1} files
        const total = (t1 - inittime) /** ${ROUNDS} files */ - t0
        const avg = total / ROUNDS

        console.log(`
native musescore: 
        initialization time: ${inittime} ms, 
        rounds: ${ROUNDS}, 
        total: ${total} ms, 
        avg: ${avg} ms
        `)
    })
