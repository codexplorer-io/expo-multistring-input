import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import find from 'lodash/find';
import noop from 'lodash/noop';
import reverse from 'lodash/reverse';
import indexOf from 'lodash/indexOf';
import { useTheme, Button } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { usePicker } from '@codexporer.io/expo-picker';
import { usePrevious } from '@codexporer.io/react-hooks';
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
    OptionContent,
    OptionValueDisplay,
    OptionActions,
    OptionAction
} from './styled';

const initalParams = {
    initialValues: [],
    title: 'Modify Values',
    label: 'Values',
    placeholder: 'Tap to add',
    addValueLabel: 'Value',
    addValuePlaholder: 'Input value',
    addDisplayValueLabel: 'Display Value',
    addDisplayValuePlaholder: 'Input display value'
};

export const useMultiStringInput = ({
    initialValues = initalParams.initialValues,
    title = initalParams.title,
    label = initalParams.label,
    placeholder = initalParams.placeholder,
    addValueLabel = initalParams.addValueLabel,
    addValuePlaholder = initalParams.addValuePlaholder,
    addDisplayValueLabel = initalParams.addDisplayValueLabel,
    addDisplayValuePlaholder = initalParams.addDisplayValuePlaholder,
    getValue = option => option,
    createValue = value => value,
    isDisabled = false,
    isRequired = false,
    getDisplayValue,
    renderBeforeOptionContent,
    onOpen,
    onAdd,
    onEdit,
    onDelete,
    onBeforeClose,
    onConfirm
} = initalParams) => {
    const theme = useTheme();
    const [pickerId] = useState(uuid());
    const [{ pickerConfig }, { openPicker, changeConfig, closePicker }] = usePicker();
    const createPickerConfig = useRef();
    const [values, setValues] = useState(initialValues);
    const [editingValue, setEditingValue] = useState(null);
    const hasDisplayValue = !!getDisplayValue;
    const getCurrentDisplayValue = hasDisplayValue ? getDisplayValue : getValue;

    const onValueDelete = value => {
        const nextValues = filter(values, val => val !== value);
        setValues(nextValues);
        onDelete?.({ value, values: nextValues });
    };

    const onValueEdit = value => {
        setEditingValue(value);
    };

    const renderOptionContent = ({
        option,
        renderLabel
    }) => {
        const deleteValue = () => onValueDelete(option);
        const editValue = () => onValueEdit(option);
        return (
            <>
                {
                    renderBeforeOptionContent?.({
                        value: find(values, val => val === option),
                        values,
                        setValues
                    }) ?? null
                }
                <OptionContent>
                    {renderLabel(getCurrentDisplayValue(option))}
                    {hasDisplayValue && (
                        <OptionValueDisplay numberOfLines={1}>
                            {getValue(option)}
                        </OptionValueDisplay>
                    )}
                </OptionContent>
                <OptionActions>
                    <OptionAction
                        icon='pencil'
                        onPress={editValue}
                        color={theme.colors.primary}
                    />
                    <OptionAction
                        icon='delete'
                        onPress={deleteValue}
                        color={theme.colors.primary}
                    />
                </OptionActions>
            </>
        );
    };

    const onEditingDismiss = () => {
        setEditingValue(null);
    };

    const onValueCreate = value => {
        if (editingValue) {
            const newValue = createValue(value);
            values[indexOf(values, editingValue)] = newValue;
            const nextValues = [...values];
            onEdit?.({ value: newValue, values: nextValues });
            onEditingDismiss();
            return;
        }

        const newValue = createValue(value);
        const nextValues = [...values, newValue];
        setValues(nextValues);
        onAdd?.({ value: newValue, values: nextValues });
    };

    const renderBottomView = () => (
        <CreateValue
            values={values}
            editingValue={editingValue}
            getValue={getValue}
            getDisplayValue={getCurrentDisplayValue}
            hasDisplayValue={hasDisplayValue}
            onCreate={onValueCreate}
            onEditingDismiss={onEditingDismiss}
            label={addValueLabel}
            placeholder={addValuePlaholder}
            displayValueLabel={addDisplayValueLabel}
            displayValuePlaceholder={addDisplayValuePlaholder}
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
        renderBottomView,
        onBeforeClose,
        onConfirm
    };

    const previousEditingValue = usePrevious(editingValue);
    useEffect(() => {
        if (!values ||
            !pickerConfig ||
            pickerConfig.pickerId !== pickerId ||
            (
                isEqual(pickerConfig.items, createPickerConfig.current.items) &&
                isEqual(editingValue, previousEditingValue)
            )
        ) {
            return;
        }

        changeConfig(createPickerConfig.current);
    }, [
        changeConfig,
        pickerConfig,
        pickerId,
        values,
        previousEditingValue,
        editingValue
    ]);

    const openValuesPicker = () => {
        onEditingDismiss();
        openPicker(createPickerConfig.current);
        onOpen?.();
    };

    const renderValuesInput = ({ values: overiddenValues } = {}) => {
        const currentValues = overiddenValues ?? values;
        const isError = !isDisabled && isRequired && isEmpty(currentValues);
        return (
            <Root
                underlayColor='transparent'
                onPress={isDisabled ? null : openValuesPicker}
                isDisabled={isDisabled}
                isError={isError}
            >
                <>
                    <Label isError={isError}>{label}</Label>
                    {currentValues.length > 0 && (
                        <Value>
                            {map(
                                currentValues,
                                value => (
                                    <ValueItem
                                        key={getValue(value)}
                                        mode='outlined'
                                    >
                                        {getCurrentDisplayValue(value)}
                                    </ValueItem>
                                )
                            )}
                        </Value>
                    )}
                    {currentValues.length === 0 && (
                        <Placeholder isError={isError}>
                            {placeholder}
                        </Placeholder>
                    )}
                </>
            </Root>
        );
    };

    const renderButtonInput = () => (
        <Button
            underlayColor='transparent'
            onPress={openValuesPicker}
            mode='contained'
            disabled={isDisabled}
        >
            {label}
        </Button>
    );

    return {
        values,
        setValues,
        openValuesPicker,
        closeValuesPicker: closePicker,
        renderValuesInput,
        renderButtonInput
    };
};
