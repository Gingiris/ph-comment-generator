// PH Comment Generator - Gingiris
// Based on 30x daily #1 launch experience + real winner templates

console.log('PH Comment Generator v2 loaded');

// ===== URL FETCHING =====

document.addEventListener('DOMContentLoaded', function() {
    const fetchBtn = document.getElementById('fetchBtn');
    const urlInput = document.getElementById('urlInput');
    
    if (fetchBtn) {
        fetchBtn.addEventListener('click', function() {
            fetchProductInfo();
        });
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
        let productInfo;
        
        if (url.includes('github.com/')) {
            productInfo = await fetchGitHubInfo(url);
        } else {
            productInfo = extractFromUrl(url);
        }

        fillForm(productInfo);
        
        const form = document.getElementById('commentForm');
        if (form) {
            form.classList.remove('hidden');
            form.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Fetch error:', error);
        const form = document.getElementById('commentForm');
        if (form) form.classList.remove('hidden');
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
    if (data.topics && data.topics.some(t => ['ai', 'machine-learning', 'llm', 'gpt'].includes(t))) {
        audience = 'AI engineers and developers';
    } else if (data.topics && data.topics.some(t => ['saas', 'startup', 'business'].includes(t))) {
        audience = 'startups and businesses';
    } else if (data.topics && data.topics.some(t => ['productivity', 'notion', 'obsidian'].includes(t))) {
        audience = 'knowledge workers and creators';
    }

    let name = data.name || '';
    name = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
        name: name,
        tagline: data.description || '',
        highlights: highlights,
        audience: audience,
        story: ''
    };
}

function extractFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const name = urlObj.hostname
            .replace(/^www\./, '')
            .split('.')[0]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        
        return { name: name, tagline: '', highlights: '', audience: '', story: '' };
    } catch (e) {
        return { name: '', tagline: '', highlights: '', audience: '', story: '' };
    }
}

function fillForm(info) {
    const fields = ['productName', 'tagline', 'highlights', 'audience', 'story'];
    const values = [info.name, info.tagline, info.highlights, info.audience, info.story];
    fields.forEach((field, i) => {
        const el = document.getElementById(field);
        if (el) el.value = values[i] || '';
    });
}

