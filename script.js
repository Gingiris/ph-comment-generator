// PH Comment Generator - Gingiris
// Based on 30x daily #1 launch experience

document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateComments();
});

function generateComments() {
    // Get form values
    const productName = document.getElementById('productName').value.trim();
    const tagline = document.getElementById('tagline').value.trim();
    const highlights = document.getElementById('highlights').value.trim();
    const audience = document.getElementById('audience').value.trim() || 'everyone';
    const story = document.getElementById('story').value.trim();
    const tone = document.getElementById('tone').value;

    // Parse highlights
    const highlightList = highlights.split(',').map(h => h.trim()).filter(h => h);

    // Generate three versions
    const comment1 = generateStoryDriven(productName, tagline, highlightList, audience, story, tone);
    const comment2 = generateFeatureFocused(productName, tagline, highlightList, audience, tone);
    const comment3 = generateConcise(productName, tagline, highlightList, tone);

    // Display results
    displayComment(1, comment1);
    displayComment(2, comment2);
    displayComment(3, comment3);

    // Show results section
    document.getElementById('results').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayComment(num, text) {
    const card = document.getElementById(`comment${num}`);
    card.querySelector('.comment-content').textContent = text;
    card.querySelector('.char-count').textContent = `${text.length} chars`;
    
    // Color code character count
    const charCount = card.querySelector('.char-count');
    if (text.length >= 300 && text.length <= 500) {
        charCount.style.color = '#10b981'; // green - optimal
    } else if (text.length < 200 || text.length > 600) {
        charCount.style.color = '#ef4444'; // red - needs adjustment
    } else {
        charCount.style.color = '#f59e0b'; // yellow - acceptable
    }
}

// Greeting based on tone
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

// Thanks based on tone
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

// CTA based on tone
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

// Version 1: Story-driven (longer, more personal)
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

// Version 2: Feature-focused (balanced)
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

// Version 3: Concise (short and punchy)
function generateConcise(productName, tagline, highlights, tone) {
    const greeting = getGreeting(tone);
    const thanks = getThanks(tone);
    
    let comment = greeting + "\n\n";
    
    comment += `${productName}: ${tagline}.\n\n`;
    
    comment += "Key highlights: " + highlights.join(" • ") + "\n\n";
    
    comment += thanks;
    
    return comment;
}

// Copy functionality
function copyComment(num) {
    const text = document.querySelector(`#comment${num} .comment-content`).textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show toast
        const toast = document.getElementById('toast');
        toast.classList.remove('hidden');
        
        // Change button
        const btn = document.querySelector(`#comment${num} .btn-copy`);
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        
        // Reset after 2 seconds
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

// Add some interactivity - character count preview
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
        // Could add live preview here in the future
    });
});
