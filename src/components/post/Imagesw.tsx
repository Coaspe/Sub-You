import { postContent } from "../../types"
import Pagination from '@mui/material/Pagination';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
 

const variants = {
  enter: {
      opacity: 0
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: {
      zIndex: 0,
      opacity: 0
  },
  tap: {
    scale: 1.3,
    transition: {
      duration: 0.1
    }
  }
};
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
interface imageswProps {
  postContentProps : postContent
}
const Imagesw: React.FC<imageswProps> = ({ postContentProps }) => {
    
  const [direction, setDirection] = useState(0);
  const [page, setPage] = useState(1);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    (value - page > 0) ? setDirection(1) : setDirection(-1)
    setPage(value)
  };

  
  return (
    <motion.div layout className="flex flex-col items-center border-t-2 border-b-2 border-main border-opacity-30">
        <motion.div
          layout
          animate={{ backgroundColor: postContentProps.averageColor[page-1] }}
          className="flex flex-col items-center justify-center w-full h-bgpost sm:h-smpost">
          <AnimatePresence custom={direction} exitBeforeEnter>
          <motion.img
          layout
            whileTap="tap"
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
        </AnimatePresence>
        </motion.div>
      <Pagination className="text-white" count={postContentProps.imageSrc.length} page={page} onChange={handlePageChange} />
    </motion.div>
    )
}

export default Imagesw