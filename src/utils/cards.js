const isSoft = (cards = []) => cards.reduce((sum, card) => sum + card.value, 0) < 12 && cards.filter(card => card.value === 1).length > 0;
const isBusted = (cards = []) => getHandValue(cards) > 21;
const getUpCardValue = (cards = []) => cards?.[1]?.value; // todo Verify that the upcard is the first card dealt to the dealer.
const isBlackjack = (cards = []) => cards.length === 2 && getHandValue(cards) === 21;
const getHandValue = (cards = []) => {
    const sum = cards.reduce((sum, card) => sum + card?.value, 0); // Aces are counted as 1.

    if (sum > 11) {
        return sum;
    }

    if (cards.filter(card => card?.value === 1).length > 0) { // Hand contains >= 1 Ace.
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
    isSoft,
    isBusted,
    getUpCardValue,
    isBlackjack,
    getHandValue,
    shuffle,
    cut,
};