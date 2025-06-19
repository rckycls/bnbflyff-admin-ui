// context/ModalContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import Modal from '../components/ui/Modal';
import { useItemTooltip } from './ItemTooltipContext';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalContextType {
  showModal: (content: ReactNode, title?: string, size?: ModalSize) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalSize, setModalSize] = useState<ModalSize>('md');
  const { tooltipItem, setTooltipItem } = useItemTooltip();

  const showModal = (
    content: ReactNode,
    title?: string,
    size: ModalSize = 'md'
  ) => {
    setModalContent(content);
    setModalTitle(title);
    setModalSize(size);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
    setModalTitle(undefined);
    setModalSize('md');
    if (tooltipItem) {
      setTooltipItem(null);
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalTitle}
        size={modalSize}
      >
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};
