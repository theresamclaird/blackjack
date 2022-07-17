const colors = {
    feltGreen: '#35654d',
    yellow: '#ffff00',
}

const space = [0, 4, 8, 16, 32, 64, 128, 256];
space.sm = space[2];
space.md = space[3];
space.lg = space[4];

const fonts = {
    default: 'Arial, Helvetica, sans-serif',
};

const textVariants = {
    yellow: {
        color: 'yellow',
        textTransform: 'uppercase',
    },
};

export default {
    colors,
    space,
    fonts,
};