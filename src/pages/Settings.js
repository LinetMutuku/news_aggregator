import React, { useState, useEffect } from 'react';
import {Box, VStack, HStack, Heading, Text, FormControl, FormLabel, Switch, Button, useColorMode, useToast, Spinner, Alert,
    AlertIcon, Divider, Container, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Collapse, useDisclosure, Icon} from "@chakra-ui/react";
import {MoonIcon, SunIcon, BellIcon, EmailIcon, LockIcon, TimeIcon, StarIcon, SettingsIcon, RepeatIcon, CheckIcon} from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { getUserPreferences, updateUserPreferences } from '../utils/api';

function Settings() {
    const [preferences, setPreferences] = useState({
        categories: [],
        sources: [],
        darkMode: false,
        notifications: false,
        emailDigest: false,
        autoSave: true,
        privacyMode: false,
        prioritySupport: false,
        newsletterSubscription: true,
        soundEffects: true,
        activityLog: true,
        twoFactorAuth: false,
        performanceMode: false,
        locationServices: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);
    const { colorMode, setColorMode } = useColorMode();
    const toast = useToast();
    const { isOpen, onToggle } = useDisclosure();
    const dispatch = useDispatch();

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const data = await getUserPreferences();
            if (data) {
                setPreferences(data);
                setColorMode(data.darkMode ? 'dark' : 'light');
            }
            setLastSaved(new Date().toISOString());
        } catch (error) {
            setError('Failed to load preferences');
            toast({
                title: "Error loading preferences",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceChange = async (preference) => {
        const newValue = !preferences[preference];

        // Optimistic update
        setPreferences(prev => ({
            ...prev,
            [preference]: newValue
        }));

        if (preference === 'darkMode') {
            setColorMode(newValue ? 'dark' : 'light');
        }

        try {
            await updateUserPreferences({
                preferences: {
                    ...preferences,
                    [preference]: newValue
                }
            });

            setLastSaved(new Date().toISOString());
            toast({
                title: `${preference} ${newValue ? 'enabled' : 'disabled'}`,
                status: "success",
                duration: 2000,
            });

        } catch (error) {
            // Revert on failure
            setPreferences(prev => ({
                ...prev,
                [preference]: !newValue
            }));

            toast({
                title: "Error updating preference",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const saveAllPreferences = async () => {
        setSaving(true);
        try {
            await updateUserPreferences({ preferences });
            setLastSaved(new Date().toISOString());
            toast({
                title: "All settings saved",
                status: "success",
                duration: 2000,
            });
        } catch (error) {
            toast({
                title: "Error saving settings",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
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
        <Container maxW="4xl" py={8}>
            <Card>
                <CardHeader>
                    <HStack justify="space-between">
                        <Heading size="lg">Settings</Heading>
                        {lastSaved && (
                            <Text fontSize="sm" color="gray.500">
                                Last saved: {new Date(lastSaved).toLocaleTimeString()}
                            </Text>
                        )}
                    </HStack>
                </CardHeader>

                <CardBody>
                    <VStack spacing={6} align="stretch">
                        {/* Core Settings */}
                        <Box>
                            <Heading size="md" mb={4}>Core Settings</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <FormControl display="flex" alignItems="center">
                                    <HStack flex="1">
                                        <Icon as={colorMode === 'dark' ? MoonIcon : SunIcon} />
                                        <Box>
                                            <FormLabel htmlFor="dark-mode" mb="0">Dark Mode</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Adjust the theme</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="dark-mode"
                                        isChecked={preferences.darkMode}
                                        onChange={() => handlePreferenceChange('darkMode')}
                                    />
                                </FormControl>

                                <FormControl display="flex" alignItems="center">
                                    <HStack flex="1">
                                        <Icon as={BellIcon} />
                                        <Box>
                                            <FormLabel htmlFor="notifications" mb="0">Notifications</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Enable alerts</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="notifications"
                                        isChecked={preferences.notifications}
                                        onChange={() => handlePreferenceChange('notifications')}
                                    />
                                </FormControl>
                            </SimpleGrid>
                        </Box>

                        <Divider />

                        {/* Advanced Settings */}
                        <Box>
                            <Button
                                onClick={onToggle}
                                variant="ghost"
                                leftIcon={<SettingsIcon />}
                                mb={4}
                            >
                                Advanced Settings
                            </Button>

                            <Collapse in={isOpen}>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl display="flex" alignItems="center">
                                        <HStack flex="1">
                                            <Icon as={EmailIcon} />
                                            <Box>
                                                <FormLabel htmlFor="email-digest" mb="0">Email Digest</FormLabel>
                                                <Text fontSize="sm" color="gray.500">Weekly updates</Text>
                                            </Box>
                                        </HStack>
                                        <Switch
                                            id="email-digest"
                                            isChecked={preferences.emailDigest}
                                            onChange={() => handlePreferenceChange('emailDigest')}
                                        />
                                    </FormControl>

                                    <FormControl display="flex" alignItems="center">
                                        <HStack flex="1">
                                            <Icon as={LockIcon} />
                                            <Box>
                                                <FormLabel htmlFor="privacy-mode" mb="0">Privacy Mode</FormLabel>
                                                <Text fontSize="sm" color="gray.500">Enhanced privacy</Text>
                                            </Box>
                                        </HStack>
                                        <Switch
                                            id="privacy-mode"
                                            isChecked={preferences.privacyMode}
                                            onChange={() => handlePreferenceChange('privacyMode')}
                                        />
                                    </FormControl>

                                    <FormControl display="flex" alignItems="center">
                                        <HStack flex="1">
                                            <Icon as={TimeIcon} />
                                            <Box>
                                                <FormLabel htmlFor="auto-save" mb="0">Auto Save</FormLabel>
                                                <Text fontSize="sm" color="gray.500">Save automatically</Text>
                                            </Box>
                                        </HStack>
                                        <Switch
                                            id="auto-save"
                                            isChecked={preferences.autoSave}
                                            onChange={() => handlePreferenceChange('autoSave')}
                                        />
                                    </FormControl>

                                    <FormControl display="flex" alignItems="center">
                                        <HStack flex="1">
                                            <Icon as={StarIcon} />
                                            <Box>
                                                <FormLabel htmlFor="priority-support" mb="0">Priority Support</FormLabel>
                                                <Text fontSize="sm" color="gray.500">Premium support</Text>
                                            </Box>
                                        </HStack>
                                        <Switch
                                            id="priority-support"
                                            isChecked={preferences.prioritySupport}
                                            onChange={() => handlePreferenceChange('prioritySupport')}
                                        />
                                    </FormControl>
                                </SimpleGrid>
                            </Collapse>
                        </Box>
                    </VStack>
                </CardBody>

                <CardFooter>
                    <HStack spacing={4} width="full" justify="space-between">
                        <Button
                            leftIcon={<RepeatIcon />}
                            onClick={loadPreferences}
                            variant="outline"
                        >
                            Refresh
                        </Button>
                        <Button
                            leftIcon={<CheckIcon />}
                            colorScheme="blue"
                            onClick={saveAllPreferences}
                            isLoading={saving}
                        >
                            Save All Changes
                        </Button>
                    </HStack>
                </CardFooter>
            </Card>
        </Container>
    );
}

export default Settings;