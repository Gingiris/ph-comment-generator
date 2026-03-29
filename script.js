// PH Comment Generator v3 - Gingiris
// Based on REAL #1 Product Hunt comments (Clico, Chronicle, Vozo, Tobira)

console.log('PH Comment Generator v3 loaded - Real winner templates');

// ===== URL FETCHING =====

document.addEventListener('DOMContentLoaded', function() {
    const fetchBtn = document.getElementById('fetchBtn');
    const urlInput = document.getElementById('urlInput');
    
    if (fetchBtn) {
        fetchBtn.addEventListener('click', fetchProductInfo);
    }
    
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchProductInfo();
            }
        });
    }
    
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateComments();
        });
    }
});

async function fetchProductInfo() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput ? urlInput.value.trim() : '';
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    const btn = document.getElementById('fetchBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    if (btnText) btnText.classList.add('hidden');
    if (btnLoading) btnLoading.classList.remove('hidden');
    btn.disabled = true;

    try {
        let productInfo = url.includes('github.com/') 
            ? await fetchGitHubInfo(url) 
            : extractFromUrl(url);
        
        fillForm(productInfo);
        
        const form = document.getElementById('commentForm');
        if (form) {
            form.classList.remove('hidden');
            form.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('commentForm')?.classList.remove('hidden');
        alert('Could not auto-fetch. Please fill in manually.');
    } finally {
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoading) btnLoading.classList.add('hidden');
        btn.disabled = false;
    }
}

async function fetchGitHubInfo(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!match) throw new Error('Invalid GitHub URL');

    const [, owner, repo] = match;
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!response.ok) throw new Error('GitHub API error');

    const data = await response.json();
    const highlights = data.topics ? data.topics.slice(0, 5).join(', ') : '';
    
    let audience = 'developers and teams';
    const topics = data.topics || [];
    if (topics.some(t => ['ai', 'machine-learning', 'llm', 'gpt'].includes(t))) {
        audience = 'AI engineers and developers';
    } else if (topics.some(t => ['saas', 'startup', 'business'].includes(t))) {
        audience = 'startups and businesses';
    } else if (topics.some(t => ['productivity', 'notion', 'obsidian'].includes(t))) {
        audience = 'knowledge workers and creators';
    }

    return {
        name: (data.name || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        tagline: data.description || '',
        highlights: highlights,
        audience: audience,
        story: ''
    };
}

function extractFromUrl(url) {
    try {
        const name = new URL(url).hostname
            .replace(/^www\./, '')
            .split('.')[0]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        return { name, tagline: '', highlights: '', audience: '', story: '' };
    } catch (e) {
        return { name: '', tagline: '', highlights: '', audience: '', story: '' };
    }
}

function fillForm(info) {
    ['productName', 'tagline', 'highlights', 'audience', 'story'].forEach((field, i) => {
        const el = document.getElementById(field);
        const values = [info.name, info.tagline, info.highlights, info.audience, info.story];
        if (el) el.value = values[i] || '';
    });
}

