messageBuffer = [];
let currentMessage = new Message('init');

/**
* function to update the message on the UI
* @param {string} text - the message
*/
function sendMessage(text) {
  let duplicate = false;
  // stop the same message from repeating too often
  if (currentMessage.text !== text) {
    for (let i = messageBuffer.length-1; i > messageBuffer.length-11 && i >= 0; i--) {
      if (messageBuffer[i].text == text) {
        duplicate = true;
      }
    }
    if (!duplicate) {
      messageBuffer.push(new Message(text, tickerToTime()));
    }
    if (messageBuffer.length > messagesToSave) {
      messageBuffer.splice(0, 1);
    }
  }
  currentMessage.text = text;
  currentMessage.timeStamp = tickerToTime();
}

/**
* function for a message
* @param {string} text - the message
* @param {string} timeStamp - the time the mesage originated
*/
function Message(text, timeStamp) {
  this.text = text;
  this.timeStamp = timeStamp;
}
