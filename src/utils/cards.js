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

const isSoft = cards => cards.reduce((sum, card) => sum + card.value, 0) < 12 && cards.filter(card => card.value === 1).length > 0;
const isBusted = cards => handValue(cards) > 21;
const getUpCardValue = cards => cards?.[1]?.value;
const isBlackjack = cards => cards.length === 2 && handValue(cards) === 21;
const handValue = cards => {
    const sum = cards.reduce((sum, card) => sum + card.value, 0); // Aces are counted as 1.

    if (sum > 11) {
        return sum;
    }

    if (cards.filter(card => card.value === 1).length > 0) { // Hand contains >= 1 Ace.
        return sum + 10;
    }
    
    return sum;
};

export {
    getDeck,
    isSoft,
    isBusted,
    getUpCardValue,
    isBlackjack,
    handValue,
};