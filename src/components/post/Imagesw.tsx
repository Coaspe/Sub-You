import { postContent } from "../../types"
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
 

const variants = {
  enter: (direction: number) => {
    return {
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      opacity: 0
    };
  }
};
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const Imagesw = ({ postContentProps }: postContent) => {
    
  const [direction, setDirection] = useState(0);
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    (value - page > 0) ? setDirection(1) : setDirection(-1)
    setPage(value)
  };

  useEffect(() => {
    const cacheImages = async (srcArray: string[]) => {
      const promise = srcArray.map((src: string) => {
        
        return new Promise(function (resolve, reject) {
          const img = new Image();

          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = () => reject();
        })
      })

      await Promise.all(promise).then(() => {
        setLoad(true)
      })
    }

    cacheImages(postContentProps.imageSrc)

  }, [postContentProps.imageSrc]);
  
  return (
    <div className="flex flex-col items-center">
        <motion.div
          animate={{ backgroundColor: postContentProps.averageColor[page-1] }}
          className="flex flex-col items-center justify-center w-full h-bgpost sm:h-smpost">
        {load ? <AnimatePresence custom={direction} exitBeforeEnter>
          <motion.img
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                page === postContentProps.imageSrc.length ? setPage(page) : setPage(page + 1)
              } else if (swipe > swipeConfidenceThreshold) {
                page === 1 ? setPage(page) : setPage(page - 1)
              }

            }}
            className="max-h-full max-w-full"
            src={postContentProps.imageSrc[page - 1]}
            alt={`Page : ${page - 1}`}
          />
        </AnimatePresence> : null}
        </motion.div>
      <Pagination className="text-white" count={postContentProps.imageSrc.length} page={page} onChange={handlePageChange} />
    </div>
    )
}

export default Imagesw