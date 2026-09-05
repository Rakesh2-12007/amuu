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
    { id: "apology", title: "Apology", emoji: "🥺" },
    { id: "missing", title: "Missing You", emoji: "💗" },
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
      },
      {
        url: "images/photo5.jpg",
        title: "Peace & Playfulness",
        caption: "Googly eyes and victory signs. Matching our chaotic energy! ✌️👀"
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

  // Chat Room & Complaint Box settings
  chat: {
    title: "Our Secret Chat Room 💬",
    subtitle: "A private, real-time connection just for us two.",
    topic: "amuu_rakesh_love_chat_2026_xyz", // ntfy.sh secret topic
    pinPrompt: "This chat room is encrypted. Please enter the secret PIN in the Secret Room first to unlock it! 🔐",
    categories: [
      { id: "silly", label: "Silly 😜", bg: "bg-amber-100 text-amber-800 border-amber-200" },
      { id: "peeve", label: "Pet Peeve 🍕", bg: "bg-indigo-100 text-indigo-800 border-indigo-200" },
      { id: "annoyed", label: "Mild Annoyance 😤", bg: "bg-rose-100 text-rose-800 border-rose-200" },
      { id: "sweet", label: "Sweet Complaint 🥺", bg: "bg-pink-100 text-pink-800 border-pink-200" }
    ],
    sampleComplaints: [
      {
        id: "c_sample_1",
        sender: "Amuu",
        text: "You take way too long to reply when you say 'BRB 2 minutes'! ⏱️",
        category: "annoyed",
        time: Date.now() - 86400000,
        resolved: false
      },
      {
        id: "c_sample_2",
        sender: "Rakesh",
        text: "You send 10 messages in a row instead of one single paragraph! 😂",
        category: "silly",
        time: Date.now() - 43200000,
        resolved: true
      }
    ]
  },

  // 🥺 Cute Apology Page Settings
  apology: {
    userName: "Amuu",
    authorName: "Rakesh",
    openingDialogue: [
      "Ummm... I may have done something stupid 🥲",
      "And apparently someone deserves an apology...",
      "Who? 👀",
      "You. Obviously 😭❤️",
      "Okay okay... serious mode now."
    ],
    letterIntro: "I wrote you something...",
    letterButton: "Open it carefully 💌",
    typedMessage: `Hey you ❤️<br><br>
    I know I might have annoyed you, hurt you, made you upset, or simply acted like an idiot.<br><br>
    And jokes aside...<br><br>
    I'm genuinely sorry.<br><br>
    I never want something I did to become the reason your smile disappears.<br><br>
    You mean a lot more to me than I probably say properly.<br><br>
    So here's my tiny digital apology...<br><br>
    with approximately <strong>73% embarrassment</strong>,<br>
    <strong>22% overthinking</strong>,<br>
    and <strong>5% courage</strong> 😂❤️`,
    angryGame: {
      question: "Are you still angry with me? 🥺",
      dodgingMessages: [
        "WAIT 😭",
        "Let's discuss this peacefully.",
        "I brought virtual chocolate 🍫",
        "Look... a puppy 🐶",
        "Okay fine, you win 😭❤️"
      ],
      responseYes: "Understandable 😭 I'll keep trying.",
      responseMaybe: "PROGRESS 😭❤️"
    },
    forgiveMeter: {
      items: [
        { label: "Accept Chocolate 🍫", val: 15 },
        { label: "Accept Ice Cream 🍦", val: 20 },
        { label: "Accept Unlimited Memes 😂", val: 25 },
        { label: "Accept One Free Argument Win 😭", val: 30 },
        { label: "Accept My Apology 🥺❤️", val: 100 }
      ],
      certificateTitle: "Certificate of Forgiveness 🎓✨",
      certificateSub: "I will save this certificate for future arguments 😂❤️"
    },
    heartPuzzle: {
      title: "Fix My Mistake 🧩",
      subtitle: "Click or tap the broken heart pieces to put them back together!",
      completionMsg: "Okay... heart repaired ❤️\nNow I just need to make sure I don't break your mood again 😭"
    },
    ending: {
      line1: "One last thing...",
      line2: "I'm sorry. Properly this time. ❤️",
      line3: "No tricks.\nNo jokes.\nJust me saying that you matter to me.",
      buttonText: "Fineeee 🙄❤️",
      successMsg: "MISSION SUCCESSFUL 😭🎉"
    }
  },

  // 💗 Missing You Dashboard Settings
  missingDashboard: {
    startingMissingCount: 12847,
    increaseEveryMinutes: 0.1, // fast live increment for demonstration (ticks every ~6 sec)
    increaseByMin: 1,
    increaseByMax: 4,
    stats: [
      { id: "stat1", title: "Times I almost texted you", value: "2,341", emoji: "📱" },
      { id: "stat2", title: "Random things that reminded me of you", value: "987", emoji: "💭" },
      { id: "stat3", title: "Times I checked if you replied", value: "Definitely too many 😭", emoji: "👀" },
      { id: "stat4", title: "Songs that suddenly became about you", value: "42", emoji: "🎵" },
      { id: "stat5", title: "Times I said 'I'm not going to text first'", value: "18", emoji: "😤" },
      { id: "stat6", title: "Times I actually succeeded", value: "0 💀", emoji: "🤡" }
    ],
    levels: [
      { text: "🙂 Normal", color: "text-emerald-600", bg: "bg-emerald-100" },
      { text: "🥹 Kinda Missing You", color: "text-blue-600", bg: "bg-blue-100" },
      { text: "🥺 Missing You", color: "text-purple-600", bg: "bg-purple-100" },
      { text: "😭 Missing You A LOT", color: "text-pink-600", bg: "bg-pink-100" },
      { text: "🚨 EMERGENCY: TEXT HER", color: "text-rose-600 font-bold animate-pulse", bg: "bg-rose-100" }
    ],
    reasons: [
      "Because conversations feel different with you.",
      "Because your random messages somehow make my day better.",
      "Because annoying you is one of my favorite hobbies 😂",
      "Because you're weird... but unfortunately my favorite kind of weird.",
      "Because some people become part of your routine without you noticing.",
      "Because nobody else gets my terrible jokes like you do 🤓",
      "Because my phone feels boring when there's no notification from you.",
      "Because you listen to my random rants without judging me ☕",
      "Because you make ordinary moments feel like special memories ✨",
      "Because I saw something hilarious today and wanted to send it to you first.",
      "Because life is 100x more fun when you're around 🎈",
      "Because you have the absolute best laugh in the world 🌸",
      "Because coffee alone isn't as good as coffee with you ☕❤️",
      "Because you always know how to cheer me up when I'm stressed.",
      "Because our late-night chats are the best part of my week 🌙",
      "Because you're my favorite human to share gossip with 🤫",
      "Because you somehow tolerate my chaotic energy 😂",
      "Because you're genuinely irreplaceable.",
      "Because thinking of you automatically puts a smile on my face 😊",
      "Because you're Amuu! What other reason do I need? 💗"
    ],
    buttonMessages: [
      "Counter updated 😂",
      "As if it wasn't high enough.",
      "Okay this is becoming embarrassing.",
      "Please stop exposing me 😭",
      "Yep... still missing you! ❤️",
      "Over 9000 missing power! 💥"
    ],
    lastConversationDate: "2026-09-04T20:00:00" // Customizable ISO timestamp for last proper call/chat
  },

  // 🔔 Floating Story Notification System
  romanticNotifications: {
    enabled: true,
    intervalSeconds: 35, // Trigger a story prompt every 35 seconds
    prompts: [
      { text: "💌 New message from someone who misses you", target: "chat", icon: "💌" },
      { text: "🥺 Apology request waiting...", target: "apology", icon: "🥺" },
      { text: "💗 Missing counter updated", target: "missing", icon: "💗" },
      { text: "✨ Someone is thinking about you right now", target: "message", icon: "✨" },
      { text: "🎮 Can you beat your high score in Catch Hearts?", target: "games", icon: "🎮" },
      { text: "🌙 Have you checked Midnight Corner tonight?", target: "midnight", icon: "🌙" }
    ]
  },

  // ✨ Hidden Final Surprise
  finalSurprise: {
    unlockPrompt: "✨ You've unlocked something special...",
    title: "The Simple Truth ❤️",
    textLines: [
      "I built all these games,",
      "counters,",
      "buttons,",
      "animations,",
      "and stupid little jokes...",
      "But the actual message is pretty simple.",
      "I'm really glad you're in my life. ❤️"
    ]
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

