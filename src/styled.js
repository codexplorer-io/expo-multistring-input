import styled from 'styled-components/native';
import {
    Text,
    Chip,
    Surface,
    Button,
    IconButton,
    Subheading
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

export const Root = styled.TouchableHighlight`
    border-radius: ${({ theme: { roundness } }) => roundness}px;
    border-width: 1px;
    border-bottom-width: 1px;
    border-color: ${({ theme: { colors: { placeholder } } }) => placeholder};
    display: flex;
    flex-direction: row;
    margin-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: ${({ theme: { colors: { background } } }) => background};
    min-height: 50px;
    align-items: center;
`;

export const EmptyRoot = styled.View`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
`;

export const EmptyText = styled(Subheading)`
    text-align: center;
`;

export const EmptyIcon = styled(Feather)`
    opacity: 0.3;
`;

export const Value = styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
`;

export const ValueItem = styled(Chip)`
    margin-right: 8px;
    margin-top: 8px;
    background-color: ${({ theme: { colors: { background } } }) => background};
`;

export const Placeholder = styled(Text)`
    color: ${({ theme: { colors: { placeholder } } }) => placeholder};
    flex: 1;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
`;

export const Label = styled(Text)`
    color: ${({ theme: { colors: { placeholder } } }) => placeholder};
    position: absolute;
    font-size: 12px;
    line-height: 12px;
    top: -6px;
    left: 8px;
    margin: 0;
    padding: 0;
    padding-left: 4px;
    padding-right: 4px;
    background-color: ${({ theme: { colors: { background } } }) => background};
`;

export const Actions = styled.View`
    flex: 1;
    display: flex;
    margin-right: auto;
    align-items: flex-end;
`;

export const Delete = styled(IconButton)``;

export const CreateValueRoot = styled(Surface)`
    elevation: 8;
    padding: 10px;
`;

export const CreateValueElementsSpacer = styled.View`
    height: 10px;
`;

export const CreateValueButtons = styled.View`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
`;

export const CreateValueButtonsSpacer = styled.View`
    width: 10px;
`;

export const CreateValueButton = styled(Button)`
    flex: 1;
`;
