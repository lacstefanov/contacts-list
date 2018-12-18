import * as React from 'react';
import { IMainComponentProps } from './IMainComponentProps';
import { IMainComponentState } from './IMainComponentState';
import AddContactForm from '../AddContactForm/AddContactForm';
import ShowContactsComponent from '../ShowContactsComponent/ShowContactsComponent';
// import  AddContactForm from '../AddContactForm/AddContactForm';
// import ShowContactsComponent from '../ShowContactsComponent/ShowContactsComponent';

export default class MainComponent extends React.Component<IMainComponentProps, IMainComponentState> {
  constructor(props: IMainComponentProps) {
    super(props);


    this.state = {
      contactsNumber: 0
    }
    this.updateContactsNumber = this.updateContactsNumber.bind(this);
}

public updateContactsNumber = (args) => {
  this.setState({
    contactsNumber: args.length
  })
}

public updateContactsNumberIncrement = (args) => {
  this.setState({
    contactsNumber: +1
  })
}


  public render(): React.ReactElement<IMainComponentProps> {

    const { context } = this.props;

    return(<div>
        <AddContactForm
        context={context}
        updateContactsNumberInParent={this.updateContactsNumberIncrement}/>
        <p>
        <ShowContactsComponent
        updateContactsNumberInParent={this.updateContactsNumber}
        context={context}
        contactsNum={this.state.contactsNumber}/>
        </p>

    </div>)
  }
}