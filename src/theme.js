const colors = {
    feltGreen: '#35654d',
    darkGreen: '#030',
    yellow: '#ff0',
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
space.xxxl = space[6];

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

const buttonStyle = {
    backgroundColor: 'feltGreen',
    padding: 'sm',
    cursor: 'pointer',
};

export default {
    colors,
    space,
    fonts,
    buttonStyle,
    textVariants,
};