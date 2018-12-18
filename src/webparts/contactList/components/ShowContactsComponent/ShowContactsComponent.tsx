import * as React from 'react';
import { IShowContactsComponentProps, IContactItem } from './IShowContactsComponentProps';
import { IShowContactsComponentState } from './IShowContactsComponentState';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, SPHttpClientConfiguration } from '@microsoft/sp-http';
import PieChart from '../PieChart/PieChart';

export default class ShowContactsComponent extends React.Component<IShowContactsComponentProps, IShowContactsComponentState> {


  constructor(props: IShowContactsComponentProps) {
    super(props);

    this.state = {
      contactsArray: undefined,
      chartData: {},
    }
    this.showContacts = this.showContacts.bind(this);
    this.getChartData = this.getChartData.bind(this);

  }



  componentWillMount () {
    this.showContacts();
  }

  componentDidUpdate(prevProps){
    if(prevProps.contactsNum != this.props.contactsNum){
      this.showContacts();
    }
  }


  public getChartData = (array) => {
    let pieChartLabels: string[] = [];
    let pieChartValues: number[] = [];

    for(let i = 0; i < array.length ; i++){
      pieChartLabels[i] = array[i].fullname;
      pieChartValues[i] = array[i].salary;
    }

    this.setState({
      chartData: {
        labels: pieChartLabels,
        datasets:[{
        data: pieChartValues,
        backgroundColor: ['#BCCCE0', '#84DCCF', 'black', 'white', 'green', 'blue', 'orange', 'violet', 'gray',  'yellow']
      }]
  }
})
this.props.updateContactsNumberInParent(pieChartLabels);
}

public showContacts = () =>  {
    const { absoluteUrl } = this.props.context.pageContext.web;
    let contactList: IContactItem[] = undefined;

    const getContactsURL: string = `${absoluteUrl}/_api/web/Lists/getByTitle('LachezarStefanov')/items?$select=Id,FirstName,Title,Email,Company,Salary,FullName`;

    return new Promise<any[]>((resolve, reject) => {
      this.props.context.spHttpClient.get(
        getContactsURL,
        SPHttpClient.configurations.v1,
      ).then((res: SPHttpClientResponse) => res.json()
      .then((result) => {
        let contacts: any[] = result.value;
        contactList = contacts.map((contact) => {
          let con: IContactItem = {
            name: contact.FirstName,
            surname: contact.Title,
            email: contact.Email,
            company: contact.Company,
            salary: contact.Salary,
            Id: contact.ID,
            fullname: contact.FullName
          };
          return con;
        });
        resolve(contactList);
        this.setState({
          contactsArray: contactList
        })
        this.getChartData(contactList);
      }
      ))}
    )
  }


  public render(): React.ReactElement<IShowContactsComponentProps>{
    const { contactsArray } = this.state;
    let contacts = contactsArray !== undefined  ?
      contactsArray.map((contact) => {
        return(<div>
          <tr>
              <td>{contact.Id} </td><td>{contact.name} </td><td>{contact.surname} </td><td>{contact.email} </td><td>{contact.company} </td><td>{contact.salary}</td></tr>
        </div>)
      }) : <div> There are no contacts to show.</div>

    return(<div>
      <PieChart
      chartData={this.state.chartData}/>
      <p>
      <table>
        <tr>
          <td>Id </td><td>Name </td><td>Surname </td><td>Email </td><td>Company </td><td>Salary</td>
          </tr>
      </table>
      {contacts}
      </p>
    </div>);
  }
}