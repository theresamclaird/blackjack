import styled from '@emotion/styled';
import {
    compose,
    space,
    border,
    layout,
    typography,
    color,
    flexbox,
} from 'styled-system';
import css, { get } from '@styled-system/css';
import shouldForwardProp from '@styled-system/should-forward-prop';

const sx = props => css(props.sx)(props.theme);
const base = props => css(props.__css)(props.theme);
const variant = ({
    theme,
    variant,
    tx = 'variants',
}) => css(get(theme, `${tx}.${variant}`, get(theme, variant)))(theme);

export const Box = styled('div', {
    shouldForwardProp,
})({
    boxSizing: 'border-box',
    minWidth: 0,
},
base,
variant,
sx,
props => props.css,
compose(
    space,
    border,
    layout,
    typography,
    color,
    flexbox,
));

export const Flex = styled(Box)({ display: 'flex' });