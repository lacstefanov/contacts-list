import * as React from 'react';
import styles from '../ContactList.module.scss';
import { IAddContactFormProps } from './IAddContactFormProps';
import { IAddContactFormState } from './IAddContactFormState';
import { TextField, Dropdown, DefaultButton, IDropdownOption } from 'office-ui-fabric-react';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientConfiguration, SPHttpClientResponse } from '@microsoft/sp-http';

export default class AddContactForm extends React.Component<IAddContactFormProps, IAddContactFormState> {

      constructor(props: IAddContactFormProps) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            userEmail: '',
            userCompany: '',
            userSalary: '0',
            userCompanies: [],
            emailIsValid: false,
            salaryIsNumber: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
        this.handleUserCompanyChange = this.handleUserCompanyChange.bind(this);
        this.handleUserSalaryChange = this.handleUserSalaryChange.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.salaryValidation = this.salaryValidation.bind(this);
        this.loadDropDownOptions = this.loadDropDownOptions.bind(this);
      }

      componentWillMount() {
        this.loadDropDownOptions();
      }


      public formValidation = () => {
        const { firstName, lastName, userCompany, emailIsValid, salaryIsNumber } = this.state;


        return (firstName.length > 0 && lastName.length > 0 && userCompany.length > 0 && emailIsValid === true
          && salaryIsNumber === true);
      }

      public salaryValidation = (salary) => {
          if (!isNaN(salary)) {
            this.setState(
              { salaryIsNumber: true}
            )
          }
          else {
            this.setState({
              salaryIsNumber: false
            })
          }
      }


      public validateEmail = (email) => {

        const pattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

        if( pattern.test(String(email).toLocaleLowerCase()) == true){
          this.setState({
            emailIsValid: true
          })
        }
        else{
          this.setState({
            emailIsValid: false
          })
        }
      }


      public loadDropDownOptions = () => {
        const { absoluteUrl } = this.props.context.pageContext.web;

        let companies: IDropdownOption[] = undefined;

        const getOptionsUrl: string = `${absoluteUrl}/_api/web/Lists/getByTitle('Company')/items?$select=CompanyName`;

        return new Promise<any[]>((resolve, reject) => {
          this.props.context.spHttpClient.get(
            getOptionsUrl,
            SPHttpClient.configurations.v1,
          ).then((res: SPHttpClientResponse) => res.json()
          .then((result) => {
            let options: any[] = result.value;
            companies = options.map((option) => {
              let opt: IDropdownOption = {
                text: option.CompanyName,
                key: option.CompanyName.toLocaleLowerCase()
              };
              return opt;
            })
            resolve(companies);
            this.setState({
              userCompanies: companies
            })
          }
          ))}
        )
        }


      public handleSubmit = () => {

        const { firstName, lastName, userEmail, userCompany, userSalary, emailIsValid } = this.state;
        const { absoluteUrl } = this.props.context.pageContext.web;

        const getContactsUrl: string = `${absoluteUrl}/_api/web/lists/getByTitle('LachezarStefanov')/items`;

        const createContactOpts: ISPHttpClientOptions = {
          body: `{
            "@odata.type": "SP.Data.LachezarStefanovListItem",
            "Title": "${lastName}",
            "FirstName": "${firstName}",
            "FullName": "${firstName} ${lastName}",
            "Email": "${userEmail}",
            "Company": "${userCompany}",
            "Salary": "${userSalary}"
        }`
      }

      if(emailIsValid === true){

      this.props.context.spHttpClient.post(getContactsUrl,
        SPHttpClient.configurations.v1, createContactOpts)
        .then((res) => console.log(res));
      }
      this.props.updateContactsNumberInParent()
      }



     public handleFirstNameChange = (input) => {
        this.setState({
          firstName: input
        })
      }

      public handleLastNameChange = (event) => {
        this.setState({
          lastName: event
        })
      }

      public handleUserEmailChange = (event) => {
        this.setState({
           userEmail: event
        })

        this.validateEmail(this.state.userEmail);
      }

      public handleUserCompanyChange = (option: IDropdownOption): void => {
          this.setState({
            userCompany: option.text
          })
      }

      public handleUserSalaryChange = (event) => {
        this.setState({
          userSalary: event
        })

        this.salaryValidation(this.state.userSalary);
      }


      public render(): React.ReactElement<IAddContactFormProps> {

        const { firstName, lastName, userEmail, userCompany, userSalary, userCompanies, emailIsValid } = this.state;
        const isEnabled = this.formValidation();

          return (<div>
              <label htmlFor="firstName">User first name:</label>
              <TextField
              id='firstName'
              onChanged={this.handleFirstNameChange}
              required={true}
              value={firstName}
               />
               <p>
              <label htmlFor="lastName">User last name:</label>
              <TextField
              id='lastName'
              onChanged={this.handleLastNameChange}
              required={true}
              value={lastName}
               />
               </p>
               <p>
              <label htmlFor="userEmail">User email:</label>
              <TextField
              id='userEmail'
              onChanged={this.handleUserEmailChange}
              required={true}
              value={userEmail}

               />
               </p>
               <label htmlFor="userCompany">User company:</label>
               <Dropdown
               options={userCompanies}
               onChanged={this.handleUserCompanyChange}
                />
                <p>
               <label htmlFor="userCompany">User salary:</label>
               <TextField
              id='userEmail'
              onChanged={this.handleUserSalaryChange}
              required={true}
              value={userSalary}
               />
               </p>
               <DefaultButton
               onClick={this.handleSubmit}
               label="Save"
               className = { styles.button }
               disabled={!isEnabled}>
               Save
               </DefaultButton>
          </div>);
      }

}

