class Hand {
    constructor(bet = 0, cards = []) {
        this.bet = bet;
        this.cards = cards;
    }
    get value() {
        const hard = this.cards.reduce((p, c) => p + c.value, 0);
        const soft = this.cards.filter(card => card.value === 1).length > 0 ? hard + 10 : hard;
        return {
            hard,
            soft: soft > 21 ? hard : soft,
        };
    };
    get reportHandValue() {
        const { hard, soft } = this.value;
        return hard !== soft ? `${hard}/${soft}` : `${hard}`;
    }
    addCard(card) {
        this.cards.push(card);
    }
    clear() {
        this.cards = [];
    }
}

class DealerHand extends Hand {
    constructor(cards = []) {
        super();
        this.bet = null;
        this.cards = cards;
        this.hide = true;
    }
    get reportHandValue() {
        if (this.hide) {
            const card = this.cards[1];
            return card.value === 1 ? '1/11' : card.value;
        }
        return super.reportHandValue;
    }
    showHiddenCard() {
        this.hide = false;
    }
}

export { Hand, Hand as default, DealerHand };