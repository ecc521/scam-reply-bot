//This script will be run from a secondary Gmail account, preferable one that shares no details about you. 
//You will forward emails to this account from your primary email addresses. If an email is forwarded from one of your accounts,
//the bot will engage the spammer, and not you. All other emails coming into the bot will be treated as spam, and the bot will reply to it's sender. 

//Input your primary email addresses below:
var yourEmailAddresses = []
var replierName = "" //Name to reply using. TODO: Use the users name. 


function processNewEmails() {
  var threads = GmailApp.search('is:unread'); //TODO: Make sure this also checks spam. 

  for (var i=0; i < threads.length; i++) {
   var messages = threads[i].getMessages();

   for (var j=0; j < messages.length; j++) {
     var message = messages[j]
     
      if (message.isUnread()) {
         //process message 
        var sender = message.getFrom()
        Logger.log(sender)
        if (yourEmailAddresses.indexOf(sender) === -1) {
          //This is a scammer. Time to reply. 
          
          reply(message, threads.length)
          
        }
        else {
          //This is a forwarded message. Handle it, and re-engage the scammer. 
        }
      }
    }
  }
  
}




function reply(message, threadLength) {
  //We wan't to avoid an infinite loop replying to bounced emails, etc. Hence, we will eventually disengage. 
  //TODO: Detect when an email is not working or erroring. 
  
  var warnCount = 75 //Tell other person this is a bot
  var disengageCount = 100 //Cease all conversation
  
  if (threadLength > disengageCount) {return}
  if (threadLength > warnCount) {
    message.reply("You are being trolled by a bot. Now that " + warnCount + " emails have been sent, this conversation is being ended. ")
  }
  
    //TODO: In the future, we should try to make sure we never send the same response twice. 

    //Also, we will try to keep replies relevant. 

  var body = message.getPlainBody(); 
  
  function hasWord(word) {return body.indexOf(word) !== -1}
  
  //Inheritance Scam
  if (
    (hasWord("deceased") || hasWord("late") || hasWord("died") || hasWord("inheritance"))
    && (hasWord("kin") || hasWord("relative") || hasWord("family"))
    && threadLength === 1 //We don't want to send this in the middle. 
    ) {
      message.reply("What do I need to do in order to collect this money? ")
    }
  
  
  var phrases = [
    "How much can I reasonably expect this to cost me?",
    "How much time is it going to take me to do this?",
    "I'll get back to you when I can. I'm on a vacation, and the internet is very shaky. ",
    "How wonderful! What does it take to get started?",
    "How quickly can I expect you to reply to our communications?",
    "During what hours can you reply to me the fastest?",
    "I'm having some financial hardship right now, so any significant monetary costs are going to be a problem. ",
    "I'm currently going through the process of switching emails, so if I don't reply to your messages, please resend them. Thanks! "
  ]

  var selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)]
  
  selectedPhrase += "\n\n" + replierName
  
  //Detect if the sender challanges us as to being a bot. If so, reply with a generic phrase defending ourselves. 
  if (
    (hasWord("not a human") || hasWord("bot") || hasWord("not human") || hasWord("not a real person"))
    && (hasWord("prove") || hasWord("I think"))
  )
  {
    selectedPhrase += "\n\nFYI: I don't think I have ever been called a bot before, and certantly am not one. "
  }
  
  //Let's have something go "wrong" occasionally...
  var sendApology = false
  if (Math.random() > 0.92) {
    var randomChars;
    //We want to make sure it isn't always the same string... 
    if (Math.round(Math.random)) {
      randomChars = "euga93"
    }
    else {
      randomChars = "pksgs"
    }
    selectedPhrase += randomChars
    sendApology = true //Apologize for the characters at the end of the previous email.  
  }
  
  
  message.reply(selectedPhrase)
  if (sendApology) {
    message.reply("Sorry about the previous message. My cat jumped on my keyboard and sent it early. ")
  }
  message.markRead()
  
  
}
