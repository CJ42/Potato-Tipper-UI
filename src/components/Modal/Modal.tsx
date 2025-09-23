// Modal component
const Modal = ({
    title,
    isOpen,
    onClose,
    children,
    closeDisable = false,
    size = 3
}: {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    closeDisable?: boolean;
    size?: number;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg p-6 max-w-${size == 0 ? '' : size}xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {!closeDisable && (
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;