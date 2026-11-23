
// ========================================
// NEOcortex AI - DAY 1 APPLICATION LOGIC
// ========================================


// 1. PAGE NAVIGATION

const pageNames = {
    dashboard: "Dashboard",
    assistant: "AI Assistant",
    bursaries: "Bursary Navigator",
    checklist: "My Checklist",
    careers: "Career Guide"
};

function navigateTo(section) {

    const target = document.getElementById(section);

    if (!target) return;

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    target.classList.add("active-page");

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.section === section
        );
    });

    document.getElementById("page-heading").textContent =
        pageNames[section];

    document.getElementById("breadcrumb-name").textContent =
        pageNames[section];

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        navigateTo(button.dataset.section);
    });
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        navigateTo(button.dataset.go);
    });
});

document.getElementById("help-button").addEventListener(
    "click",
    () => navigateTo("assistant")
);


// 2. DAY 1 DEMONSTRATION AI

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

function getDemoAnswer(question) {

    const text = question.toLowerCase();

    if (text.includes("nsfas")) {
        return "NSFAS is South Africa's National Student Financial Aid Scheme. It provides financial assistance to eligible students who meet its funding requirements. Always check the official NSFAS website for current eligibility rules and application information: https://www.nsfas.org.za/";
    }

    if (text.includes("document") || text.includes("application")) {
        return "Common documents that students may need when applying for funding include identification, academic results, proof of residence and financial information. The exact requirements depend on the funding provider. Check the official application instructions before submitting.";
    }

    if (text.includes("cloud")) {
        return "Cloud computing offers several possible career paths, including Cloud Engineer, Cloud Administrator, Cloud Security Specialist and Solutions Architect. Useful foundations include networking, operating systems, Python, security and platforms such as AWS and Azure.";
    }

    if (text.includes("bursary")) {
        return "A bursary is financial assistance intended to support education. Some bursaries cover tuition, accommodation, books or other expenses. Eligibility and repayment conditions depend on the provider. Always verify the terms before applying.";
    }

    if (text.includes("career")) {
        return "You can investigate careers in cloud computing, software development, cybersecurity, data analysis and artificial intelligence. The best path depends on your interests, qualifications and skills.";
    }

    return "Thanks for your question. I am currently running in Day 1 demonstration mode. My full AI integration through AWS and Amazon Bedrock will be implemented during Day 2. I can currently demonstrate basic student-support topics such as NSFAS, bursaries, applications and cloud careers.";
}

function addChatMessage(message, type) {

    const element = document.createElement("div");

    element.className = "message " + type;

    const paragraph = document.createElement("p");

    paragraph.textContent = message;

    element.appendChild(paragraph);

    chatMessages.appendChild(element);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendDemoMessage(question) {

    if (!question.trim()) return;

    addChatMessage(question, "user-message");

    const answer = getDemoAnswer(question);

    setTimeout(() => {
        addChatMessage(answer, "bot-message");
    }, 350);
}

chatForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const question = chatInput.value.trim();

    if (!question) return;

    chatInput.value = "";

    sendDemoMessage(question);
});

document.querySelectorAll(".suggestion").forEach(button => {

    button.addEventListener("click", () => {
        sendDemoMessage(button.dataset.question);
    });

});


// 3. BURSARY NAVIGATOR

let bursaryData = [];

async function loadBursaries() {

    try {

        const response = await fetch("./data/bursaries.json");

        if (!response.ok) {
            throw new Error("Could not load bursary data");
        }

        bursaryData = await response.json();

        document.getElementById("opportunity-count").textContent =
            bursaryData.length;

        displayBursaries("all");

    } catch (error) {

        console.error("Bursary loading error:", error);

        document.getElementById("opportunity-count").textContent = "Unavailable";

        document.getElementById("bursary-results").textContent =
            "Unable to load opportunities. Please check the data file.";

    }
}

function displayBursaries(field) {

    const container = document.getElementById("bursary-results");

    container.replaceChildren();

    const matches = bursaryData.filter(item => {

        return field === "all" ||
            item.study_fields.includes(field);

    });

    if (matches.length === 0) {

        container.textContent =
            "No opportunities match this study field.";

        return;
    }

    matches.forEach(item => {

        const card = document.createElement("article");

        card.className = "result-card";

        const tag = document.createElement("span");

        tag.className = "result-tag";

        tag.textContent = item.verified
            ? "Verified listing"
            : "Demonstration data";

        const heading = document.createElement("h3");

        heading.textContent = item.name;

        const provider = document.createElement("p");

        provider.textContent = "Provider: " + item.provider;

        const fields = document.createElement("p");

        fields.textContent =
            "Study fields: " + item.study_fields.join(", ");

        const level = document.createElement("p");

        level.textContent = "Level: " + item.study_level;

        card.append(tag, heading, provider, fields, level);

        if (item.closing_date) {

            const date = document.createElement("p");

            date.textContent = "Closing date: " + item.closing_date;

            card.appendChild(date);

        }

        if (item.source) {

            const link = document.createElement("a");

            link.href = item.source;

            link.target = "_blank";

            link.rel = "noopener noreferrer";

            link.textContent = "View official information";

            card.appendChild(link);

        }

        container.appendChild(card);

    });
}

document.getElementById("find-bursaries").addEventListener(
    "click",
    () => {

        const field = document.getElementById("study-field").value;

        displayBursaries(field);

    }
);


// 4. APPLICATION CHECKLIST

const checklistDocuments = [

    "Certified copy of identity document",

    "Latest academic results",

    "Proof of residence",

    "Proof of household income",

    "Admission or registration confirmation",

    "Completed application form"

];

const STORAGE_KEY = "neocortex_checklist";

function getSavedProgress() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || {};

    } catch {

        return {};

    }

}

function updateChecklistProgress() {

    const checkboxes = document.querySelectorAll(
        ".check-item input"
    );

    const total = checkboxes.length;

    const completed = Array.from(checkboxes).filter(
        checkbox => checkbox.checked
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progress-percent").textContent =
        percentage + "%";

    document.getElementById("progress-bar").style.width =
        percentage + "%";

    document.getElementById("checklist-count").textContent =
        percentage + "%";

}

function renderChecklist() {

    const container = document.getElementById("checklist-items");

    const saved = getSavedProgress();

    container.replaceChildren();

    checklistDocuments.forEach((document, index) => {

        const label = document.createElement("label");

        label.className = "check-item";

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = saved[index] === true;

        checkbox.addEventListener("change", () => {

            const current = getSavedProgress();

            current[index] = checkbox.checked;

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(current)
            );

            updateChecklistProgress();

        });

        const text = document.createElement("span");

        text.textContent = document;

        label.append(checkbox, text);

        container.appendChild(label);

    });

    updateChecklistProgress();

}

document.getElementById("reset-checklist").addEventListener(
    "click",
    () => {

        localStorage.removeItem(STORAGE_KEY);

        renderChecklist();

    }
);


// 5. INITIALIZE APPLICATION

loadBursaries();

renderChecklist();

console.log("NEOcortex AI Day 1 application initialized.");
