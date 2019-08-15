import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeName } from '../../redux/ChatActions';


class NameInput extends Component  {
	render() {
		return (
			<div className="md-form">
			<i className="fas fa-user prefix"></i>
			<input
				className="form-control"
				type="text"
				placeholder={'Enter your name...'}
				value={this.props.chat.from}
				onChange={(e) => {
					const { value } = e.target;
					this.props.changeName(value)
                    localStorage.setItem('userName', value)
				}}
			/>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	const { chat } = state
	return { chat }
  };
  
const mapDispatchToProps = dispatch => (
	bindActionCreators({
		changeName
	}, dispatch)
);
  
export default connect(mapStateToProps, mapDispatchToProps)(NameInput);

