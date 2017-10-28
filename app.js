$pageMain = document.querySelector('.page-main')
$pageSubmission = document.querySelector('.page-submission')
$pageRecord = document.querySelector('.page-record')
$pagePublish = document.querySelector('.page-publish')

$pageMainRecordButton = document.querySelector('.page-main .button')

$pageRecordBackButton = document.querySelector('.page-record .back')
$pageRecordPublishButton = document.querySelector('.page-record .publish')

$pagePublishBackButton = document.querySelector('.page-publish .back')
$pagePublishPublishButton = document.querySelector('.page-publish .publish')

// clicking record from main page
$pageMainRecordButton.addEventListener('click', (evt) => {
  $pageMain.style.display = 'none'
  $pageRecord.style.display = 'block'
  evt.preventDefault()
})

// clicking back from record page
$pageRecordBackButton.addEventListener('click', (evt) => {
  $pageMain.style.display = 'block'
  $pageRecord.style.display = 'none'
  evt.preventDefault()
})

// clicking publish from record page
$pageRecordPublishButton.addEventListener('click', (evt) => {
  $pageRecord.style.display = 'none'
  $pagePublish.style.display = 'block'
  evt.preventDefault()
  mediaRecorder.requestData()
  console.log('time to save data')
  console.log(recordedBlobs)
  var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  $recordedVideo.src = window.URL.createObjectURL(superBuffer)
})

// clicking back from publish page
$pagePublishBackButton.addEventListener('click', (evt) => {
  $pageRecord.style.display = 'block'
  $pagePublish.style.display = 'none'
  evt.preventDefault()
})

const node = new Ipfs()

node.on('ready', () => {
  console.log('IPFS node is alive')
  // 
})

// final publish from publish page
$pagePublishPublishButton.addEventListener('click', (evt) => {
  $pagePublish.style.display = 'none'
  $pageMain.style.display = 'block'
  evt.preventDefault()
  publishVideo()
})

var $video = document.querySelector('#video')
var $recordedVideo = document.querySelector('#recorded')
let videoStream = null
let recordedBlobs = []
let mediaRecorder = null

navigator.mediaDevices.getUserMedia({
  video: true,
  // audio: true
}).then((localMediaStream) => {
  videoStream = localMediaStream
  $video.src = window.URL.createObjectURL(localMediaStream)
  var options = {mimeType: 'video/webm;codecs=vp9'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.log(options.mimeType + ' is not Supported');
    options = {mimeType: 'video/webm;codecs=vp8'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + ' is not Supported');
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: ''};
      }
    }
  }
  mediaRecorder = new MediaRecorder(videoStream, options)
  mediaRecorder.start(10)
  mediaRecorder.pause()
  mediaRecorder.ondataavailable = (evt) => {
    console.log('Got data')
    recordedBlobs.push(evt.data)
  }
}).catch((err) => {
  throw err
})

let recording = false
let recInterval = null
let progress = 0

const $progress = document.querySelector('.record-progress')

$video.addEventListener('mousedown', () => {
  console.log('start recording')
  recording = true
  mediaRecorder.resume()
  recInterval = setInterval(() => {
    if (progress < 6000) {
      progress = progress + 50
      $progress.style.width = Math.floor((progress / 6000) * 100) + '%'
    } else {
      console.log('No more to record')
      clearInterval(recInterval)
      mediaRecorder.pause()
      mediaRecorder.requestData()
      recording = false
    }
  }, 50)
})
$video.addEventListener('mouseup', () => {
  console.log('stop recording')
  mediaRecorder.pause()
  mediaRecorder.requestData()
  recording = false
  clearInterval(recInterval)
})
// document.querySelector('#save').addEventListener('click', () => {
// })

const publishVideo = () => {
  var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  var reader = new FileReader()
  reader.onload = function(){
    var buffer = new node.types.Buffer(reader.result)
    node.files.add({
      path: `directory/video.webm`,
      content: buffer
      // content: new node.types.Buffer(recordedBlobs)
      // content: new ipfs.types.Buffer(ia)
    }, (err, res) => {
      console.log(res[1].hash)
      console.log(`https://ipfs.io/ipfs/${res[1].hash}/video.webm`)
    })
  }
  reader.readAsArrayBuffer(superBuffer)
}

// document.querySelector('#publish').addEventListener('click', () => {
// })
// 
// document.querySelector('#reset').addEventListener('click', () => {
//   console.log('reseting')
//   recordedBlobs = []
//   $recordedVideo.src = ''
//   progress = 0
// })
