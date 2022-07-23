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

const shuffleCards = (cards = []) => {
    const shuffledCards = [...cards];
    for (let index = shuffledCards.length - 1; index > 0; index--) {
        const randomCardIndex = Math.floor(Math.random() * (index + 1));
        const temp = shuffledCards[randomCardIndex];
        shuffledCards[randomCardIndex] = shuffledCards[index];
        shuffledCards[index] = temp;
    }
    return shuffledCards;
};

const cutCards = (cards = [], percent) => {
    const location = Math.floor(cards.length * percent / 100);
    return [...cards.slice(location), ...cards.slice(0, location)];
}

export { createDeck, createShoe, shuffleCards, cutCards };