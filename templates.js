// Real PH #1 Winner Templates - Based on actual top-performing comments
// Analyzed from: Clico, Vozo, Chronicle 2.0, Tobira.ai, and more

const REAL_TEMPLATES = {
    // Template 1: The Founder Story (like Vozo, Clico)
    founderStory: {
        name: "Founder Story",
        emoji: "👤",
        bestFor: "Solo founders, ex-FAANG, strong personal brand",
        structure: [
            "greeting", // "Hi Product Hunt! [Name] here, founder of [Product]."
            "credibility", // Background/credentials (optional)
            "problem", // "We built this because..."
            "solution", // What the product does
            "features", // 2-4 key features with emojis
            "cta", // Free trial/beta access
            "question" // Engagement question
        ]
    },
    
    // Template 2: The Comeback/Update (like Chronicle 2.0)
    comeback: {
        name: "The Comeback",
        emoji: "🔄",
        bestFor: "V2 launches, products with existing traction",
        structure: [
            "celebration", // "Hey PH family 👋 We're back!"
            "social_proof", // Previous achievements
            "feedback_driven", // "You told us X, we built Y"
            "features", // What's new
            "thanks", // Hunter shoutout, community thanks
            "offer", // Promo code
            "question" // "What should we build next?"
        ]
    },
    
    // Template 3: The Provocateur (like Tobira.ai)
    provocateur: {
        name: "The Provocateur",
        emoji: "🔥",
        bestFor: "New category, challenging status quo",
        structure: [
            "bold_statement", // Provocative opening
            "failed_alternatives", // "I tried X and Y but..."
            "insight", // "That's when I realized..."
            "solution", // How it works (bullets)
            "early_adopters", // Who's already in
            "offer", // Free access/promo
            "question" // Specific engagement question
        ]
    },
    
    // Template 4: The Builder (like many open source launches)
    builder: {
        name: "Public Builder",
        emoji: "🛠️",
        bestFor: "Open source, community-driven, beta launches",
        structure: [
            "excitement", // "It's finally here! 🎉"
            "gratitude", // Thanks to beta testers
            "why", // Philosophy/belief
            "features", // What's ready
            "roadmap", // What's coming
            "community", // Discord/Slack link
            "vote" // "Vote for the next feature"
        ]
    }
};

// Emoji sets for features
const FEATURE_EMOJIS = {
    speed: ['⚡', '🚀', '💨'],
    quality: ['✨', '💎', '🎨'],
    integration: ['🔗', '🔌', '🤝'],
    security: ['🛡️', '🔒', '🔐'],
    ai: ['🤖', '🧠', '💡'],
    data: ['📊', '📈', '📉'],
    export: ['📤', '💾', '🗃️'],
    collab: ['👥', '🤝', '💬'],
    free: ['🆓', '🎁', '💝'],
    new: ['✴️', '🆕', '⭐']
};

// Greetings based on tone
const GREETINGS = {
    friendly: [
        "Hey Product Hunt! 👋",
        "Hi PH community! 🎉",
        "Hello everyone! 👋"
    ],
    professional: [
        "Hello Product Hunt,",
        "Greetings, Product Hunt community.",
        "Hello everyone,"
    ],
    excited: [
        "OMG, we're finally LIVE! 🚀🎉",
        "IT'S HAPPENING! 🔥",
        "The wait is over! 🚀"
    ],
    humble: [
        "Wow, we're finally here. 🙏",
        "After months of work, we made it.",
        "Grateful to share this with you today."
    ],
    comeback: [
        "Hey PH family 👋 We're back!",
        "Hello again, Product Hunt! 🎉",
        "We're back with something big! 🚀"
    ]
};

// Engagement questions
const QUESTIONS = {
    feature: [
        "What feature would you want to see next?",
        "Which of these features would save you the most time?",
        "What should we build next? 👇"
    ],
    usage: [
        "How would you use this in your workflow?",
        "What's the first thing you'd try?",
        "Try it and tell us — is it faster than your current workflow?"
    ],
    feedback: [
        "We'd genuinely love your thoughts. What do you think?",
        "Let us know what you think in the comments! 👇",
        "Drop your feedback below — we're reading every comment!"
    ],
    specific: [
        "What's the first [X] you'd want to [action]?",
        "Have you experienced this problem before?",
        "What's your biggest challenge with [category]?"
    ]
};

// Promo code templates
const PROMO_TEMPLATES = [
    "Use code **HUNT20** for 20% off.",
    "Special for PH: Use code **PHPRO** for 1 month free.",
    "🎁 Use code **LAUNCH** for exclusive early access!",
    "As a thank you to PH: **50% off** for the first 100 users."
];

module.exports = { REAL_TEMPLATES, FEATURE_EMOJIS, GREETINGS, QUESTIONS, PROMO_TEMPLATES };
