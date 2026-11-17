"use client";

import CompanyForm from "./CompanyForm";
import { Company } from "../types/company";

interface CompanyFormContainerProps {
    isLoading: boolean;
    company?: Company;
}

const CompanyFormContainer = ({ isLoading, company }: CompanyFormContainerProps) => {
    if (isLoading) return (<CompanyFormSkeleton/>)

    if (company) {
        return (
            <CompanyForm company={company}/>
        );
    }
};

export default CompanyFormContainer;

const CompanyFormSkeleton = () => {
    return (
        <div className="bg-neutral-200 dark:bg-slate-800 shadow-sm rounded-lg h-96 animate-pulse duration-200 ease-in-out"/>
    )
}