function restart() {
    ['results', 'commentForm'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
    const urlInput = document.getElementById('urlInput');
    if (urlInput) { urlInput.value = ''; urlInput.focus(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== COMMENT GENERATION - Based on REAL PH #1 Winners =====

function generateComments() {
    const productName = document.getElementById('productName').value.trim();
    const tagline = document.getElementById('tagline').value.trim();
    const highlights = document.getElementById('highlights').value.trim();
    const audience = document.getElementById('audience').value.trim() || 'teams and professionals';
    const story = document.getElementById('story').value.trim();
    const makerName = document.getElementById('makerName')?.value.trim() || 'the team';

    if (!productName || !tagline) {
        alert('Please fill in Product Name and Description');
        return;
    }

    let highlightList = highlights.split(',').map(h => h.trim()).filter(h => h);
    if (highlightList.length === 0) {
        highlightList = ['Fast & intuitive', 'Saves hours of work', 'Free to try'];
    }

    // Generate 3 templates based on real winners
    const comment1 = generateFounderStory(productName, tagline, highlightList, audience, story, makerName);
    const comment2 = generateProvocateur(productName, tagline, highlightList, audience, story);
    const comment3 = generateBuilder(productName, tagline, highlightList, audience);

    displayComment(1, comment1);
    displayComment(2, comment2);
    displayComment(3, comment3);

    document.getElementById('results')?.classList.remove('hidden');
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayComment(num, text) {
    const card = document.getElementById('comment' + num);
    if (!card) return;
    
    const content = card.querySelector('.comment-content');
    const charCount = card.querySelector('.char-count');
    
    if (content) content.textContent = text;
    if (charCount) {
        const len = text.length;
        charCount.textContent = len + ' chars';
        charCount.style.color = (len >= 500 && len <= 1200) ? '#10b981' : 
                                (len < 400 || len > 1500) ? '#ef4444' : '#f59e0b';
    }
}

// ===== TEMPLATE 1: Founder Story (like Vozo, Clico) =====
function generateFounderStory(productName, tagline, highlights, audience, story, makerName) {
    let c = '';
    
    // Opening - personal intro
    c += `Hi Product Hunt! 👋\n\n`;
    c += `I'm ${makerName}, and I built **${productName}**.\n\n`;
    
    // Problem/frustration
    if (story) {
        c += `${story}\n\n`;
    } else {
        c += `We built this out of our own frustration. ${audience.charAt(0).toUpperCase() + audience.slice(1)} deserve better tools, but existing solutions were always too complicated, too expensive, or just didn't work.\n\n`;
        c += `So we decided to fix it ourselves. 🛠️\n\n`;
    }
    
    // What it is
    c += `**${productName}** is ${tagline.toLowerCase().replace(/\.$/, '')}.\n\n`;
    
    // Features with emojis (like real winners)
    c += `Here's what makes it different:\n\n`;
    const emojis = ['✨', '⚡', '🎨', '🔗', '💡'];
    highlights.forEach((h, i) => {
        c += `${emojis[i % emojis.length]} **${h}**\n`;
    });
    
    // CTA
    c += `\nWe're so excited to share this with the PH community! 🚀\n\n`;
    
    // Offer
    c += `🎁 Special for Product Hunt: Use code **HUNT20** for 20% off.\n\n`;
    
    // Engagement question (critical!)
    c += `We'd genuinely love your feedback — what feature would you want to see next? 👇`;
    
    return c;
}

// ===== TEMPLATE 2: The Provocateur (like Tobira.ai) =====
function generateProvocateur(productName, tagline, highlights, audience, story) {
    let c = '';
    
    // Bold opening statement
    c += `The way we do this is completely broken. 🔥\n\n`;
    c += `Hey PH! 👋\n\n`;
    
    // The problem (provocative)
    if (story) {
        c += `${story}\n\n`;
    } else {
        c += `I tried existing solutions. They were slow. They were clunky. They didn't actually solve the problem — they just moved it around.\n\n`;
        c += `That's when I realized: ${audience} need something fundamentally different.\n\n`;
    }
    
    // The solution
    c += `**So I built ${productName}.**\n\n`;
    c += `${tagline}.\n\n`;
    
    // How it works (bullet points like Tobira)
    c += `**How it works:**\n\n`;
    highlights.forEach(h => {
        c += `→ ${h}\n`;
    });
    
    // Social proof / early adopters
    c += `\n**Early adopters are already in:** founders, developers, teams who were tired of the old way.\n\n`;
    
    // Offer
    c += `🎁 Grab free access at launch — use code **PHHUNT** on signup.\n\n`;
    
    // Specific engagement question
    c += `What's the first thing you'd want to try? Drop it below 👇`;
    
    return c;
}

// ===== TEMPLATE 3: Public Builder (like open source launches) =====
function generateBuilder(productName, tagline, highlights, audience) {
    let c = '';
    
    // Celebration
    c += `It's finally here! 🎉\n\n`;
    
    // Gratitude
    c += `Hey PH! After months of building, **${productName}** is ready for the world.\n\n`;
    c += `First, massive thanks to everyone who gave early feedback. We couldn't have done this without you. 🙏\n\n`;
    
    // The why
    c += `**Why we built this:**\n\n`;
    c += `We believe ${audience} deserve better tools. ${tagline}.\n\n`;
    
    // What's ready
    c += `**Here's what's ready today:**\n\n`;
    highlights.forEach(h => {
        c += `✅ ${h}\n`;
    });
    
    // Roadmap + community
    c += `\nToday is just Day 1. We're shipping updates every single day.\n\n`;
    c += `But we want **YOU** to decide what comes next.\n\n`;
    
    // Vote + engagement
    c += `❓ **Vote in the comments:** What feature should we build next?\n\n`;
    
    // Offer
    c += `🎁 Exclusive PH deal: **50% off** for the first 100 users.\n\n`;
    
    // Final CTA
    c += `We're hanging out in the comments all day — let's chat! 💬`;
    
    return c;
}

// ===== Copy to Clipboard =====
function copyComment(num) {
    const card = document.getElementById('comment' + num);
    if (!card) return;
    
    const text = card.querySelector('.comment-content')?.textContent;
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        document.getElementById('toast')?.classList.remove('hidden');
        const btn = card.querySelector('.btn-copy');
        if (btn) {
            btn.textContent = '✓ Copied!';
            btn.classList.add('copied');
        }
        setTimeout(() => {
            document.getElementById('toast')?.classList.add('hidden');
            if (btn) {
                btn.textContent = '📋 Copy';
                btn.classList.remove('copied');
            }
        }, 2000);
    }).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied!');
    });
}
