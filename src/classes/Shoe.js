import { createShoe } from '../utils/cards';

class Shoe {
    constructor(numberOfDecks) {
        this.cards = createShoe(numberOfDecks);
    }
    get draw() {
        return this.cards.pop();
    }
    shuffle() {
        for (let index = this.cards.length - 1; index > 0; index--) {
            const randomCardIndex = Math.floor(Math.random() * (index + 1));
            const holdCard = this.cards[randomCardIndex];
            this.cards[randomCardIndex] = this.cards[index];
            this.cards[index] = holdCard;
        }
        return this;
    }
    cut(percent) {
        const cards = [...this.cards];
        const location = Math.floor(cards.length * percent / 100);
        this.cards = [...cards.slice(location), ...cards.slice(0, location)];
        return this;
    }
    burn() {
        this.cards.pop();
        return this;
    }
}

export { Shoe, Shoe as default };