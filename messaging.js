messageBuffer = [];
let currentMessage = new Message('init');

/**
* function to update the message on the UI
* @param {string} text - the message
*/
function sendMessage(text) {
  let duplicate = false;
  if (currentMessage.text !== text) {
    messageBuffer.push(new Message(text, tickerToTime(daytimeCounter)));
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
 * function for instances of chitten speech
 * @param {Chitten} who - which chitten is mewing
 * @param {string} mew - the text the chitten is saying
 */
function Speech(who, mew) {
  this.x = who.x;
  this.y = who.y;
  this.scale = who.size;
  this.who = who;
  this.colour = mixTwoColours(trueWhite, uiColourArray[2], 0.5);
  this.timeStamp = daytimeCounter;
  this.flagged = false;
  this.mew = mew;
  this.setText = function (mew) {
    ctx.font = `${UI_THEME.fonts.sizes.normal / 1.5}px ${UI_THEME.fonts.primary}`;
    this.mew = '*' + mew + '*';
    this.textWidth = ctx.measureText(this.mew).width;
  }
  this.setText(this.mew);
  this.update = function () {
    ctx.font = `${UI_THEME.fonts.sizes.normal / 1.5}px ${UI_THEME.fonts.primary}`;
    this.x = this.who.x;
    this.y = this.who.y - (this.who.size * 3);
    ctx.fillStyle = uiColourArray[2];
    ctx.fillRect(this.x - ((SPEECH.padding + this.textWidth)/2), this.y - SPEECH.padding, this.textWidth + SPEECH.padding, SPEECH.height);
    ctx.fillStyle = UI_THEME.colours.primary;
    ctx.fillText(this.mew, this.x - this.textWidth/2, this.y);
    if (daytimeCounter > this.timeStamp + speechDuration || daytimeCounter + speechDuration < this.timeStamp) {
      this.flagged = true;
    }
    ctx.font = `${UI_THEME.fonts.sizes.normal}px ${UI_THEME.fonts.primary}`;
  };
}

function neutralWord() {
  return neutralWords[Math.round(Math.random() * (neutralWords.length - 1))];
}

function angryWord() {
  return angryWords[Math.round(Math.random() * (angryWords.length - 1))];
}

function happyWord() {
  return happyWords[Math.round(Math.random() * (happyWords.length - 1))];
}

const neutralWords = ['mew', 'meow', 'brrrup', 'miau', 'nyan'];
const angryWords = ['grrr', 'brrrbl', 'rawr'];
const happyWords = ['prrr', 'mraow', 'owo'];
