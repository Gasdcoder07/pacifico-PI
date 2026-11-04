import PageHeader from "@/features/users/components/PageHeader";
import UsersContainer from "@/features/users/components/UsersContainer";

const Page = () => {
    return (
        <section className="h-full min-h-0 flex flex-col p-8 gap-8">
            <PageHeader/>

            <UsersContainer/>
        </section>
    );
};

export default Page;
