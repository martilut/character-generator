let currentClass = null;

async function fetchRandomObject(apiURL, objectName) {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch random ${objectName}: 
                ${response.status} ${response.statusText}`
            );
        }
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.count);
        if (objectName === 'class') {
            currentClass = data.results[randomIndex].index;
        }
        return data.results[randomIndex];
    } catch (error) {
        console.error(`Error fetching random ${objectName}:`, error);
        return null;
    }
}

function renderInfo(object, objectName, errorMessage=null) {
    const objectInfoContainer
        = document.getElementById(`${objectName}Info`);
    if (object) {
        objectInfoContainer.innerHTML = `
            <p>${object.name}</p>
        `;
    } else {
        if (errorMessage !== null) {
            objectInfoContainer.innerHTML = errorMessage
        } else {
            objectInfoContainer.innerHTML =
                `Failed to fetch ${objectName} information`
        }
    }
}

function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

function rollCharacteristics() {
    const rolls = [];
    for (let i = 0; i < 4; i++) {
        rolls.push(rollDie());
    }
    rolls.sort();
    let result = 0;
    for (let i = 1; i < 4; i++) {
        result = result + rolls[i]
    }
    return result;
}

function generateCharacteristics() {
    const characteristics = [];
    for (let i = 0; i < 6; i++) {
        characteristics.push(rollCharacteristics());
    }
    return {"name": characteristics.toString()};
}



document.getElementById('fetchRandomRaceButton').addEventListener(
    'click', async () => {
        const race = await fetchRandomObject(
            'https://www.dnd5eapi.co/api/races',
            'race'
        );
        renderInfo(race, "race");
    });

document.getElementById('fetchRandomClassButton').addEventListener(
    'click', async () => {
    const charClass = await fetchRandomObject(
        'https://www.dnd5eapi.co/api/classes/',
        'class'
        );
    renderInfo(charClass, 'class');
});

document.getElementById('fetchRandomSubclassButton').addEventListener(
    'click', async () => {
    const subclass = await fetchRandomObject(
        `https://www.dnd5eapi.co/api/classes/${currentClass}/subclasses`,
        'subclass'
    );
    renderInfo(subclass, 'subclass', 'Generate class first');
});

document.getElementById('fetchRandomAlignmentButton').addEventListener(
    'click', async () => {
    const alignment = await fetchRandomObject(
        `https://www.dnd5eapi.co/api/alignments`,
        'alignment'
    );
    renderInfo(alignment, 'alignment');
});

document.getElementById('fetchRandomLanguageButton').addEventListener(
    'click', async () => {
    const language = await fetchRandomObject(
        `https://www.dnd5eapi.co/api/languages`,
        'language'
    );
    renderInfo(language, 'language');
});

document.getElementById('generateCharacteristicsButton').addEventListener('click', () => {
    const characteristics = generateCharacteristics();
    renderInfo(characteristics, 'characteristics');
});