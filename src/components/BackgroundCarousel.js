import React, { useState, useEffect } from 'react';
import { Box, keyframes } from '@chakra-ui/react';

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const BackgroundCarousel = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isChanging, setIsChanging] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsChanging(true);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                setIsChanging(false);
            }, 300); // Duration of fade out animation
        }, 15000); // Change image every 10 seconds

        return () => clearInterval(interval);
    }, [images]);

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="-1"
            backgroundImage={`url(${images[currentImageIndex]})`}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            animation={isChanging ? `${fadeOut} 1s ease-out` : `${fadeIn} 1s ease-in`}
            filter="blur(8px)"
            transform="scale(1.1)"
        />
    );
};

export default BackgroundCarousel;