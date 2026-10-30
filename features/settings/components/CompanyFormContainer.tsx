"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../services/company.service";

import CompanyForm from "./CompanyForm";

const CompanyFormContainer = () => {
    const { user } = useAuth();
    const companyId = user?.company_id;

    const { data: company, isPending } = useQuery({
        queryKey: ["getCompany"],
        queryFn: () => {
            if (companyId === undefined || companyId === null) {
                throw new Error("Company ID is required");
            }

            return getCompanyById(companyId);
        },
        enabled: !!companyId
    });

    if (isPending) return (<CompanyFormSkeleton/>)

    if (!company) return <p>Company not found.</p>

    return (
        <CompanyForm company={company}/>
    );
};

export default CompanyFormContainer;

const CompanyFormSkeleton = () => {
    return (
        <div className="bg-neutral-200 shadow-sm rounded-lg h-96 animate-pulse duration-200 ease-in-out"/>
    )
}