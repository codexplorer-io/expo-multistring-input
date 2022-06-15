import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import includes from 'lodash/includes';
import {
    CreateValueRoot,
    CreateValueElementsSpacer,
    CreateValueButtons,
    CreateValueButtonsSpacer,
    CreateValueButton
} from './styled';

export const CreateValue = ({
    values,
    label,
    placeholder,
    onCreate
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [value, setValue] = useState();

    const onStartAdding = () => {
        setValue('');
        setIsAdding(true);
    };

    const onCancel = () => {
        setIsAdding(false);
    };

    const onCreatePress = async () => {
        onCreate(value);
        setValue('');
    };

    const isValid = !!value && !includes(values, value);

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
                    <TextInput
                        label={label}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={setValue}
                        mode='outlined'
                        error={!isValid}
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
                            disabled={!isValid}
                        >
                            Add
                        </CreateValueButton>
                    </CreateValueButtons>
                </>
            )}
        </CreateValueRoot>
    );
};
