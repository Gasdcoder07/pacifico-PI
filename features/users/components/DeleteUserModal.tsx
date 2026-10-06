import { CustomSelect } from "@/shared/components/CustomSelect";
import { ModalLayout } from "@/shared/components/ModalLayout";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteUser } from "@/features/users/services/users.service";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userLastName: string;
    userId: string | number;
}

export const DeleteUserModal = ({ isOpen, onClose, userName, userLastName, userId }: DeleteUserModalProps) => {
    const queryClient = useQueryClient();

    const {
        mutate: mutateDeleteUser,
        isPending: isDeleting,
    } = useMutation({
        mutationFn: (id: string | number) => deleteUser(id),

        onSuccess: () => {
            toast.success("Usuario eliminado correctamente");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            onClose();
        },

        onError: () => {
            toast.error("Ocurrió un error al eliminar el usuario");
        },
    });

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="flex flex-col items-center justify-center size-14 bg-red-100 border border-red-200 rounded-full mx-auto">
                        <TriangleAlert size={40} className="text-red-500 -translate-y-0.5"/>
                    </div>

                    <h3 className="text-center text-xl font-semibold">Eliminar usuario</h3>
                </div>

                <p className="text-center text-muted-foreground">
                    Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar la información del usuario <span className="font-semibold text-neutral-900">{userName} {userLastName}</span>?
                </p>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors ease-in-out duration-200 cursor-pointer disabled:opacity-50"
                    >
                        Mantener usuario
                    </button>
                    <button
                        type="button"
                        onClick={() => mutateDeleteUser(userId)}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors ease-in-out duration-200 cursor-pointer disabled:opacity-50"
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar usuario"}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};