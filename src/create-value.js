import React, {
    useRef,
    useState,
    useEffect
} from 'react';
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
    editingValue,
    getValue,
    getDisplayValue,
    hasDisplayValue,
    label,
    placeholder,
    displayValueLabel,
    displayValuePlaceholder,
    onCreate,
    onEditingDismiss
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [value, setValue] = useState();
    const [displayValue, setDisplayValue] = useState();

    const onStartAdding = () => {
        setValue('');
        setDisplayValue('');
        setIsAdding(true);
        onEditingDismiss();
    };

    const onCancel = () => {
        setIsAdding(false);
        onEditingDismiss();
    };

    const onCreatePress = async () => {
        onCreate(hasDisplayValue ? { value, displayValue } : value);
        setValue('');
        setDisplayValue('');
    };

    const isValueValid = !!value && (
        !includes(map(values, getValue), value) ||
        editingValue && value === getValue(editingValue)
    );
    const isDisplayValueValid = !hasDisplayValue || !!displayValue;

    const effectDeps = useRef();
    effectDeps.current = {
        getValue,
        getDisplayValue,
        hasDisplayValue
    };
    useEffect(() => {
        if (!editingValue) {
            return;
        }

        const {
            getValue,
            getDisplayValue,
            hasDisplayValue
        } = effectDeps.current;
        setValue(getValue(editingValue));
        hasDisplayValue && setDisplayValue(getDisplayValue(editingValue));
        setIsAdding(true);
    }, [editingValue]);

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
                            {editingValue ? 'Save' : 'Add'}
                        </CreateValueButton>
                    </CreateValueButtons>
                </>
            )}
        </CreateValueRoot>
    );
};
