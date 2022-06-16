import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import find from 'lodash/find';
import noop from 'lodash/noop';
import reverse from 'lodash/reverse';
import { useTheme, Button } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { usePicker } from '@codexporer.io/expo-picker';
import { CreateValue } from './create-value';
import {
    Root,
    EmptyRoot,
    EmptyText,
    EmptyIcon,
    Value,
    ValueItem,
    Placeholder,
    Label,
    Actions,
    Delete
} from './styled';

const initalParams = {
    initialValues: [],
    title: 'Modify Values',
    label: 'Values',
    placeholder: 'Tap to add',
    addValueLabel: 'Value',
    addValuePlaholder: 'Input value'
};

export const useMultiStringInput = ({
    initialValues = initalParams.initialValues,
    title = initalParams.title,
    label = initalParams.label,
    placeholder = initalParams.placeholder,
    addValueLabel = initalParams.addValueLabel,
    addValuePlaholder = initalParams.addValuePlaholder,
    getValue = value => value,
    createValue = value => value,
    renderBeforeOptionContent,
    onOpen,
    onAdd,
    onDelete
} = initalParams) => {
    const theme = useTheme();
    const [pickerId] = useState(uuid());
    const [{ pickerConfig }, { openPicker, changeConfig }] = usePicker();
    const createPickerConfig = useRef();
    const [values, setValues] = useState(initialValues);

    const onValueDelete = value => {
        const nextValues = filter(values, val => val !== value);
        setValues(nextValues);
        onDelete?.({ value, values: nextValues });
    };

    const renderOptionContent = ({
        option,
        renderLabel
    }) => {
        const deleteValue = () => onValueDelete(option);
        return (
            <>
                {
                    renderBeforeOptionContent?.({
                        value: find(values, val => val === option),
                        values,
                        setValues
                    }) ?? null
                }
                {renderLabel(getValue(option))}
                <Actions>
                    <Delete
                        icon='delete'
                        onPress={deleteValue}
                        color={theme.colors.primary}
                    />
                </Actions>
            </>
        );
    };

    const onValueCreate = value => {
        const newValue = createValue(value);
        const nextValues = [...values, newValue];
        setValues(nextValues);
        onAdd?.({ value: newValue, values: nextValues });
    };

    const renderBottomView = () => (
        <CreateValue
            values={map(values, getValue)}
            onCreate={onValueCreate}
            label={addValueLabel}
            placeholder={addValuePlaholder}
        />
    );

    const renderEmptyView = () => (
        <EmptyRoot>
            <EmptyIcon
                name='list'
                size={150}
                color={theme.colors.foreground}
            />
            {/* eslint-disable-next-line react/no-unescaped-entities, max-len */}
            <EmptyText>Nothing to show. Start by clicking "Add" button at the bottom.</EmptyText>
        </EmptyRoot>
    );

    const items = reverse([...values]);
    createPickerConfig.current = {
        pickerId,
        title,
        items,
        selectedValues: items,
        isMultiSelect: true,
        hasSelector: false,
        shouldHideSelectAll: true,
        shouldHideConfirmScreenButton: true,
        onValuesChange: noop,
        renderOptionContent,
        renderEmptyView,
        renderBottomView
    };

    useEffect(() => {
        if (!values ||
            !pickerConfig ||
            pickerConfig.pickerId !== pickerId ||
            isEqual(pickerConfig.items, createPickerConfig.current.items)
        ) {
            return;
        }

        changeConfig(createPickerConfig.current);
    }, [changeConfig, pickerConfig, pickerId, values]);

    const openValuesPicker = () => {
        openPicker(createPickerConfig.current);
        onOpen?.();
    };

    const renderValuesInput = () => (
        <Root
            underlayColor='transparent'
            onPress={openValuesPicker}
        >
            <>
                <Label>{label}</Label>
                {values.length > 0 && (
                    <Value>
                        {map(
                            values,
                            value => (
                                <ValueItem
                                    key={getValue(value)}
                                    mode='outlined'
                                >
                                    {getValue(value)}
                                </ValueItem>
                            )
                        )}
                    </Value>
                )}
                {values.length === 0 && (
                    <Placeholder>
                        {placeholder}
                    </Placeholder>
                )}
            </>
        </Root>
    );

    const renderButtonInput = () => (
        <Button
            underlayColor='transparent'
            onPress={openValuesPicker}
            mode='contained'
        >
            {label}
        </Button>
    );

    return {
        values,
        renderValuesInput,
        renderButtonInput
    };
};
