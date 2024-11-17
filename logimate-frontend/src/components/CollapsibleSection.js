import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const contentVariants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: {
      height: {
        duration: 0.3
      },
      opacity: {
        duration: 0.2
      }
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      height: {
        duration: 0.3
      },
      opacity: {
        duration: 0.2,
        delay: 0.1
      }
    }
  }
};

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        whileTap={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      >
        <span className="text-lg font-semibold text-gray-700">{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </motion.button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CollapsibleSection;
