export type LoginResponseType = {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneCode: string;
    phoneNo: string;
    language: string;
    jobCapacity: string;
    company: {
        legalEntityName: string;
    };
    passwordChangedAt: string;
    updatedAt: string;
    createdAt: Date;
}