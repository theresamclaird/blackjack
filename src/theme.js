const colors = {
    feltGreen: '#35654d',
    yellow: '#ffff00',
    gray: '#ccc',
    black: '#000',
    red: '#f00',
}

const space = [0, 4, 8, 16, 32, 64, 128, 256];
space.sm = space[1];
space.md = space[2];
space.lg = space[3];
space.xl = space[4];
space.xxl = space[5];

const fonts = {
    default: 'Arial, Helvetica, sans-serif',
    fancy: 'Times, Times New Roman, serif',
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