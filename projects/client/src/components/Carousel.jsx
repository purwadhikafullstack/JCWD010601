import { useEffect, useState } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import slideOne from "../assets/pertama.png";
import slideTwo from "../assets/kedua.png";

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastTimeSlideChanged, setLastTimeSlideChanged] = useState(Date.now());

  const slides = [
    {
      id: 1,
      image: slideOne,
      caption: "Gambar Slide 1",
    },
    {
      id: 2,
      image: slideTwo,
      caption: "Gambar Slide 2",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastTimeSlideChanged >= 7000) {
        setLastTimeSlideChanged(now);
        setCurrentIndex((currentIndex + 1) % slides.length);
        setLastTimeSlideChanged(Date.now());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastTimeSlideChanged]);

  return (
    <Box
      width={{ base: "100%", md: "60%" }}
      margin="0 auto"
      position="relative"
    >
      <Flex
        width="100%"
        height={{ base: "200px", md: "300px" }}
        overflow="hidden"
        position="relative"
      >
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            position="absolute"
            top="0"
            left={`${index * 100}%`}
            width="100%"
            height="100%"
            transition="left 0.3s ease-in-out"
            transform={`translateX(-${currentIndex * 100}%)`}
          >
            <Image
              src={slide.image}
              alt={slide.caption}
              objectFit="contain"
              objectPosition="center"
              width="100%"
              height="100%"
            />
          </Box>
        ))}
      </Flex>
      <Flex justifyContent="center" marginTop="2">
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            width="10px"
            height="10px"
            borderRadius="50%"
            backgroundColor={index === currentIndex ? "gray.700" : "gray.200"}
            marginX="2"
            cursor="pointer"
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Flex>
    </Box>
  );
}

export default Carousel;
