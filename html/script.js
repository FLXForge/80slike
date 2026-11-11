
const translations = {
    en: {
        collectionTitle: "THE COLLECTION",
        collectionLead: "Step inside an arcade from another time.",
        collectionText:
            "A corridor of arcade machines, familiar sensations " +
            "and unexpected discoveries. Simple rules, immediate " +
            "challenges and a few secrets waiting to be found.",
        collectionClosing:
            "Insert a coin. Choose a machine. Just play.",

        conceptTitle: "BEHIND THE PIXELS",
        conceptLead: "More than a collection. A small experiment.",
        conceptText:
            "Every game in this collection was created using " +
            "FLX Engine, a lightweight, open-source 2D game engine " +
            "built around declarative definitions and JavaScript.",
        creatorText:
            "FLX Engine and this collection are personal projects " +
            "by Ra-Hok, created out of curiosity, experimentation " +
            "and a love of video games.",
        engineLink: "DISCOVER THE ENGINE",

        downloadTitle: "GET THE COLLECTION",
        downloadLead: "Free to play. Made to be shared.",
        releaseText: "Available November 20, 2026.",
        storeSoon: "AVAILABLE NOVEMBER 20",
        soundtrackTitle: "ORIGINAL SOUNDTRACK",
        soundtrackText:
            "The music of the collection is also available " +
            "as a free download.",
        soundtrackLink: "GET THE SOUNDTRACK",

        versionsTitle: "VERSION HISTORY",
        version101:
            "Initial public release. Improved runtime " +
            "compatibility and diagnostic reporting.",

        footerText: "A personal experiment powered by FLX Engine."
    },

    es: {
        collectionTitle: "LA COLECCIÓN",
        collectionLead: "Entra en un salón recreativo de otra época.",
        collectionText:
            "Un pasillo de máquinas recreativas, sensaciones " +
            "familiares y descubrimientos inesperados. Reglas " +
            "sencillas, desafíos inmediatos y algunos secretos " +
            "esperando a ser descubiertos.",
        collectionClosing:
            "Introduce una moneda. Elige una máquina. Juega.",

        conceptTitle: "DETRÁS DE LOS PÍXELES",
        conceptLead: "Más que una colección. Un pequeño experimento.",
        conceptText:
            "Todos los juegos de esta colección han sido creados " +
            "con FLX Engine, un motor 2D ligero y de código abierto " +
            "basado en definiciones declarativas y JavaScript.",
        creatorText:
            "FLX Engine y esta colección son proyectos personales " +
            "de Ra-Hok, nacidos de la curiosidad, la experimentación " +
            "y el amor por los videojuegos.",
        engineLink: "DESCUBRE EL MOTOR",

        downloadTitle: "DESCARGAR LA COLECCIÓN",
        downloadLead: "Gratis para jugar. Creada para compartir.",
        releaseText: "Disponible el 20 de noviembre de 2026.",
        storeSoon: "DISPONIBLE EL 20 DE NOVIEMBRE",
        soundtrackTitle: "BANDA SONORA ORIGINAL",
        soundtrackText:
            "La música de la colección también está " +
            "disponible para descargar gratuitamente.",
        soundtrackLink: "DESCARGAR BANDA SONORA",

        versionsTitle: "HISTORIAL DE VERSIONES",
        version101:
            "Primera versión pública. Mejoras de compatibilidad " +
            "del motor y del sistema de diagnóstico.",

        footerText: "Un experimento personal creado con FLX Engine."
    }
};

function setLanguage(language) {
    const dictionary = translations[language];

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (dictionary[key]) {
            element.textContent = dictionary[key];
        }
    });

    document.querySelectorAll(".language-selector button")
        .forEach(button => button.classList.remove("active"));

    document.getElementById("btn-" + language)
        .classList.add("active");
}

document.getElementById("btn-en")
    .addEventListener("click", () => setLanguage("en"));

document.getElementById("btn-es")
    .addEventListener("click", () => setLanguage("es"));

// Disable the Store link until the public URL is configured.
document.getElementById("store-link")
    .addEventListener("click", event => {
        if (event.currentTarget.getAttribute("aria-disabled") === "true") {
            event.preventDefault();
        }
    });
