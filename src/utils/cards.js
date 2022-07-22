const createDeck = () => {
    const cards = [];
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];

    suits.forEach(suit => {
        for (let value = 1; value <= 10; value++) {
            cards.push({ suit, value, rank: value });
        }
        cards.push({ suit, value: 10, rank: 'jack' });
        cards.push({ suit, value: 10, rank: 'queen' });
        cards.push({ suit, value: 10, rank: 'king' });
    });
    return cards;
};

const createShoe = numberOfDecks => {
    const cards = [];
    for (let i = 0; i < numberOfDecks; i++) {
        cards.push(...createDeck());
    }
    return cards;
};

const shuffle = (elements = []) => {
    const randomizedArray = elements;
    for (let index = randomizedArray.length - 1; index > 0; index--) {
        const randomCardLocation = Math.floor(Math.random() * (index + 1));
        const temp = randomizedArray[randomCardLocation];
        randomizedArray[randomCardLocation] = randomizedArray[index];
        randomizedArray[index] = temp;
    }
    return randomizedArray;
};

export { createDeck, createShoe, shuffle };