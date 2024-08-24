import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Container,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    Avatar,
    Button
} from "@chakra-ui/react";
import { getUserProfile, getAllArticles } from '../utils/api';

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserAndArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                const userData = await getUserProfile();
                setUser(userData);
                const articlesData = await getAllArticles();
                setArticles(Array.isArray(articlesData) ? articlesData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch user data and articles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadUserAndArticles();
    }, []);

    if (loading) {
        return (
            <Box textAlign="center" py={10} bg="white">
                <Spinner size="xl" />
                <Text mt={4}>Loading dashboard...</Text>
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
        <Container maxW="container.xl" py={8} bg="white" boxShadow="md">
            <VStack spacing={8} align="stretch">
                {user && (
                    <Card>
                        <CardHeader>
                            <Heading size="md">User Profile</Heading>
                        </CardHeader>
                        <CardBody>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <Box>
                                    <Avatar name={user.name} src={user.avatar} size="xl" />
                                    <Text fontWeight="bold" mt={2}>{user.name}</Text>
                                    <Text>{user.email}</Text>
                                </Box>
                                <StatGroup>
                                    <Stat>
                                        <StatLabel>Total Articles</StatLabel>
                                        <StatNumber>{articles.length}</StatNumber>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Read Articles</StatLabel>
                                        <StatNumber>{articles.filter(a => a.read).length}</StatNumber>
                                    </Stat>
                                </StatGroup>
                            </SimpleGrid>
                        </CardBody>
                    </Card>
                )}

                <Box>
                    <Heading size="md" mb={4}>Recent Articles</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {articles.slice(0, 6).map(article => (
                            <Card key={article.id}>
                                <CardBody>
                                    <VStack align="start" spacing={2}>
                                        <Heading size="sm">{article.title}</Heading>
                                        <Text noOfLines={2}>{article.summary}</Text>
                                        <Button size="sm" colorScheme="blue">
                                            Read Article
                                        </Button>
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>
            </VStack>
        </Container>
    );
}

export default UserDashboard;