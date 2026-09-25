import CreateUserButton from "@/features/users/components/CreateUserButton";
import UsersTable from "@/features/users/components/UsersTable";

const page = () => {
    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden px-12 py-10 gap-10">
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Gestión de usuarios</h3>
                <p className="text-neutral-500 text-sm">Las personas que mantienen tu sucursal.</p>
            </div>

            <div className="flex flex-col gap-4">
                <CreateUserButton />

                <UsersTable/>
            </div>
        </section>
    );
};

export default page;
