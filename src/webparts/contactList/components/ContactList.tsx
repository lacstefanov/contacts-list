import * as React from 'react';
import styles from './ContactList.module.scss';
import { IContactListProps } from './IContactListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField } from 'office-ui-fabric-react';
import MainComponent from './MainComponent/MainComponent'

export default class ContactList extends React.Component<IContactListProps, {}> {
  public render(): React.ReactElement<IContactListProps> {
    return (
      <div className={ styles.sharepointCandidates }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Form validation</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              {/* <p className={ styles.description }>{escape(this.props.description)}</p> */}
              <MainComponent
              context={this.props.context}/>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
