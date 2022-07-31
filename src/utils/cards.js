// todo Unit test these.

const getDeck = () => {
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const ranks = [
        { value: 1, rank: 1 },
        { value: 2, rank: 2 },
        { value: 3, rank: 3 },
        { value: 4, rank: 4 },
        { value: 5, rank: 5 },
        { value: 6, rank: 6 },
        { value: 7, rank: 7 },
        { value: 8, rank: 8 },
        { value: 9, rank: 9 },
        { value: 10, rank: 10 },
        { value: 10, rank: 'jack' },
        { value: 10, rank: 'queen' },
        { value: 10, rank: 'king' },
    ];
    const cards = [];
    suits.forEach(suit => ranks.forEach(({ value, rank }) => cards.push({ suit, value, rank })));

    return cards;
};

const getShoe = numberOfDecks => {
    const shoe = []; // Generate a new shoe.
    for (let i = 0; i < numberOfDecks; i++) {
        shoe.push(...getDeck());
    }
    return shoe;
};

const isSoft = (cards = []) => cards.reduce((sum, card) => sum + card.value, 0) < 12 && cards.filter(card => card.value === 1).length > 0;
const isBusted = (cards = []) => getHandValue(cards) > 21;
const getUpCardValue = (cards = []) => cards?.[1]?.value; // todo Verify that the upcard is the first card dealt to the dealer.
const isBlackjack = (cards = []) => cards.length === 2 && getHandValue(cards) === 21;
const getHandValue = (cards = []) => {
    const sum = cards.reduce((sum, card) => sum + card.value, 0); // Aces are counted as 1.

    if (sum > 11) {
        return sum;
    }

    if (cards.filter(card => card.value === 1).length > 0) { // Hand contains >= 1 Ace.
        return sum + 10;
    }
    
    return sum;
};

const shuffle = (cards = []) => { // Fisher-Yates
    for (let index = cards.length - 1; index > 0; index--) {
        const randomCardIndex = Math.floor(Math.random() * (index + 1));
        const temp = cards[randomCardIndex];
        cards[randomCardIndex] = cards[index];
        cards[index] = temp;
    }
    return cards;
};

const cut = (cards = [], percent = 50) => {
    const location = Math.floor(cards.length * percent / 100);
    return [ ...cards.slice(location), ...cards.slice(0, location) ];
};

export {
    getDeck,
    getShoe,
    isSoft,
    isBusted,
    getUpCardValue,
    isBlackjack,
    getHandValue,
    shuffle,
    cut,
};