## open problems

- How to keep track of "loops"
- How to keep track of all publishes?
- Help seed everyones content

## ux

Starts with full page with listing of videos

Button in bottom for recording

Recording screen shows video in fullscreen with
progress meter in the bottom

Once recorded something, show button in top right
to publish video

Publish video takes you to the preview screen which
replays the video for you

Publish page shows button in the bottom for actually
publishing the video

Once published, it shows you the submission in
the browser

## data structures

### list of videos

----------------

Upon opening, a peer should send `GET_VIDEOS_HEAD` message on `PINE` topic via
pubsub. Online peers will respond with `SEND_VIDEOS_HEAD` which is a hash of
the latest version that peer have seen of the list of videos. The peer who
requested the list will take the first seen message and fetch the list from that.

A list of videos looks like this:

```
[{
  title: 'Look, a funny cat!',
  video: '/ipfs/Qkamlfknawleknfal',
  created_at: '2017-10-08T16:05:42.023Z'
}]
```

It will also be possible to run `Hoster` nodes to listen and respond to queries
in case no other peers are online.

### view-count

View counts are maintained by super-nodes who are permissioned to increment the
view counters.

When normal nodes first starts, the request the latest head of the counting with
sending a `GET_VIEWS` message on topic `PINE` upon the super-nodes responds with
a `SEND_VIEWS` message containing the data-structure for the views.
