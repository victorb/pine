const ipfs = require('ipfs')

const viewsAtom = {}
const videosAtom = []
let videosAtomHead = null // will be replaced once the first video is added

// video structure
// title: string
// video: multihash with full ipfs path
// created_at: string of ISO date

const node = new ipfs({
  repo: './.ipfs-repo',
  EXPERIMENTAL: {
    pubsub: true
  }
})

const actions = {
  'GET_VIDEOS_HEAD': (msg) => {
    node.pubsub.publish('PINE', {
      type: 'SEND_VIDEOS_HEAD',
      value: videosAtomHead
    })
  },
  'PUBLISH_VIDEO': (msg) => {
    // TODO doesn't handle concurrency yet
    const video = {}
    video.title = msg.data.title
    video.video = msg.data.video
    video.created_at = msg.data.created_at
    if (
      typeof video.title !== 'string' ||
      typeof video.video !== 'string' ||
      typeof video.created_at !== 'string'
    ) {
      console.log('Someone is publishing something that is not a video')
      return
    }
    videosAtom.push(video)
    node.dag.add(videosAtom).then((headHash) => {
      videosAtomHead = headHash
    })
  }
}

node.once('ready', () => {
  console.log(node.pubsub)

  node.pubsub.subscribe('PINE', (msg) => {
    msg.data = JSON.parse(msg.data.toString())
    if (actions[msg.data.type] === undefined) {
      console.log('unsupported event')
    } else {
      actions[msg.data.type](msg)
    }
  })
})

node.once('error', (err) => {
  console.log('Error')
  console.log(err)
})
