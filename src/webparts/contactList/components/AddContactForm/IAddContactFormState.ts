import { IDropdownOption } from "office-ui-fabric-react";

export interface IAddContactFormState {
  firstName: string;
  lastName: string;
  userEmail: string;
  userCompany: string;
  userSalary: string;
  userCompanies: IDropdownOption[];
  emailIsValid: boolean;
  salaryIsNumber: boolean;
}