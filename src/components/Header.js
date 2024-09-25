import React, { useState } from 'react';
import {
    Box, Flex, Heading, Button, useColorMode, IconButton, HStack, VStack,
    useDisclosure, useColorModeValue, Drawer, DrawerBody, DrawerHeader,
    DrawerOverlay, DrawerContent, DrawerCloseButton, Container,
    Menu, MenuButton, MenuList, MenuItem, Avatar
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { HamburgerIcon,  MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaHome, FaBookmark, FaCog } from 'react-icons/fa';
import UserDashboard from './userDashboard';

function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDashboardVisible, setIsDashboardVisible] = useState(false);
    const location = useLocation();

    const toggleDashboard = () => setIsDashboardVisible(prev => !prev);

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const NavItem = ({ icon, children, to }) => {
        const isActive = location.pathname === to;
        return (
            <Button
                leftIcon={icon}
                as={Link}
                to={to}
                variant={isActive ? "solid" : "ghost"}
                color={textColor}
                _hover={{
                    bg: useColorModeValue("gray.100", "gray.700")
                }}
            >
                {children}
            </Button>
        );
    };

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex="sticky"
            bg={bgColor}
            color={textColor}
            boxShadow="sm"
            borderBottom="1px"
            borderColor={borderColor}
        >
            <Container maxW="container.xl">
                <Flex h={16} alignItems="center" justifyContent="space-between">
                    <IconButton
                        size="md"
                        icon={<HamburgerIcon />}
                        aria-label="Open Menu"
                        display={{ md: 'none' }}
                        onClick={onOpen}
                    />
                    <HStack spacing={8} alignItems="center">
                        <Heading as="h1" size="lg" letterSpacing="tighter">
                            News Aggregator
                        </Heading>
                        <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
                            <NavItem icon={<FaHome />} to="/home">Home</NavItem>
                            <NavItem icon={<FaBookmark />} to="/saved">Saved</NavItem>
                            <NavItem icon={<FaCog />} to="/settings">Settings</NavItem>
                        </HStack>
                    </HStack>
                    <Flex alignItems="center">
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded="full"
                                variant="link"
                                cursor="pointer"
                                minW={0}
                            >
                                <Avatar
                                    size="sm"
                                    src="https://bit.ly/broken-link"
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={toggleDashboard}>Dashboard</MenuItem>
                                <MenuItem as={Link} to="/">Login</MenuItem>
                            </MenuList>
                        </Menu>
                        <IconButton
                            ml={2}
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            aria-label="Toggle color mode"
                        />
                    </Flex>
                </Flex>
            </Container>

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4} align="stretch">
                            <NavItem icon={<FaHome />} to="/home">Home</NavItem>
                            <NavItem icon={<FaBookmark />} to="/saved">Saved Articles</NavItem>
                            <NavItem icon={<FaCog />} to="/settings">Settings</NavItem>
                            <Button colorScheme="blue" as={Link} to="/">Login</Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {isDashboardVisible && (
                <Box
                    position="fixed"
                    top="64px"
                    right={0}
                    width="300px"
                    height="calc(100vh - 64px)"
                    bg={bgColor}
                    boxShadow="md"
                    zIndex="modal"
                    p={4}
                    overflowY="auto"
                >
                    <UserDashboard />
                </Box>
            )}
        </Box>
    );
}

export default Header;