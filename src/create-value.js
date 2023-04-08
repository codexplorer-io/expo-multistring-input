import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import includes from 'lodash/includes';
import map from 'lodash/map';
import {
    CreateValueRoot,
    CreateValueElementsSpacer,
    CreateValueButtons,
    CreateValueButtonsSpacer,
    CreateValueButton
} from './styled';

export const CreateValue = ({
    values,
    getValue,
    hasDisplayValue,
    label,
    placeholder,
    displayValueLabel,
    displayValuePlaceholder,
    onCreate
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [value, setValue] = useState();
    const [displayValue, setDisplayValue] = useState();

    const onStartAdding = () => {
        setValue('');
        setIsAdding(true);
    };

    const onCancel = () => {
        setIsAdding(false);
    };

    const onCreatePress = async () => {
        onCreate(hasDisplayValue ? { value, displayValue } : value);
        setValue('');
        setDisplayValue('');
    };

    const isValueValid = !!value && !includes(map(values, getValue), value);
    const isDisplayValueValid = !hasDisplayValue || !!displayValue;

    return (
        <CreateValueRoot>
            {!isAdding && (
                <Button
                    icon='plus'
                    onPress={onStartAdding}
                >
                    Add
                </Button>
            )}
            {isAdding && (
                <>
                    {hasDisplayValue && (
                        <TextInput
                            label={displayValueLabel}
                            placeholder={displayValuePlaceholder}
                            value={displayValue}
                            onChangeText={setDisplayValue}
                            mode='outlined'
                            error={!isDisplayValueValid}
                        />
                    )}
                    <TextInput
                        label={label}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={setValue}
                        mode='outlined'
                        error={!isValueValid}
                    />
                    <CreateValueElementsSpacer />
                    <CreateValueButtons>
                        <CreateValueButton
                            mode='contained'
                            onPress={onCancel}
                        >
                            Cancel
                        </CreateValueButton>
                        <CreateValueButtonsSpacer />
                        <CreateValueButton
                            mode='contained'
                            onPress={onCreatePress}
                            disabled={!isValueValid || !isDisplayValueValid}
                        >
                            Add
                        </CreateValueButton>
                    </CreateValueButtons>
                </>
            )}
        </CreateValueRoot>
    );
};
