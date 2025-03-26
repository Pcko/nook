import React from 'react';
import { CCarousel, CCarouselItem, CImage } from '@coreui/react';
import '../../assets/styles/coreui.css'
import Image1 from '../../assets/resources/frontpage/slideshow-icon.png';
import Image2 from '../../assets/resources/frontpage/slideshow-slogan.png';

const ImageCarousel = () => {
    const images = [Image1, Image2];

    return (
        <CCarousel indicators>
            {images.map((image, index) => (
                <CCarouselItem key={index}>
                    <CImage
                        className="d-block w-100 rounded-[10px]"
                        src={image}
                        alt={`slide ${index + 1}`}
                        loading={index === 0 ? "eager" : "lazy"}
                        placeholder="blurred"
                    />
                </CCarouselItem>
            ))}
        </CCarousel>
    );
};

export default ImageCarousel;
