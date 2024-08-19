import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Switch,
    Button,
    useColorMode,
    useToast,
    Spinner,
    Alert,
    AlertIcon,
    Text
} from "@chakra-ui/react";
import { getUserPreferences, updateUserPreferences } from '../utils/api';

function Settings() {
    const [preferences, setPreferences] = useState({
        categories: [],
        sources: [],
        darkMode: false,
        notifications: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setColorMode } = useColorMode();
    const toast = useToast();

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching user preferences...');
                const data = await getUserPreferences();
                console.log('Loaded preferences:', data);
                if (data) {
                    setPreferences(data);
                    setColorMode(data.darkMode ? 'dark' : 'light');
                }
            } catch (error) {
                console.error('Error fetching preferences:', error);
                setError('Failed to fetch preferences. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadPreferences();
    }, [setColorMode]);

    const handlePreferenceChange = (preference) => {
        setPreferences(prev => {
            const newPreferences = { ...prev, [preference]: !prev[preference] };
            console.log('Preference changed:', preference, 'New value:', newPreferences[preference]);
            if (preference === 'darkMode') {
                setColorMode(newPreferences.darkMode ? 'dark' : 'light');
            }
            return newPreferences;
        });
    };

    const savePreferences = async () => {
        try {
            console.log('Saving preferences:', preferences);
            await updateUserPreferences(preferences);
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            console.log('Preferences saved successfully');
            toast({
                title: "Preferences saved",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast({
                title: "Error saving preferences",
                description: error.response?.data?.message || "An unexpected error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading preferences...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box w="full">
            <VStack spacing={8} align="stretch">
                <Heading textAlign="center">Settings</Heading>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark-mode" mb="0">
                        Dark Mode
                    </FormLabel>
                    <Switch
                        id="dark-mode"
                        isChecked={preferences.darkMode}
                        onChange={() => handlePreferenceChange('darkMode')}
                    />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="notifications" mb="0">
                        Enable Notifications
                    </FormLabel>
                    <Switch
                        id="notifications"
                        isChecked={preferences.notifications}
                        onChange={() => handlePreferenceChange('notifications')}
                    />
                </FormControl>
                <Button onClick={savePreferences} colorScheme="teal">
                    Save Preferences
                </Button>
            </VStack>
        </Box>
    );
}

export default Settings;