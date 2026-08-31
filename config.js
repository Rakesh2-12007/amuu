// =================================================================
// 💖 ROMANTIC WEBSITE CONFIGURATION FILE 💖
// =================================================================
// Edit any text, options, emojis, or messages below to customize the
// website specifically for your friend! Everything updates automatically.

const romanticConfig = {
  // Global settings
  friendName: "Amuu", 
  
  // Landing Page / Intro screen
  landing: {
    heading: "Hey You... 💗",
    subtitle: "I made a little something for someone special.",
    buttonText: "Enter My Little World ✨",
  },

  // Main Navigation emoji and titles
  nav: [
    { id: "message", title: "A Little Message", emoji: "💌" },
    { id: "games", title: "Let's Play", emoji: "🎮" },
    { id: "secret", title: "Secret Room", emoji: "🔐" },
    { id: "chat", title: "Our Chat", emoji: "💬" },
    { id: "quiz", title: "Our Mini Quiz", emoji: "🧩" },
    { id: "midnight", title: "Midnight Corner", emoji: "🌙" },
    { id: "surprise", title: "Surprise", emoji: "💖" },
    { id: "timeline", title: "Memory Lane", emoji: "📖" }
  ],

  // 💌 A Little Message Section
  message: {
    envelopeText: "You have a message waiting for you...",
    clickToOpenText: "Click the letter to open",
    // Typewriter message (you can use HTML tags like <br> for line breaks)
    typedMessage: `Hey there,<br><br>
    I wanted to make something unique for you. A little corner on the internet that belongs entirely to us and our memories.<br><br>
    You are one of the most incredible, funny, and beautiful people in my life. This website is just a tiny way to remind you of how much you mean to me, even on ordinary days.<br><br>
    I hope these games make you laugh, the quiz makes you smile, and the midnight section brings you comfort when you need it.<br><br>
    Thank you for being such an amazing friend. ❤️`,
    readAgainText: "Read Again ❤️"
  },

  // 🎮 Let's Play (Mini-Game Arcade) Settings
  games: {
    catchHearts: {
      instructions: "Hearts are falling from the sky! Tap them to collect points before the timer runs out. Collect at least 20 to win!",
      duration: 30, // seconds
      targetScore: 20,
    },
    escapeHeart: {
      instructions: "This little heart is shy! Try to tap it 10 times. Warning: It gets faster and slipperier every time you touch it!",
      targetScore: 10,
      funnyMessages: [
        "A bit slow, try again! 🐌",
        "Almost had it! 😉",
        "Whoa, speedy! ⚡",
        "Hey! Stop running away! 🏃‍♀️💨",
        "It's dodging you like a pro! 😲",
        "Aha! Caught you! 🎉",
        "Okay, you have fast fingers! 👀❤️"
      ]
    },
    memoryGame: {
      instructions: "Match the pairs of cute symbols. Finish in under 20 moves for a perfect score!",
      // Must contain an even number of elements (8 pairs = 16 cards total)
      symbols: ["🌸", "🧸", "🐱", "🍩", "🎀", "🍦", "✨", "🐼"]
    },
    lovePuzzle: {
      instructions: "Rearrange the sliding tiles to reveal a beautiful secret greeting!",
      // 3x3 grid tiles. The 9th tile will be blank. We use a split greeting message.
      solvedMessage: "🧩 You solved the puzzle! You fit perfectly in my life. ❤️"
    },
    winScreenMessage: "Congratulations! You completed all the games! You are officially the champion! 🏆🥰"
  },

  // 🔐 Secret Room Settings
  secretRoom: {
    promptText: "Some things are meant to stay between us... 🔐",
    pinPlaceholder: "Enter 4-Digit Secret PIN",
    // CHANGE THIS PIN to whatever you want her to type! (Default: 1207)
    correctPin: "1207",
    
    // Fake hacker/classified terminal log messages on unlock
    terminalMessages: [
      "ESTABLISHING SECURE CONNECTION...",
      "BYPASSING HEART-WALL PROTOCOLS...",
      "ACCESS GRANTED. DECRYPTING INSIDE JOKES...",
      "WELCOME TO THE SECRET SIDE OF THE WEBSITE."
    ],
    
    // List of inside jokes to display in the secret room
    insideJokes: [
      "Remember that time we argued for 30 minutes about whether soup is a drink? (It's not. 🍲)",
      "Your coffee order is so complicated it requires a PhD to understand. ☕",
      "That face you make when you're trying to pretend you're not lost. 🗺️",
      "The 'five more minutes' promise that actually means two hours.",
      "How you reply to texts in your head but forget to actually type and send them."
    ],

    // Photos/Memories to display. You can replace file paths with real image links (e.g. photos/pic1.jpg or URLs)
    // For now, we will render a beautiful placeholder illustration if image fails to load.
    photos: [
      {
        url: "images/photo1.jpg",
        title: "Half Hearts Combine",
        caption: "Two fingers, one sweet heart. Look how we complete it. ❤️"
      },
      {
        url: "images/photo2.jpg",
        title: "Mini Finger Hearts",
        caption: "Double the cute, double the love! 🌸"
      },
      {
        url: "images/photo3.jpg",
        title: "Matching Half Hearts",
        caption: "Matching energy and cute double checks. 🌌"
      },
      {
        url: "images/photo4.jpg",
        title: "Point Connection Spark",
        caption: "Boop! Connecting our worlds together. ⚡"
      }
    ],

    // Confidential personal letters/notes
    notes: [
      {
        title: "A Promise",
        text: "No matter how busy life gets, or where we end up, I'll always be here to listen, to laugh with you, and to have your back. That's a lifetime guarantee."
      },
      {
        title: "Why You're Special",
        text: "You have this rare ability to make a bad day feel completely fine just by being yourself. Never change your crazy, wonderful energy."
      }
    ]
  },

  // 🧩 Mini Quiz Questions
  quiz: {
    instructions: "Let's see how well you actually know our friendship! Ready? 😉",
    questions: [
      {
        question: "Who is more likely to start a random conversation at 2 AM?",
        options: ["You", "Me", "Both of us (we are sleepless)", "A random cat"],
        correctIndex: 2,
        explanation: "Honestly, our late-night thoughts are unpredictable!"
      },
      {
        question: "Who replies faster to messages?",
        options: ["You (instant typing speed)", "Me (trying my best)", "Depends on the mood", "We both leave each other on read"],
        correctIndex: 0,
        explanation: "You have speed-demon texting hands!"
      },
      {
        question: "Who is more dramatic when telling a story?",
        options: ["You (with full hand gestures)", "Me (the silent observer)", "We both deserve an Oscar 🏆", "None, we are extremely calm"],
        correctIndex: 2,
        explanation: "Our storytelling deserves full theatrical production value."
      },
      {
        question: "Who would survive longer without talking?",
        options: ["You (social butterfly)", "Me (enjoys silence)", "Neither, we talk way too much", "A plant"],
        correctIndex: 1,
        explanation: "I could survive a bit longer, but I'd miss talking to you instantly!"
      },
      {
        question: "Who knows the other person better?",
        options: ["You do, obviously", "I do, 100%", "It's a perfect tie! 🤝", "We are still figuring each other out"],
        correctIndex: 2,
        explanation: "We are practically reading each other's minds at this point!"
      }
    ],
    // Score results descriptions based on percentage correct
    results: {
      perfect: "Okay... you actually know me and our bond perfectly! You're a mind reader 👀❤️",
      good: "Not bad at all! You got most of them right. You pay attention! 🥰",
      average: "You got some! Guess we need to spend more time hanging out and talking. 😉",
      low: "Uh oh... do we even know each other? Just kidding! Let's play again. 😂"
    }
  },

  // 🌙 Midnight Corner Settings
  midnightCorner: {
    title: "Things We Don't Say Out Loud 🌙",
    subtitle: "A quiet space for thoughts, wishes, and reminders. Open these whenever you need them.",
    cards: [
      {
        trigger: "Open when you're sad 🌧️",
        heading: "A Little Reminder...",
        message: "Hey, it's okay to have bad days. You don't have to be strong all the time. Take a deep breath, eat your favorite snack, and remember that you are incredibly valued and loved. I am just a message away if you need to vent or sit in silence."
      },
      {
        trigger: "Open when you miss me 🌌",
        heading: "Across the Distance",
        message: "If you're reading this, I'm probably thinking of you too! Close your eyes and remember our funniest laugh. Distance or time doesn't change anything; our bond is locked in. Let's plan our next hangout soon!"
      },
      {
        trigger: "Open when you need a smile 😊",
        heading: "Just to Make You Giggle",
        message: "Did you know that sea otters hold hands when they sleep so they don't drift apart? Also, remember that time you laughed so hard that you snorted? Yeah, that's my favorite memory. Keep smiling, you look beautiful doing it!"
      },
      {
        trigger: "Open when you feel overwhelmed 🧘‍♀️",
        heading: "One Step at a Time",
        message: "Stop. Unclench your jaw. Drop your shoulders. Inhale for 4 seconds, hold for 4, exhale for 4. Whatever is stressing you out right now will pass. You have survived 100% of your hardest days. You've got this, and I've got you."
      }
    ]
  },

  // 💖 Surprise Section Settings
  surprise: {
    buttonText: "DO NOT CLICK THIS BUTTON 🛑",
    stages: [
      "Wait... didn't I tell you not to click it? 🤨",
      "Seriously, stop clicking! Things might break... ⚠️",
      "Fine... you asked for it. Prepare yourself in 3...",
      "2...",
      "1..."
    ],
    surpriseTitle: "Surprise! You actually clicked it 😂❤️",
    surpriseText: `Congratulations, curiosity won! But since you're here, I wanted to say something sincere. 

    Having you in my life makes everything a lot brighter. You are a wonderful combination of chaotic, sweet, caring, and hilariously funny. 

    Thank you for all the laughs, the late-night chats, the support, and for just being you. Here is a little virtual hug from me to you! 🫂✨`,
  },

  // 📖 Memory Lane Timeline
  memoryLane: [
    {
      title: "First Conversation",
      date: "The Spark ⚡",
      description: "That very first conversation where we clicked instantly. Who knew a simple greeting would lead to all of this?",
      emoji: "👋"
    },
    {
      title: "First Inside Joke",
      date: "The Laughs Begin 😂",
      description: "The moment we laughed so hard at something that nobody else understood. The start of our own private language.",
      emoji: "🤫"
    },
    {
      title: "That Random Day",
      date: "Unplanned Magic 🗺️",
      description: "An ordinary day that turned into a core memory just because we spent it talking, wandering around, or doing absolutely nothing together.",
      emoji: "🌟"
    },
    {
      title: "Best Memory",
      date: "Pure Joy ✨",
      description: "One of those milestones where we stood together, shared our dreams, and realized how rare and special our friendship really is.",
      emoji: "🏆"
    },
    {
      title: "Today",
      date: "Right Now 📍",
      description: "Here we are, exploring this little digital world. I'm so grateful for how far we've come and the daily smiles we share.",
      emoji: "💖"
    },
    {
      title: "To Be Continued...",
      date: "The Future 🚀",
      description: "There are so many more adventures, jokes, coffee runs, and late-night calls waiting for us. This timeline has infinite empty pages left.",
      emoji: "✨"
    }
  ],

  // ✨ Easter Eggs Config
  easterEggs: {
    clicksToSecret: 5,
    secretWord: "love",
    devNote: `✨ DEVELOPER'S NOTE FOR AMUU ✨
    
If you're reading this, you found the hidden console/secret note! 
This entire site was custom-coded line by line to make you smile. 
No templates, no boring structures — just pure, dedicated effort for a special friend.
    
Thank you for being such an inspiration. Keep shining! 🌟`
  },

  // Chat Room settings
  chat: {
    title: "Our Secret Chat Room 💬",
    subtitle: "A private, real-time connection just for us two.",
    topic: "amuu_rakesh_love_chat_2026_xyz", // ntfy.sh secret topic
    pinPrompt: "This chat room is encrypted. Please enter the secret PIN in the Secret Room first to unlock it! 🔐"
  },

  // 💕 Final Screen / Outro
  finalScreen: {
    line1: "Maybe this website isn't perfect...",
    line2: "But I made every little part of it with you in mind. ❤️",
    line3: "Thanks for being you.",
    resetButton: "Start Again ✨"
  }
};

// Export to window so script.js can access it directly in the browser
window.romanticConfig = romanticConfig;
