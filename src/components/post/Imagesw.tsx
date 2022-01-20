import { postContent } from "../../types"
import { useState } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import Comment from "./Comment";
 

const variants = {
  enter: {
      opacity: 0
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: {
      zIndex: 0,
      opacity: 0,
      transition: {
      duration: 0.2
    }
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
  postContentProps: postContent
  selectedMode: string
}
const Imagesw: React.FC<imageswProps> = ({ postContentProps, selectedMode }) => {
    
  const [direction, setDirection] = useState(0);
  const [page, setPage] = useState(0);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    (value - page > 0) ? setDirection(1) : setDirection(-1)
    setPage(value)
  };

  return (
    <motion.div layout className="relative flex flex-col items-center border-b border-main border-opacity-30">
        <motion.div
          layout
          animate={{ backgroundColor: postContentProps.averageColor[page] }}
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
              className="max-h-full max-w-full "
              src={postContentProps.imageSrc[page]}
              alt={`Page : ${page - 1}`}
            />
        </AnimatePresence>
        </motion.div>
      {postContentProps.imageSrc.length > 1 &&
        <div className="flex items-center mb-3">
          <img className="w-5 mr-2 cursor-pointer rounded-full" src="images/left.png" alt="left" onClick={() => { setPage((page) => (page - 1 === -1 ? page : page - 1)) }} />
          <AnimateSharedLayout>
            {postContentProps.imageSrc.map((data, index) => (
              <motion.div layout className={`w-1 h-1 rounded-full bg-main bg-opacity-40 mr-1 ${index === page && "w-2 h-2 bg-opacity-100"}`}></motion.div>
            ))}
          </AnimateSharedLayout>
          <img className="w-5 cursor-pointer ml-1" src="images/right.png" alt="right" onClick={() => { setPage((page) => (page + 1 === postContentProps.imageSrc.length ? page : page + 1)) }} />
        </div>
      }
      {selectedMode === "comment" && <Comment postDocID={postContentProps.docId}/>}
    </motion.div>
    )
}

export default Imagesw