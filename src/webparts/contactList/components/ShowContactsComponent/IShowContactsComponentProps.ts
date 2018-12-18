import { IWebPartContext } from "@microsoft/sp-webpart-base";

export interface IShowContactsComponentProps {
  context: IWebPartContext;
  updateContactsNumberInParent;
  contactsNum: number;
}

export interface IContactItem {
  name: string;
  surname: string;
  company: string;
  Id: string;
  salary: number;
  email: string;
  fullname: string;
}