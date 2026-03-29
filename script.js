// PH Comment Generator - Gingiris
// Based on 30x daily #1 launch experience

console.log('PH Comment Generator loaded');

// ===== URL FETCHING =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready');
    
    const fetchBtn = document.getElementById('fetchBtn');
    const urlInput = document.getElementById('urlInput');
    
    if (fetchBtn) {
        fetchBtn.addEventListener('click', function() {
            console.log('Fetch button clicked');
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

    // Show loading state
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

        // Fill the form
        fillForm(productInfo);
        
        // Show the form
        const form = document.getElementById('commentForm');
        if (form) {
            form.classList.remove('hidden');
            form.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Fetch error:', error);
        // Still show form with empty fields
        const form = document.getElementById('commentForm');
        if (form) form.classList.remove('hidden');
        alert('Could not auto-fetch info. Please fill in manually.');
    } finally {
        // Reset button
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoading) btnLoading.classList.add('hidden');
        btn.disabled = false;
    }
}

async function fetchGitHubInfo(url) {
    // Extract owner/repo from URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!match) throw new Error('Invalid GitHub URL');

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('GitHub API error');

    const data = await response.json();

    // Extract topics as highlights
    const highlights = data.topics ? data.topics.slice(0, 5).join(', ') : '';
    
    // Try to determine audience from topics/language
    let audience = 'Developers';
    if (data.topics && data.topics.some(t => ['ai', 'machine-learning', 'llm'].includes(t))) {
        audience = 'AI/ML engineers, Developers';
    } else if (data.topics && data.topics.some(t => ['saas', 'startup'].includes(t))) {
        audience = 'Startups, Tech companies';
    }

    // Format name
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
        const hostname = urlObj.hostname;
        const name = hostname
            .replace(/^www\./, '')
            .split('.')[0]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        
        return {
            name: name,
            tagline: '',
            highlights: '',
            audience: '',
            story: ''
        };
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
    const results = document.getElementById('results');
    const form = document.getElementById('commentForm');
    const urlInput = document.getElementById('urlInput');
    
    if (results) results.classList.add('hidden');
    if (form) form.classList.add('hidden');
    if (urlInput) {
        urlInput.value = '';
        urlInput.focus();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== COMMENT GENERATION =====

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
        highlightList.push('Innovative', 'Easy to use', 'Powerful');
    }

    const comment1 = generateStoryDriven(productName, tagline, highlightList, audience, story, tone);
    const comment2 = generateFeatureFocused(productName, tagline, highlightList, audience, tone);
    const comment3 = generateConcise(productName, tagline, highlightList, tone);

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
        
        if (text.length >= 300 && text.length <= 500) {
            charCount.style.color = '#10b981';
        } else if (text.length < 200 || text.length > 600) {
            charCount.style.color = '#ef4444';
        } else {
            charCount.style.color = '#f59e0b';
        }
    }
}

function getGreeting(tone) {
    const greetings = {
        friendly: ["Hey Product Hunt! 👋", "Hi PH family! 🎉", "Hello everyone! 👋"],
        professional: ["Hello Product Hunt community,", "Greetings, Product Hunt!", "Hello everyone,"],
        excited: ["OMG, we're LIVE! 🚀🎉", "IT'S HAPPENING! 🔥", "We made it to Product Hunt! 🚀"],
        humble: ["Wow, we're finally here. 🙏", "After months of work, we're live.", "Grateful to be here today."]
    };
    const options = greetings[tone] || greetings.friendly;
    return options[Math.floor(Math.random() * options.length)];
}

function getThanks(tone) {
    const thanks = {
        friendly: ["Thanks for checking us out! ❤️", "Would love to hear your thoughts!", "Thanks for the support! 🙌"],
        professional: ["We appreciate your time and feedback.", "Thank you for your consideration.", "We welcome your feedback."],
        excited: ["Can't wait to hear what you think! 🔥", "Let's gooo! Drop your feedback below! 🚀", "SO excited to hear from you all! 💥"],
        humble: ["Thank you for taking the time. 🙏", "We're grateful for any feedback.", "Thanks for giving us a chance."]
    };
    const options = thanks[tone] || thanks.friendly;
    return options[Math.floor(Math.random() * options.length)];
}

function getCTA(tone) {
    const ctas = {
        friendly: ["Try it free and let us know what you think!", "Give it a spin - we'd love your feedback!", "Check it out and share your thoughts!"],
        professional: ["We invite you to explore the product.", "Feel free to try the demo.", "We look forward to your evaluation."],
        excited: ["Dive in and tell us what you think! 🚀", "Go try it NOW! Can't wait for your feedback!", "Jump in and let's chat in the comments!"],
        humble: ["If you have a moment, we'd appreciate your thoughts.", "Would mean a lot if you could try it.", "Any feedback would be incredibly helpful."]
    };
    const options = ctas[tone] || ctas.friendly;
    return options[Math.floor(Math.random() * options.length)];
}

function generateStoryDriven(productName, tagline, highlights, audience, story, tone) {
    const greeting = getGreeting(tone);
    const thanks = getThanks(tone);
    
    let comment = greeting + "\n\n";
    comment += "I'm the maker of " + productName + " — " + tagline + ".\n\n";
    
    if (story) {
        comment += story + "\n\n";
    } else {
        comment += "We built this because we saw " + audience + " struggling with existing solutions. There had to be a better way.\n\n";
    }
    
    comment += "What makes us different:\n";
    highlights.forEach(function(h, i) {
        comment += (i + 1) + ". " + h + "\n";
    });
    
    comment += "\n" + thanks;
    return comment;
}

function generateFeatureFocused(productName, tagline, highlights, audience, tone) {
    const greeting = getGreeting(tone);
    const cta = getCTA(tone);
    
    let comment = greeting + "\n\n";
    comment += "Introducing " + productName + " — " + tagline + ".\n\n";
    comment += "Built for " + audience + ", here's what you get:\n\n";
    
    highlights.forEach(function(h) {
        comment += "✅ " + h + "\n";
    });
    
    comment += "\n" + cta;
    return comment;
}

function generateConcise(productName, tagline, highlights, tone) {
    const greeting = getGreeting(tone);
    const thanks = getThanks(tone);
    
    let comment = greeting + "\n\n";
    comment += productName + ": " + tagline + ".\n\n";
    comment += "Key highlights: " + highlights.join(" • ") + "\n\n";
    comment += thanks;
    return comment;
}

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
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please select and copy manually.');
    });
}
