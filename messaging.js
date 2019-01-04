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
      messageBuffer.push(new Message(text, tickerToTime(daytimeCounter)));
    }
    if (messageBuffer.length > messagesToSave) {
      messageBuffer.splice(0, 1);
    }
  }
  currentMessage.text = text;
  currentMessage.timeStamp = tickerToTime(daytimeCounter);
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

/**
 * function for instances of chibi speech
 * @param {Chibi} who - which chibi is mewing
 * @param {string} mew - the text the chibi is saying
 */
 function Speak(who, mew) {
   this.x = who.x;
   this.y = who.y;
   this.scale = who.size;
   this.who = who;
   this.mew = '*'+mew+'*';
   this.timeStamp = daytimeCounter;
   this.flagged = false;
   this.update = function () {
     this.x = this.who.x - (fontWidth * this.mew.length/2/1.5);
     this.y = this.who.y - (this.who.size*3);
     ctx.font = fontSize/1.5+'px' + ' ' + globalFont;
     ctx.fillStyle = outputArray[2];
     ctx.fillRect(this.x - 5, this.y - 10, (fontWidth * this.mew.length/1.5) + 10, 13);
     ctx.fillStyle = mixTwoColours(trueWhite, outputArray[2], 0.5);
     ctx.fillText(this.mew, this.x, this.y);
     if (daytimeCounter > this.timeStamp + 20 || daytimeCounter + 20 < this.timeStamp) {
       this.flagged = true;
     }
     ctx.font = fontSize+'px' + ' ' + globalFont;
   };
 }

function neutralWord() {
  return neutralWords[Math.round(Math.random()*(neutralWords.length-1))];
}

function angryWord() {
  return angryWords[Math.round(Math.random()*(angryWords.length-1))];
}

function happyWord() {
  return happyWords[Math.round(Math.random()*(happyWords.length-1))];
}

 const neutralWords = ['mew', 'meow', 'brrrup'];
 const angryWords = ['grrr', 'brrrbl', 'rawr'];
 const happyWords = ['prrr', 'mraow', 'owo'];
