const assert = require('assert')
const _ = require('lodash')

const newDate = (d) => (new Date(d)).toISOString()

const merge = (a, b) => {
  const res = [].concat(a).concat(b)
  res.sort((first, second) => {
    return first.created_at > second.created_at
  })
  const filteredRes = _.uniqBy(res, 'video')
  return filteredRes
}

const test = (title, content) => {
  console.log('## ' + title)
  content()
  console.log('pass')
}

test('merging two arrays with different videos', () => {
  const videoA = {
    title: 'Video A',
    created_at: newDate('2017-10-09T10:00:00.000Z'),
    video: '/ipfs/Qma'
  }
  const videoB = {
    title: 'Video B',
    created_at: newDate('2017-10-09T11:00:00.000Z'),
    video: '/ipfs/Qmb'
  }
  assert.equal(videoA.title, 'Video A')
  assert.equal(videoB.title, 'Video B')
  const result = merge([videoB], [videoA])
  assert.equal(result.length, 2)
  assert.equal(result[0].title, 'Video A')
  assert.equal(result[1].title, 'Video B')
})

test('merging two arrays with the same video ends up with one', () => {
  const videoA = {
    title: 'Video A',
    created_at: newDate('2017-10-09T10:00:00.000Z'),
    video: '/ipfs/Qma'
  }
  const videoB = {
    title: 'Video B',
    created_at: newDate('2017-10-09T11:00:00.000Z'),
    video: '/ipfs/Qma'
  }
  const result = merge([videoA], [videoB])
  assert.equal(result.length, 1)
})

console.log('All tests pass')
