var functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.checkAllPlayersReady = functions.database.ref('games/{gameName}/players').onWrite(event => {
  const original = event.data.val()
  const allPlayersReady = Object.keys(original).reduce(
    (acc, player) => acc && original[player].ready,
    true
  )
  event.data.ref.parent.child('can_start').set(allPlayersReady)
})
