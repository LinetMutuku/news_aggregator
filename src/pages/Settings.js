import React, { useState, useEffect, useCallback } from 'react';
import {Box, VStack, HStack, Heading, Text, FormControl, FormLabel, Switch, Button, useColorMode, useToast, Spinner, Alert, AlertIcon,
    Badge, Divider, Container, SimpleGrid, Icon, Collapse, useDisclosure, Card, CardHeader, CardBody, CardFooter} from "@chakra-ui/react";
import {MoonIcon, SunIcon, BellIcon, SettingsIcon, RepeatIcon, CheckIcon, LockIcon, EmailIcon, TimeIcon, StarIcon} from '@chakra-ui/icons';
import { getUserPreferences, updateUserPreferences } from '../utils/api';

function Settings() {
    const [preferences, setPreferences] = useState({
        darkMode: false,
        notifications: false,
        emailDigest: false,
        autoSave: true,
        privacyMode: false,
        prioritySupport: false,
        newsletterSubscription: true,
        soundEffects: true,
        activityLog: true,
        twoFactorAuth: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);
    const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'error'

    const { colorMode, setColorMode } = useColorMode();
    const toast = useToast();
    const { isOpen, onToggle } = useDisclosure();

    // Load preferences
    const loadPreferences = useCallback(async () => {
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
            setLastSaved(new Date().toISOString());
        } catch (error) {
            console.error('Error fetching preferences:', error);
            setError('Failed to fetch preferences. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [setColorMode]);

    useEffect(() => {
        loadPreferences();
    }, [loadPreferences]);

    // Handle preference changes
    const handlePreferenceChange = async (preference) => {
        setSyncStatus('syncing');
        const newValue = !preferences[preference];

        // Optimistic update
        setPreferences(prev => ({
            ...prev,
            [preference]: newValue
        }));

        try {
            if (preference === 'darkMode') {
                setColorMode(newValue ? 'dark' : 'light');
            }

            await updateUserPreferences({ ...preferences, [preference]: newValue });

            toast({
                title: "Preference updated",
                description: `${preference} has been ${newValue ? 'enabled' : 'disabled'}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setLastSaved(new Date().toISOString());
            setSyncStatus('synced');
        } catch (error) {
            setSyncStatus('error');
            // Revert on failure
            setPreferences(prev => ({
                ...prev,
                [preference]: !newValue
            }));

            toast({
                title: "Error updating preference",
                description: error.message || "An error occurred while saving your preference",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Save all preferences
    const saveAllPreferences = async () => {
        setSaving(true);
        try {
            await updateUserPreferences(preferences);
            setLastSaved(new Date().toISOString());
            toast({
                title: "Settings saved",
                description: "All your preferences have been updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error saving settings",
                description: error.message || "Failed to save your preferences",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" color="blue.500" />
                <Text mt={4}>Loading your preferences...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Text>{error}</Text>
            </Alert>
        );
    }

    return (
        <Container maxW="4xl" py={8}>
            <Card variant="outline" borderRadius="lg" boxShadow="lg">
                <CardHeader>
                    <HStack justify="space-between" align="center" mb={2}>
                        <Heading size="lg">Settings</Heading>
                        <HStack spacing={4}>
                            {syncStatus === 'syncing' && (
                                <Badge colorScheme="blue" variant="subtle">
                                    <HStack spacing={2}>
                                        <Spinner size="xs" />
                                        <Text>Syncing...</Text>
                                    </HStack>
                                </Badge>
                            )}
                            {lastSaved && (
                                <Text fontSize="sm" color="gray.500">
                                    Last saved: {new Date(lastSaved).toLocaleTimeString()}
                                </Text>
                            )}
                        </HStack>
                    </HStack>
                    <Text color="gray.500">Manage your application preferences and settings</Text>
                </CardHeader>

                <CardBody>
                    <VStack spacing={6} align="stretch">
                        {/* Appearance Section */}
                        <Box>
                            <Heading size="md" mb={4}>Appearance & Accessibility</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={colorMode === 'dark' ? MoonIcon : SunIcon} />
                                        <Box>
                                            <FormLabel htmlFor="dark-mode" mb={0}>Dark Mode</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Adjust the theme for your eyes</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="dark-mode"
                                        isChecked={preferences.darkMode}
                                        onChange={() => handlePreferenceChange('darkMode')}
                                        colorScheme="blue"
                                    />
                                </FormControl>

                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={TimeIcon} />
                                        <Box>
                                            <FormLabel htmlFor="auto-save" mb={0}>Auto-save</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Automatically save changes</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="auto-save"
                                        isChecked={preferences.autoSave}
                                        onChange={() => handlePreferenceChange('autoSave')}
                                        colorScheme="blue"
                                    />
                                </FormControl>
                            </SimpleGrid>
                        </Box>

                        <Divider />

                        {/* Notifications Section */}
                        <Box>
                            <Heading size="md" mb={4}>Notifications & Communication</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={BellIcon} />
                                        <Box>
                                            <FormLabel htmlFor="notifications" mb={0}>Push Notifications</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Get important updates</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="notifications"
                                        isChecked={preferences.notifications}
                                        onChange={() => handlePreferenceChange('notifications')}
                                        colorScheme="blue"
                                    />
                                </FormControl>

                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={EmailIcon} />
                                        <Box>
                                            <FormLabel htmlFor="email-digest" mb={0}>Email Digest</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Weekly summary of activities</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="email-digest"
                                        isChecked={preferences.emailDigest}
                                        onChange={() => handlePreferenceChange('emailDigest')}
                                        colorScheme="blue"
                                    />
                                </FormControl>
                            </SimpleGrid>
                        </Box>

                        <Divider />

                        {/* Privacy & Security Section */}
                        <Box>
                            <Heading size="md" mb={4}>Privacy & Security</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={LockIcon} />
                                        <Box>
                                            <FormLabel htmlFor="privacy-mode" mb={0}>Privacy Mode</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Enhanced data protection</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="privacy-mode"
                                        isChecked={preferences.privacyMode}
                                        onChange={() => handlePreferenceChange('privacyMode')}
                                        colorScheme="blue"
                                    />
                                </FormControl>

                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={StarIcon} />
                                        <Box>
                                            <FormLabel htmlFor="two-factor" mb={0}>Two-Factor Auth</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Additional security layer</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="two-factor"
                                        isChecked={preferences.twoFactorAuth}
                                        onChange={() => handlePreferenceChange('twoFactorAuth')}
                                        colorScheme="blue"
                                    />
                                </FormControl>
                            </SimpleGrid>
                        </Box>
                    </VStack>
                </CardBody>

                <CardFooter>
                    <HStack spacing={4} width="full" justify="space-between">
                        <Button
                            leftIcon={<RepeatIcon />}
                            onClick={loadPreferences}
                            variant="outline"
                            isLoading={loading}
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

            {/* Advanced Settings Section */}
            <Box mt={6}>
                <Button
                    onClick={onToggle}
                    variant="ghost"
                    width="full"
                    leftIcon={<SettingsIcon />}
                >
                    Advanced Settings
                </Button>
                <Collapse in={isOpen} animateOpacity>
                    <Card mt={4} variant="outline">
                        <CardBody>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={StarIcon} />
                                        <Box>
                                            <FormLabel htmlFor="priority-support" mb={0}>Priority Support</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Get faster support responses</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="priority-support"
                                        isChecked={preferences.prioritySupport}
                                        onChange={() => handlePreferenceChange('prioritySupport')}
                                        colorScheme="blue"
                                    />
                                </FormControl>

                                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                    <HStack>
                                        <Icon as={TimeIcon} />
                                        <Box>
                                            <FormLabel htmlFor="activity-log" mb={0}>Activity Log</FormLabel>
                                            <Text fontSize="sm" color="gray.500">Track your activities</Text>
                                        </Box>
                                    </HStack>
                                    <Switch
                                        id="activity-log"
                                        isChecked={preferences.activityLog}
                                        onChange={() => handlePreferenceChange('activityLog')}
                                        colorScheme="blue"
                                    />
                                </FormControl>
                            </SimpleGrid>
                        </CardBody>
                    </Card>
                </Collapse>
            </Box>
        </Container>
    );
}

export default Settings;