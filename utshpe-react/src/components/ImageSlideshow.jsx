import { useEffect, useState } from "react";

const images = [
  "/assets/images/Home_Page/slideshow1.jpg",
  "/assets/images/Home_Page/slideshow2.jpg",
  "/assets/images/Home_Page/slideshow3.jpg",
  "/assets/images/Home_Page/slideshow4.jpg",
  "/assets/images/Home_Page/slideshow5.jpg",
  "/assets/images/Home_Page/slideshow6.jpg",
];

function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="polaroid">
      <div className="frame">
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="UT SHPE Photos"
            className={index === currentIndex ? "active" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlideshow;