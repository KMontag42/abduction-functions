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

const CARD_MAP = {
  base: ['grey', 'grey', 'fbi', 'cultist', 'ancient astronaut theorist', 'citizen']
}

const selectRandomCard = cardMap => {
  const cardName = cardMap[Math.floor(Math.random() * cardMap.length)]
  const cardIndex = cardMap.indexOf(cardName)
  cardMap.splice(cardIndex, 1)
  return cardName
}

exports.gameStarted = functions.database.ref('games/{gameName}/is_started').onWrite(event => {
  const isStarted = event.data.val()
  if (isStarted) {
    // do some shit
    // pick a random card from the set for each player
    const cardMap = CARD_MAP.base.slice()
    const playersRef = event.data.ref.parent.child('players')
    playersRef.once('value', snapshot => {
      const players = snapshot.val()
      Object.keys(players).forEach(player => {
        const playerVal = players[player]
        const playerCard = selectRandomCard(cardMap)
        playersRef.child(player).child('card').set(playerCard)
      })
    })
    /* playerCard =*/
  }
})
