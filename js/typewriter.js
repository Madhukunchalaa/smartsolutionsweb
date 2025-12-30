document.addEventListener("DOMContentLoaded", function () {
    const headline = document.querySelector(".float-headline h2");
    if (!headline) return;

    // Retrieve the text content structure (hardcoded for this specific design requirement to ensure control)
    // We want to replicate:
    // Smart Solutions is your agentic<br>development partner, evolving the<br>web into the <span class="text-accent">performance era.</span>
    const segments = [
        { text: "Smart Solutions is your agentic development partner, evolving the web into the ", type: "text" },
        { text: "performance era.", type: "span", className: "text-accent" },
    ];

    // Clear content initially but keep height to prevent layout shift if possible
    // For this specific design, we'll just clear it as it's below the fold usually
    headline.innerHTML = "";
    headline.style.visibility = "visible"; // Ensure it's visible when we start typing

    // Cursor Styling
    const styleId = "typewriter-cursor-style";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            .typing-cursor::after {
                content: '|';
                display: inline-block;
                animation: blink 1s step-end infinite;
                color: var(--primary-accent);
                margin-left: 2px;
                vertical-align: baseline;
            }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    headline.classList.add("typing-cursor");

    let segmentIndex = 0;
    let charIndex = 0;
    let currentContainer = headline;
    let isTyping = false;

    let typingTimeout = null;

    function clearTyping() {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
        headline.innerHTML = "";
        isTyping = false;
        segmentIndex = 0;
        charIndex = 0;
        headline.classList.remove("typing-cursor");
    }

    function type() {
        // Ensure cursor is active while typing
        if (isTyping && !headline.classList.contains("typing-cursor")) {
            headline.classList.add("typing-cursor");
        }

        if (segmentIndex >= segments.length) {
            // Animation Complete
            headline.classList.remove("typing-cursor");
            isTyping = false; // Mark as done but don't clear
            return;
        }

        const segment = segments[segmentIndex];

        // Handle Line Breaks
        if (segment.type === "br") {
            headline.appendChild(document.createElement("br"));
            segmentIndex++;
            charIndex = 0;
            currentContainer = headline;
            typingTimeout = setTimeout(type, 150); // Slight pause at line break
            return;
        }

        // Handle Span Creation
        if (segment.type === "span" && charIndex === 0) {
            const span = document.createElement("span");
            span.className = segment.className;
            headline.appendChild(span);
            currentContainer = span; // Switch typing context to the span
        } else if (segment.type === "text" && charIndex === 0) {
            currentContainer = headline; // Switch context back to main
        }

        // Type Characters
        const text = segment.text;
        if (charIndex < text.length) {
            currentContainer.append(text.charAt(charIndex));
            charIndex++;
            // Randomize typing speed slightly for realism
            const randomSpeed = 30 + Math.random() * 20;
            typingTimeout = setTimeout(type, randomSpeed);
        } else {
            // Segment complete, move to next
            segmentIndex++;
            charIndex = 0;
            typingTimeout = setTimeout(type, 50);
        }
    }

    // Trigger on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isTyping && headline.textContent === "") {
                    // Start fresh if empty
                    isTyping = true;
                    type();
                } else if (!isTyping && headline.textContent !== "") {
                    // Check if it was fully typed before, we want to RESTART it.
                    // But wait, if we scroll up and down quickly, we might want to just let it sit if it's already there?
                    // The requirement is "apply all the time when ever we visit this section".
                    // Usually this implies resetting.
                    clearTyping();
                    isTyping = true;
                    type();
                }
            } else {
                // When leaving the view, reset everything so it's ready to type again on re-entry
                clearTyping();
            }
        });
    }, { threshold: 0.5 }); // Start when 50% visible

    observer.observe(headline);
});
