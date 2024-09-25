import React, { useState } from 'react';
import {
    Box, Flex, VStack, Text, Button, useColorMode, IconButton,
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    useDisclosure, useColorModeValue, Spacer, Divider, Tooltip
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { HamburgerIcon, MoonIcon, SunIcon, SettingsIcon, StarIcon } from '@chakra-ui/icons';
import { FaUser, FaHome, FaSignOutAlt } from 'react-icons/fa';
import UserDashboard from './userDashboard';

function ModernSidebar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDashboardVisible, setIsDashboardVisible] = useState(false);
    const location = useLocation();

    const toggleDashboard = () => {
        setIsDashboardVisible(prev => !prev);
    };

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const hoverBgColor = useColorModeValue("blue.50", "gray.700");
    const activeBgColor = useColorModeValue("blue.100", "gray.600");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const NavItem = ({ icon, children, to }) => {
        const isActive = location.pathname === to;
        return (
            <Tooltip label={children} placement="right" hasArrow>
                <Button
                    leftIcon={icon}
                    as={Link}
                    to={to}
                    variant={isActive ? "solid" : "ghost"}
                    justifyContent="flex-start"
                    width="full"
                    py={6}
                    borderRadius="md"
                    _hover={{ bg: hoverBgColor, transform: "translateX(5px)" }}
                    bg={isActive ? activeBgColor : "transparent"}
                    transition="all 0.3s"
                >
                    {children}
                </Button>
            </Tooltip>
        );
    };

    const SidebarContent = () => (
        <VStack spacing={4} align="stretch" w="full">
            <Box px={4} py={5}>
                <Text fontSize="xl" fontWeight="bold" letterSpacing="wide" textTransform="uppercase">
                    News Aggregator
                </Text>
            </Box>
            <Divider />
            <VStack spacing={1} align="stretch" px={4}>
                <NavItem icon={<FaHome />} to="/home">Home</NavItem>
                <NavItem icon={<StarIcon />} to="/saved">Saved Articles</NavItem>
                <NavItem icon={<SettingsIcon />} to="/settings">Settings</NavItem>
            </VStack>
            <Spacer />
            <Divider />
            <VStack spacing={1} align="stretch" px={4} pb={4}>
                <Button leftIcon={<FaUser />} onClick={toggleDashboard} variant="ghost" justifyContent="flex-start" width="full">
                    User Dashboard
                </Button>
                <Button leftIcon={<FaSignOutAlt />} variant="ghost" justifyContent="flex-start" width="full" colorScheme="red">
                    Logout
                </Button>
            </VStack>
        </VStack>
    );

    return (
        <Box>
            <Flex
                as="header"
                align="center"
                justify="space-between"
                wrap="wrap"
                padding={4}
                bg={bgColor}
                color={textColor}
                borderBottomWidth={1}
                borderColor={borderColor}
                boxShadow="sm"
            >
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onOpen}
                    icon={<HamburgerIcon />}
                    variant="outline"
                    aria-label="Open menu"
                    mr={2}
                />
                <Text fontSize="2xl" fontWeight="bold" letterSpacing="tight" display={{ base: "flex", md: "none" }}>
                    News Aggregator
                </Text>
                <Spacer />
                <IconButton
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    aria-label="Toggle color mode"
                    _hover={{ bg: hoverBgColor }}
                />
            </Flex>

            <Flex>
                <Box
                    as="nav"
                    pos="fixed"
                    top="0"
                    left="0"
                    zIndex="sticky"
                    h="full"
                    pb="10"
                    overflowX="hidden"
                    overflowY="auto"
                    bg={bgColor}
                    borderRight="1px"
                    borderRightColor={borderColor}
                    w={{ base: "full", md: 60 }}
                    display={{ base: "none", md: "block" }}
                    boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
                >
                    <SidebarContent />
                </Box>

                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
                        <DrawerBody>
                            <SidebarContent />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {isDashboardVisible && (
                    <Box
                        position="fixed"
                        top="60px"
                        right="0"
                        bottom="0"
                        width="300px"
                        bg={bgColor}
                        boxShadow="md"
                        zIndex="modal"
                        p={4}
                        transition="all 0.3s"
                        transform={isDashboardVisible ? "translateX(0)" : "translateX(100%)"}
                    >
                        <UserDashboard />
                    </Box>
                )}

                <Box ml={{ base: 0, md: 60 }} p="4" flex={1}>
                    {/* Main content goes here */}
                </Box>
            </Flex>
        </Box>
    );
}

export default ModernSidebar;