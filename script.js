document.documentElement.lang = "en";
function toggleLanguage() {
    let button = document.querySelector(".language-button");
    let title = document.querySelector("#title");
    let description = document.querySelector("#description");
    let linktree = document.querySelector("#linktree");

    if (document.documentElement.lang === "fr") {
        document.documentElement.lang = "en";
        button.textContent = "Switch to French";
        title.textContent = "Website Coming Soon";
        description.textContent = "I'm working to bring you an awesome website.";
        linktree.textContent = "In the meantime, feel free to check my networks on my ";
    } else {
        document.documentElement.lang = "fr";
        button.textContent = "Switch to English";
        title.textContent = "Site en Construction";
        description.textContent = "Je travaille pour vous offrir un site web incroyable.";
        linktree.textContent = "En attendant, n'hésitez pas à consulter mes réseaux sur mon ";
    }
}