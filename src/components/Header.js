import React from 'react';
import { Box, Flex, Heading, Button, useColorMode, IconButton, Stack, useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box>
            <Flex
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                color={colorMode === 'light' ? 'gray.600' : 'white'}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.900'}
                align={'center'}
            >
                <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
                        News Aggregator
                    </Heading>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}
                    display={{ base: 'none', md: 'flex' }}
                >
                    <Button as={Link} to="/home" variant="ghost">Home</Button>
                    <Button as={Link} to="/saved" variant="ghost">Saved Articles</Button>
                    <Button as={Link} to="/settings" variant="ghost">Settings</Button>
                    <Button as={Link} to="/" variant="solid">Login</Button>
                    <IconButton
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        onClick={toggleColorMode}
                        variant="ghost"
                    />
                </Stack>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        <Button as={Link} to="/home" variant="ghost" w="full">Home</Button>
                        <Button as={Link} to="/saved" variant="ghost" w="full">Saved Articles</Button>
                        <Button as={Link} to="/settings" variant="ghost" w="full">Settings</Button>
                        <Button as={Link} to="/" variant="solid" w="full">Login</Button>
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
}

export default Header;