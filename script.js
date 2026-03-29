// PH Comment Generator - Gingiris
// Based on 30x daily #1 launch experience

// ===== URL FETCHING =====

document.getElementById('fetchBtn').addEventListener('click', fetchProductInfo);
document.getElementById('urlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchProductInfo();
});

async function fetchProductInfo() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    // Show loading state
    const btn = document.getElementById('fetchBtn');
    btn.querySelector('.btn-text').classList.add('hidden');
    btn.querySelector('.btn-loading').classList.remove('hidden');
    btn.disabled = true;

    try {
        let productInfo;
        
        if (isGitHubUrl(url)) {
            productInfo = await fetchGitHubInfo(url);
        } else {
            productInfo = await fetchWebsiteInfo(url);
        }

        // Fill the form
        fillForm(productInfo);
        
        // Show the form
        document.getElementById('commentForm').classList.remove('hidden');
        document.getElementById('commentForm').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Fetch error:', error);
        // Still show form with empty fields
        document.getElementById('commentForm').classList.remove('hidden');
        alert('Could not auto-fetch info. Please fill in manually.');
    } finally {
        // Reset button
        btn.querySelector('.btn-text').classList.remove('hidden');
        btn.querySelector('.btn-loading').classList.add('hidden');
        btn.disabled = false;
    }
}

function isGitHubUrl(url) {
    return url.includes('github.com/');
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
    const highlights = data.topics?.slice(0, 5).join(', ') || '';
    
    // Try to determine audience from topics/language
    let audience = 'Developers';
    if (data.topics?.some(t => ['ai', 'machine-learning', 'llm'].includes(t))) {
        audience = 'AI/ML engineers, Developers';
    } else if (data.topics?.some(t => ['saas', 'startup'].includes(t))) {
        audience = 'Startups, Tech companies';
    }

    return {
        name: data.name?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '',
        tagline: data.description || '',
        highlights: highlights,
        audience: audience,
        story: '',
        stars: data.stargazers_count,
        language: data.language
    };
}

async function fetchWebsiteInfo(url) {
    // Use a CORS proxy to fetch the page
    // Options: allorigins.win, cors-anywhere, or jina.ai reader
    
    try {
        // Try jina.ai reader first (better extraction)
        const jinaUrl = `https://r.jina.ai/${url}`;
        const response = await fetch(jinaUrl, {
            headers: { 'Accept': 'text/plain' }
        });
        
        if (response.ok) {
            const text = await response.text();
            return parseJinaResponse(text, url);
        }
    } catch (e) {
        console.log('Jina fetch failed, trying fallback');
    }

    // Fallback: try to extract from URL and basic fetch
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
            return parseHtmlContent(data.contents, url);
        }
    } catch (e) {
        console.log('Proxy fetch failed');
    }

    // Final fallback: extract from URL
    return extractFromUrl(url);
}

function parseJinaResponse(text, url) {
    const lines = text.split('\n').filter(l => l.trim());
    
    // First non-empty line is usually the title
    const name = lines[0]?.replace(/^#\s*/, '').trim() || extractFromUrl(url).name;
    
    // Look for description-like content
    let tagline = '';
    for (let i = 1; i < Math.min(lines.length, 10); i++) {
        const line = lines[i].trim();
        if (line.length > 20 && line.length < 200 && !line.startsWith('#')) {
            tagline = line;
            break;
        }
    }

    // Look for features/highlights
    const highlights = [];
    const featurePatterns = [/^[-•*]\s*(.+)/, /^✓\s*(.+)/, /^✅\s*(.+)/];
    for (const line of lines.slice(1, 30)) {
        for (const pattern of featurePatterns) {
            const match = line.match(pattern);
            if (match && match[1].length < 50) {
                highlights.push(match[1].trim());
                if (highlights.length >= 5) break;
            }
        }
        if (highlights.length >= 5) break;
    }

    return {
        name: name,
        tagline: tagline || 'A powerful tool for modern teams',
        highlights: highlights.join(', ') || 'Fast, Reliable, Easy to use',
        audience: 'Teams, Professionals',
        story: ''
    };
}

function parseHtmlContent(html, url) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Get title
    let name = doc.querySelector('title')?.textContent?.split(/[-|–]/)[0]?.trim() || '';
    
    // Get meta description
    let tagline = doc.querySelector('meta[name="description"]')?.content || 
                  doc.querySelector('meta[property="og:description"]')?.content || '';

    // Try to find features
    const highlights = [];
    doc.querySelectorAll('li, .feature, [class*="feature"]').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 5 && text.length < 50 && highlights.length < 5) {
            highlights.push(text);
        }
    });

    return {
        name: name || extractFromUrl(url).name,
        tagline: tagline.slice(0, 150),
        highlights: highlights.join(', ') || 'Fast, Reliable, Easy to use',
        audience: 'Teams, Professionals',
        story: ''
    };
}