function restart() {
    ['results', 'commentForm'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const urlInput = document.getElementById('urlInput');
    if (urlInput) { urlInput.value = ''; urlInput.focus(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== COMMENT GENERATION (Based on Real PH #1 Templates) =====

function generateComments() {
    const productName = document.getElementById('productName').value.trim();
    const tagline = document.getElementById('tagline').value.trim();
    const highlights = document.getElementById('highlights').value.trim();
    const audience = document.getElementById('audience').value.trim() || 'everyone';
    const story = document.getElementById('story').value.trim();
    const tone = document.getElementById('tone').value;

    if (!productName || !tagline) {
        alert('Please fill in Product Name and Description');
        return;
    }

    const highlightList = highlights.split(',').map(h => h.trim()).filter(h => h);
    if (highlightList.length === 0) {
        highlightList.push('Fast & intuitive', 'Saves hours of work', 'Free to try');
    }

    // Three templates based on real PH #1 winners
    const comment1 = generateScratchItch(productName, tagline, highlightList, audience, story, tone);
    const comment2 = generateFeaturePowerhouse(productName, tagline, highlightList, audience, tone);
    const comment3 = generatePublicBuilder(productName, tagline, highlightList, audience, tone);

    displayComment(1, comment1);
    displayComment(2, comment2);
    displayComment(3, comment3);

    const results = document.getElementById('results');
    if (results) {
        results.classList.remove('hidden');
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function displayComment(num, text) {
    const card = document.getElementById('comment' + num);
    if (!card) return;
    
    const content = card.querySelector('.comment-content');
    const charCount = card.querySelector('.char-count');
    
    if (content) content.textContent = text;
    if (charCount) {
        charCount.textContent = text.length + ' chars';
        if (text.length >= 400 && text.length <= 800) {
            charCount.style.color = '#10b981'; // optimal
        } else if (text.length < 300 || text.length > 1000) {
            charCount.style.color = '#ef4444'; // needs work
        } else {
            charCount.style.color = '#f59e0b'; // acceptable
        }
    }
}

// Template A: "Scratch Your Own Itch" - Origin Story Focus
function generateScratchItch(productName, tagline, highlights, audience, story, tone) {
    let comment = '';
    
    // Hook (first 2 lines visible before "Read More")
    comment += `Hi Hunters! 👋\n\n`;
    comment += `I'm the maker behind ${productName}. I built this because I was tired of the broken way we handle this problem.\n\n`;
    
    // The Story
    if (story) {
        comment += `${story}\n\n`;
    } else {
        comment += `For months, I struggled with existing solutions. They were either too expensive, too complicated, or just didn't work for ${audience}.\n\n`;
        comment += `So I decided to fix it myself. 🛠️\n\n`;
    }
    
    // The Solution
    comment += `**${productName}** is ${tagline.toLowerCase()}.\n\n`;
    comment += `Here's what makes it different:\n\n`;
    
    highlights.forEach(h => {
        comment += `✅ ${h}\n`;
    });
    
    // The Ask (engagement bait)
    comment += `\nI'm genuinely nervous and excited to hear what you think!\n\n`;
    comment += `👉 **Quick question:** Which of these features would save you the most time?\n\n`;
    
    // The Deal
    comment += `To thank the PH community, use code **HUNT20** for 20% off.\n\n`;
    comment += `Let me know your thoughts below! 👇`;
    
    return comment;
}

// Template B: "Feature Powerhouse" - Utility & Speed Focus
function generateFeaturePowerhouse(productName, tagline, highlights, audience, tone) {
    let comment = '';
    
    // Hook
    comment += `The way we do this is broken. Today, we're changing that. 🚀\n\n`;
    
    // Context
    comment += `Hey everyone! Team ${productName} here.\n\n`;
    comment += `We realized that ${audience} waste hours every week on tasks that should take minutes.\n\n`;
    
    // Solution
    comment += `Meet **${productName}** — ${tagline}.\n\n`;
    
    // Features with visual formatting
    comment += `Here's what's under the hood:\n\n`;
    
    const emojis = ['⚡', '🎨', '🔗', '🛡️', '💡'];
    highlights.forEach((h, i) => {
        comment += `${emojis[i % emojis.length]} **${h}**\n`;
    });
    
    // Demo callout
    comment += `\nIf you watched the demo video above, you saw it in action. What usually takes hours now takes seconds.\n\n`;
    
    // CTA with engagement
    comment += `We're hanging out in the comments all day! 💬\n\n`;
    comment += `**Challenge:** Try the free version and tell us — is it faster than your current workflow?\n\n`;
    comment += `Let's chat! 👇`;
    
    return comment;
}

// Template C: "Public Builder" - Community Co-Creation Focus
function generatePublicBuilder(productName, tagline, highlights, audience, tone) {
    let comment = '';
    
    // Hook
    comment += `It's finally here! 🎉\n\n`;
    
    // Gratitude
    comment += `Hi Hunters! After months of building in public, ${productName} is ready for the world.\n\n`;
    comment += `First, a massive shoutout to everyone who gave early feedback. We couldn't have done this without you. 🙏\n\n`;
    
    // The Why
    comment += `**Why we built this:**\n\n`;
    comment += `We believe ${audience} deserve better tools. ${tagline}.\n\n`;
    
    // Current state
    comment += `Today is just Day 1. Here's what's ready:\n\n`;
    
    highlights.forEach(h => {
        comment += `→ ${h}\n`;
    });
    
    // Roadmap + engagement
    comment += `\nBut we want YOU to decide what comes next.\n\n`;
    comment += `❓ **Vote in the comments:** What feature should we build next?\n\n`;
    
    // Offer
    comment += `Grab the exclusive PH deal: **50% off** for the first 100 users.\n\n`;
    comment += `Drop your vote below! 👇`;
    
    return comment;
}

// Copy functionality
function copyComment(num) {
    const card = document.getElementById('comment' + num);
    if (!card) return;
    
    const content = card.querySelector('.comment-content');
    if (!content) return;
    
    const text = content.textContent;
    
    navigator.clipboard.writeText(text).then(function() {
        const toast = document.getElementById('toast');
        if (toast) toast.classList.remove('hidden');
        
        const btn = card.querySelector('.btn-copy');
        if (btn) {
            btn.textContent = '✓ Copied!';
            btn.classList.add('copied');
        }
        
        setTimeout(function() {
            if (toast) toast.classList.add('hidden');
            if (btn) {
                btn.textContent = '📋 Copy';
                btn.classList.remove('copied');
            }
        }, 2000);
    }).catch(function(err) {
        console.error('Copy failed:', err);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied!');
    });
}
