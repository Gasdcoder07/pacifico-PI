import { SlideOverPanelLayout } from "@/shared/components/SlideOverPanelLayout";

interface EditUserPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditUserPanel = ({ isOpen, onClose } : EditUserPanelProps) => {
    return (
        <SlideOverPanelLayout isOpen={isOpen} onClose={onClose} title="Editar usuario">
            <p>Hola</p>
        </SlideOverPanelLayout>
    )
};

export default EditUserPanel;