function extractFromUrl(url) {
    try {
        const hostname = new URL(url).hostname;
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
    } catch {
        return { name: '', tagline: '', highlights: '', audience: '', story: '' };
    }
}

function fillForm(info) {
    document.getElementById('productName').value = info.name || '';
    document.getElementById('tagline').value = info.tagline || '';
    document.getElementById('highlights').value = info.highlights || '';
    document.getElementById('audience').value = info.audience || '';
    document.getElementById('story').value = info.story || '';
}

function restart() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('commentForm').classList.add('hidden');
    document.getElementById('urlInput').value = '';
    document.getElementById('urlInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== COMMENT GENERATION =====

document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateComments();
});

function generateComments() {
    const productName = document.getElementById('productName').value.trim();
    const tagline = document.getElementById('tagline').value.trim();
    const highlights = document.getElementById('highlights').value.trim();
    const audience = document.getElementById('audience').value.trim() || 'everyone';
    const story = document.getElementById('story').value.trim();
    const tone = document.getElementById('tone').value;

    const highlightList = highlights.split(',').map(h => h.trim()).filter(h => h);

    const comment1 = generateStoryDriven(productName, tagline, highlightList, audience, story, tone);
    const comment2 = generateFeatureFocused(productName, tagline, highlightList, audience, tone);
    const comment3 = generateConcise(productName, tagline, highlightList, tone);

    displayComment(1, comment1);
    displayComment(2, comment2);
    displayComment(3, comment3);

    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayComment(num, text) {
    const card = document.getElementById(`comment${num}`);
    card.querySelector('.comment-content').textContent = text;
    card.querySelector('.char-count').textContent = `${text.length} chars`;
    
    const charCount = card.querySelector('.char-count');
    if (text.length >= 300 && text.length <= 500) {
        charCount.style.color = '#10b981';
    } else if (text.length < 200 || text.length > 600) {
        charCount.style.color = '#ef4444';
    } else {
        charCount.style.color = '#f59e0b';
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
    comment += `I'm the maker of ${productName} — ${tagline}.\n\n`;
    
    if (story) {
        comment += `${story}\n\n`;
    } else {
        comment += `We built this because we saw ${audience} struggling with existing solutions. There had to be a better way.\n\n`;
    }
    
    comment += "What makes us different:\n";
    highlights.forEach((h, i) => {
        comment += `${i + 1}. ${h}\n`;
    });
    
    comment += "\n" + thanks;
    return comment;
}

function generateFeatureFocused(productName, tagline, highlights, audience, tone) {
    const greeting = getGreeting(tone);
    const cta = getCTA(tone);
    
    let comment = greeting + "\n\n";
    comment += `Introducing ${productName} — ${tagline}.\n\n`;
    comment += `Built for ${audience}, here's what you get:\n\n`;
    
    highlights.forEach(h => {
        comment += `✅ ${h}\n`;
    });
    
    comment += "\n" + cta;
    return comment;
}

function generateConcise(productName, tagline, highlights, tone) {
    const greeting = getGreeting(tone);
    const thanks = getThanks(tone);
    
    let comment = greeting + "\n\n";
    comment += `${productName}: ${tagline}.\n\n`;
    comment += "Key highlights: " + highlights.join(" • ") + "\n\n";
    comment += thanks;
    return comment;
}

function copyComment(num) {
    const text = document.querySelector(`#comment${num} .comment-content`).textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.remove('hidden');
        
        const btn = document.querySelector(`#comment${num} .btn-copy`);
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
            toast.classList.add('hidden');
            btn.textContent = '📋 Copy';
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please select and copy manually.');
    });
}
