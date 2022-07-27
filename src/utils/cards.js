export const getDeck = () => {
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