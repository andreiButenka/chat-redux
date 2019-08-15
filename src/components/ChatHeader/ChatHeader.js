import React, { Component } from 'react'
import { connect } from 'react-redux';
import { MDBCardBody, MDBRow, MDBCol } from "mdbreact";

class Header extends Component  {
	render() {
      return (
		<MDBCardBody>
			<MDBRow className="justify-content-center">
				<MDBCol md="6" xl="6" className="pl-md-3 mt-4 mt-md-0 px-lg-12">
					<div className={`d-flex justify-content-center ${this.props.chat.statusBackground}`} role="alert">
						{this.props.chat.status}
					</div>
				</MDBCol>
			</MDBRow>
			<MDBRow className="justify-content-center">
				<MDBCol md="6" xl="6" className="d-flex justify-content-center flex-wrap pl-md-3 mt-2 mt-md-0 px-lg-12">
					<button className="btn btn-danger" onClick={this.props.closeConnection}>Close</button>
					<button className="btn btn-success" onClick={this.props.openConnection}>Open</button>
					<button className="btn btn-light" onClick={this.props.switchNotifications}>{this.props.chat.switchNotificationButtonText}</button>
				</MDBCol>
			</MDBRow>
		</MDBCardBody>
	  )
	}
}

const mapStateToProps = (state) => {
	const { chat } = state
	return { chat }
};
  
export default connect(mapStateToProps)(Header);
