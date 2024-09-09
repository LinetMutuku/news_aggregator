import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box textAlign="center" py={10} px={6}>
                    <Text fontSize="xl" mt={3} mb={2}>
                        Oops! Something went wrong.
                    </Text>
                    <Text color={'gray.500'} mb={6}>
                        {this.state.error && this.state.error.toString()}
                    </Text>
                    <Button
                        colorScheme="blue"
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                    >
                        Try again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;