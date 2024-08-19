import React from 'react';
import { Box, Container, Stack, Text, useColorModeValue } from "@chakra-ui/react";

function Footer() {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}
        >
            <Container
                as={Stack}
                maxW={'6xl'}
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}
            >
                <Text>© 2024 News Aggregator. All rights reserved</Text>
                <Stack direction={'row'} spacing={6}>
                    <Box as="a" href={'#'}>
                        Privacy Policy
                    </Box>
                    <Box as="a" href={'#'}>
                        Terms of Service
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;